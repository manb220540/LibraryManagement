// backend/controllers/authController.js

// Import các thư viện và model cần thiết
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sequelize, NhanVien, DocGia } = require('../models');
const { generateOTP, sendVerificationEmail } = require('../config/email');
const logger = require('../src/logger'); // ✅ Thêm logger

// -------------------------
// Hàm tạo JWT token
// -------------------------
const generateToken = (user, type) => {
  const payload = {
    id: type === 'admin' ? user.MSNV : user.maDocGia,
    role: type,
    name: type === 'admin' ? user.hoTenNV : `${user.hoLot} ${user.ten}`
  };
  const secret = process.env.JWT_SECRET || 'default_secret_key';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

// -------------------------
// Đăng nhập dành cho nhân viên (Admin)
// -------------------------
const loginStaff = async (req, res) => {
  try {
    const { hoTenNV, password } = req.body;
    logger.info(`Đăng nhập nhân viên: ${hoTenNV}`);

    const nhanvien = await NhanVien.findOne({ where: { hoTenNV } });
    if (!nhanvien) {
      logger.warn(`Tên nhân viên không tồn tại: ${hoTenNV}`);
      return res.status(401).json({ error: 'Tên nhân viên không tồn tại' });
    }

    const isMatch = await bcrypt.compare(password, nhanvien.password);
    if (!isMatch) {
      logger.warn(`Sai mật khẩu cho nhân viên: ${hoTenNV}`);
      return res.status(401).json({ error: 'Mật khẩu không đúng' });
    }

    const token = generateToken(nhanvien, 'admin');
    logger.info(`Nhân viên đăng nhập thành công: ${hoTenNV}`);
    res.json({ message: 'Đăng nhập thành công', nhanvien, token });
  } catch (error) {
    logger.error(`Lỗi đăng nhập nhân viên: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

// -------------------------
// Đăng nhập dành cho độc giả
// -------------------------
const loginReader = async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info(`Đăng nhập độc giả: ${email}`);

    const docgia = await DocGia.findOne({ where: { email } });
    if (!docgia) {
      logger.warn(`Email độc giả không tồn tại: ${email}`);
      return res.status(400).send({ error: 'Invalid login credentials' });
    }

    const isMatch = await bcrypt.compare(password, docgia.password);
    if (!isMatch) {
      logger.warn(`Sai mật khẩu cho độc giả: ${email}`);
      return res.status(400).send({ error: 'Invalid login credentials' });
    }

    const [results] = await sequelize.query('CALL sp_check_reader_status(:maDocGia)', {
      replacements: { maDocGia: docgia.maDocGia },
      type: sequelize.QueryTypes.SELECT
    });

    const hasPendingLoan = results?.[0]?.hasPendingLoan || 0;
    if (hasPendingLoan > 0) {
      logger.warn(`Độc giả ${email} có yêu cầu mượn sách đang chờ.`);
      return res.status(403).send({ error: 'Cannot login. You have pending borrow requests.' });
    }

    const token = generateToken(docgia, 'reader');
    logger.info(`Độc giả đăng nhập thành công: ${email}`);
    res.send({ docgia, token });
  } catch (error) {
    logger.error(`Lỗi đăng nhập độc giả: ${error.message}`);
    res.status(400).send({ error: error.message || 'Đăng nhập thất bại' });
  }
};

// -------------------------
// Đăng ký tài khoản độc giả
// -------------------------
const registerReader = async (req, res) => {
  try {
    const { hoLot, ten, ngaySinh, phai, diaChi, dienThoai, email, password } = req.body;
    logger.info(`Đăng ký độc giả mới: ${email}`);

    const existingReader = await DocGia.findOne({ where: { email } });
    if (existingReader) {
      logger.warn(`Email đã tồn tại: ${email}`);
      return res.status(400).json({ error: 'Email đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const docgia = await DocGia.create({
      hoLot, ten, ngaySinh, phai, diaChi, dienThoai, email, password: hashedPassword
    });

    const token = generateToken(docgia, 'reader');
    logger.info(`Đăng ký độc giả thành công: ${email}`);
    res.status(201).json({ message: 'Đăng ký thành công', docgia, token });
  } catch (error) {
    logger.error(`Lỗi đăng ký độc giả: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

// -------------------------
// Gửi yêu cầu đổi mật khẩu (bằng OTP email)
// -------------------------
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    logger.info(`Yêu cầu reset mật khẩu: ${email}`);

    const docgia = await DocGia.findOne({ where: { email } });
    if (!docgia) {
      logger.warn(`Không tìm thấy email: ${email}`);
      return res.status(404).send({ error: 'Email not found' });
    }

    const otp = generateOTP();
    docgia.otp = otp;
    docgia.otpExpiry = Date.now() + 10 * 60 * 1000;
    await docgia.save();

    await sendVerificationEmail(email, otp);
    logger.info(`Gửi OTP thành công tới: ${email}`);
    res.send({ message: 'Verification email sent. Please check your inbox.' });
  } catch (error) {
    logger.error(`Lỗi gửi OTP reset mật khẩu: ${error.message}`);
    res.status(500).send({ error: error.message || 'Failed to request password reset' });
  }
};

// -------------------------
// Xác nhận OTP và đổi mật khẩu
// -------------------------
const confirmPasswordReset = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    logger.info(`Xác nhận đổi mật khẩu cho: ${email}`);

    const docgia = await DocGia.findOne({ where: { email } });
    if (!docgia) {
      logger.warn(`Email không tồn tại khi xác nhận OTP: ${email}`);
      return res.status(404).send({ error: 'Email not found' });
    }

    if (docgia.otp !== otp) {
      logger.warn(`OTP không hợp lệ cho ${email}`);
      return res.status(400).send({ error: 'Invalid OTP' });
    }

    if (Date.now() > docgia.otpExpiry) {
      logger.warn(`OTP đã hết hạn cho ${email}`);
      return res.status(400).send({ error: 'OTP has expired' });
    }

    docgia.password = await bcrypt.hash(newPassword, 8);
    docgia.otp = null;
    docgia.otpExpiry = null;
    await docgia.save();

    logger.info(`Đổi mật khẩu thành công cho ${email}`);
    res.send({ message: 'Password updated successfully. Redirecting to login.' });
  } catch (error) {
    logger.error(`Lỗi đổi mật khẩu cho ${email}: ${error.message}`);
    res.status(500).send({ error: error.message || 'Failed to update password' });
  }
};

// -------------------------
// Kiểm tra trạng thái độc giả
// -------------------------
const checkReaderStatus = async (req, res) => {
  try {
    const { maDocGia } = req.params;
    logger.info(`Kiểm tra trạng thái độc giả: ${maDocGia}`);

    const [results] = await sequelize.query('CALL sp_check_reader_status(:maDocGia, @hasPendingLoan)', {
      replacements: { maDocGia: parseInt(maDocGia) },
      type: sequelize.QueryTypes.SELECT
    });

    const hasPendingLoan = results?.[0]?.hasPendingLoan || 0;
    logger.info(`Trạng thái độc giả ${maDocGia}: ${hasPendingLoan ? 'Có yêu cầu mượn sách' : 'Không có yêu cầu'}`);

    res.send({ maDocGia, hasPendingLoan });
  } catch (error) {
    logger.error(`Lỗi kiểm tra trạng thái độc giả ${req.params.maDocGia}: ${error.message}`);
    res.status(400).send({ error: error.message || 'Failed to check reader status' });
  }
};

// -------------------------
// Xuất module
// -------------------------
module.exports = {
  loginStaff,
  loginReader,
  registerReader,
  requestPasswordReset,
  confirmPasswordReset,
  checkReaderStatus
};
