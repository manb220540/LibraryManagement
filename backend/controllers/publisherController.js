const logger = require('../src/logger');
const { sequelize, Sach, TacGia, NhaXuatBan, TheLoai } = require('../models');

// Lấy danh sách tất cả nhà xuất bản
const getAllPublishers = async (req, res) => {
  try {
    logger.info('Fetching all publishers with books');

    const [results] = await sequelize.query(`
      SELECT 
        nxb.*,
        COALESCE((
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'maSach', s.maSach,
              'tenSach', s.tenSach,
              'namXuatBan', s.namXuatBan,
              'soLuongHienCo', s.soLuongHienCo,
              'donGia', s.donGia
            )
          )
          FROM Sach s 
          WHERE s.maNXB = nxb.maNXB
        ), JSON_ARRAY()) AS Sach,
        (
          SELECT COUNT(*) 
          FROM Sach s 
          WHERE s.maNXB = nxb.maNXB
        ) AS soLuongSach
      FROM NhaXuatBan nxb
      ORDER BY nxb.tenNXB
    `);

    const publishers = results.map(pub => ({
      ...pub,
      Sach: typeof pub.Sach === 'string' ? JSON.parse(pub.Sach) : pub.Sach, // an toàn cho cả hai trường hợp
      soLuongSach: parseInt(pub.soLuongSach) || 0
    }));


    logger.info('Publishers fetched', { count: publishers.length });
    res.json(publishers);
  } catch (error) {
    logger.error('Error in getAllPublishers', { error: error.message, stack: error.stack });
    res.status(500).json({ message: error.message });
  }
};

// Thêm nhà xuất bản mới
const createPublisher = async (req, res) => {
  try {
    logger.info('Creating publisher', { data: req.body });
    const { maNXB, ...publisherData } = req.body; // Loại bỏ maNXB nếu có trong body
    const publisher = await NhaXuatBan.create(publisherData);
    logger.info('Publisher created', { publisher: publisher.toJSON() });
    res.status(201).json(publisher);
  } catch (error) {
    logger.error('Create publisher error', { error: error.message, stack: error.stack });
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật thông tin nhà xuất bản
const updatePublisher = async (req, res) => {
  try {
    const { id } = req.params; // Sử dụng 'id' thay vì 'maNXB'
    if (!id) {
      logger.warn('Missing publisher ID in request');
      return res.status(400).json({ message: 'Mã nhà xuất bản là bắt buộc' });
    }
    logger.info('Updating publisher', { id, data: req.body });
    const [updated] = await NhaXuatBan.update(req.body, {
      where: { maNXB: id }, // Ánh xạ 'id' sang 'maNXB'
      returning: true,
    });
    if (updated === 0) {
      logger.warn('Publisher not found', { id });
      return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản' });
    }
    const publisher = await NhaXuatBan.findByPk(id);
    logger.info('Publisher updated', { publisher: publisher.toJSON() });
    res.json(publisher);
  } catch (error) {
    logger.error('Update publisher error', { error: error.message, stack: error.stack });
    res.status(400).json({ message: error.message });
  }
};

// Xóa nhà xuất bản
const deletePublisher = async (req, res) => {
  try {
    const { id } = req.params; // Sử dụng 'id' thay vì 'maNXB'
    if (!id) {
      logger.warn('Missing publisher ID in request');
      return res.status(400).json({ message: 'Mã nhà xuất bản là bắt buộc' });
    }
    logger.info('Checking publisher books', { id });
    const [results] = await sequelize.query(
      'SELECT fn_check_publisher_books(:maNXB) as bookCount',
      {
        replacements: { maNXB: parseInt(id) }, // Ánh xạ 'id' sang 'maNXB'
        type: sequelize.QueryTypes.SELECT,
      }
    );
    const bookCount = results[0]?.bookCount || 0;
    if (bookCount > 0) {
      logger.warn('Cannot delete publisher due to associated books', { id, bookCount });
      return res.status(400).json({ message: 'Không thể xóa nhà xuất bản vì có sách liên kết' });
    }
    logger.info('Deleting publisher', { id });
    const deleted = await NhaXuatBan.destroy({ where: { maNXB: id } });
    if (deleted === 0) {
      logger.warn('Publisher not found for deletion', { id });
      return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản' });
    }
    logger.info('Publisher deleted successfully', { id });
    res.json({ message: 'Xóa nhà xuất bản thành công' });
  } catch (error) {
    if (error.message.includes('foreign key constraint fails')) {
      logger.warn('Cannot delete author due to foreign key constraint', { error: error.message });
      return res.status(409).json({ message: 'Không thể xóa nhà xuất bản vì có sách liên kết' });
    }
    logger.error('Delete publisher error', { error: error.message, stack: error.stack });
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin một nhà xuất bản theo ID
const getPublisherById = async (req, res) => {
  try {
    const { id } = req.params; // Sử dụng 'id' thay vì 'maNXB'
    if (!id) {
      logger.warn('Missing publisher ID in request');
      return res.status(400).json({ message: 'Mã nhà xuất bản là bắt buộc' });
    }
    logger.info('Fetching publisher by ID', { id });
    const publisher = await NhaXuatBan.findByPk(id);
    if (!publisher) {
      logger.warn('Publisher not found', { id });
      return res.status(404).json({ message: 'Không tìm thấy nhà xuất bản' });
    }
    logger.info('Publisher fetched', { publisher: publisher.toJSON() });
    res.json(publisher);
  } catch (error) {
    logger.error('Get publisher by ID error', { error: error.message, stack: error.stack });
    res.status(500).json({ message: error.message });
  }
};

// Tìm kiếm nhà xuất bản nâng cao
const searchPublishersAdvanced = async (req, res) => {
  try {
    const {
      tenNXB,
      maNXB,
      diaChi,
      namMin,
      namMax,
      sortBy = 'tenNXB',
      order = 'ASC',
      limit = 100,
      page = 1
    } = req.query;

    const offset = (page - 1) * limit;

    logger.info('Searching publishers advanced', req.query);

    // ---- Gọi procedure để tính tổng số bản ghi ----
    await sequelize.query(
      `CALL sp_tim_kiem_nha_xuat_ban_nang_cao(
        :tenNXB, :maNXB, :diaChi, :namMin, :namMax,
        :sortBy, :order, :limit, :offset, @total
      )`,
      {
        replacements: {
          tenNXB: tenNXB || null,
          maNXB: maNXB ? parseInt(maNXB) : null,
          diaChi: diaChi || null,
          namMin: namMin ? parseInt(namMin) : null,
          namMax: namMax ? parseInt(namMax) : null,
          sortBy,
          order: order.toUpperCase(),
          limit: parseInt(limit),
          offset: parseInt(offset)
        },
        type: sequelize.QueryTypes.RAW
      }
    );

    // ---- Lấy @total từ procedure ----
    const [[{ total }]] = await sequelize.query('SELECT @total AS total');

    // ---- Lấy dữ liệu hiển thị ----
    const where = [];
    if (tenNXB) where.push(`nxb.tenNXB LIKE '%${tenNXB}%'`);
    if (maNXB) where.push(`nxb.maNXB = ${maNXB}`);
    if (diaChi) where.push(`nxb.diaChi LIKE '%${diaChi}%'`);
    if (namMin) where.push(`(s.namXuatBan >= ${namMin} OR s.namXuatBan IS NULL)`);
    if (namMax) where.push(`(s.namXuatBan <= ${namMax} OR s.namXuatBan IS NULL)`);

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const sql = `
      SELECT 
        nxb.*,
        COALESCE((
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'maSach', s.maSach,
              'tenSach', s.tenSach,
              'namXuatBan', s.namXuatBan,
              'soLuongHienCo', s.soLuongHienCo,
              'donGia', s.donGia
            )
          )
          FROM Sach s 
          WHERE s.maNXB = nxb.maNXB
        ), JSON_ARRAY()) AS Sach,
        (
          SELECT COUNT(*) 
          FROM Sach s 
          WHERE s.maNXB = nxb.maNXB
        ) AS soLuongSach
      FROM NhaXuatBan nxb
      LEFT JOIN Sach s ON nxb.maNXB = s.maNXB
      ${whereClause}
      GROUP BY nxb.maNXB
      ORDER BY nxb.${sortBy} ${order}
      LIMIT ${limit} OFFSET ${offset};
    `;

    const [data] = await sequelize.query(sql);

    // ---- 4️⃣ Chuẩn hóa dữ liệu ----
    const publishers = data.map(pub => ({
      ...pub,
      Sach: Array.isArray(pub.Sach)
        ? pub.Sach
        : typeof pub.Sach === 'string'
        ? JSON.parse(pub.Sach)
        : [],
      soLuongSach: parseInt(pub.soLuongSach) || 0
    }));

    // ---- Trả kết quả ----
    res.json({
      data: publishers,
      pagination: {
        total: total || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil((total || 0) / limit)
      }
    });

  } catch (error) {
    logger.error('Search publishers advanced error', { error: error.message });
    res.status(500).json({ message: 'Lỗi tìm kiếm nhà xuất bản' });
  }
};



// Xuất các hàm để sử dụng trong file routes
module.exports = {
  getAllPublishers,
  createPublisher,
  updatePublisher,
  deletePublisher,
  getPublisherById,
  searchPublishersAdvanced,
};