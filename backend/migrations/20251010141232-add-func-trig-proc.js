'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Xóa trước nếu đã tồn tại
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS fn_kiem_tra_so_luong_sach;');
    await queryInterface.sequelize.query(`
      CREATE FUNCTION fn_kiem_tra_so_luong_sach(maSach_in INT)
      RETURNS INT DETERMINISTIC
      BEGIN
        DECLARE soLuong INT;
        SELECT soLuongHienCo INTO soLuong FROM Sach WHERE maSach = maSach_in;
        RETURN soLuong;
      END
    `);

    // Function: Kiểm tra số sách của tác giả
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS fn_check_author_books;');
    await queryInterface.sequelize.query(`
      CREATE FUNCTION fn_check_author_books (maTacGia_in INT)
      RETURNS INT DETERMINISTIC
      BEGIN
        DECLARE bookCount INT;
        SELECT COUNT(*) INTO bookCount FROM Sach WHERE maTacGia = maTacGia_in;
        RETURN bookCount;
      END
    `);

    // Trigger tính tiền phạt khi trả sách
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS trg_tinh_tien_phat;');
    await queryInterface.sequelize.query(`
      CREATE TRIGGER trg_tinh_tien_phat
      BEFORE INSERT ON PhieuTra
      FOR EACH ROW
      BEGIN
        DECLARE ngayTraDuKien DATE;
        DECLARE soNgayMuon INT;
        DECLARE rate FLOAT DEFAULT 1000;

        SELECT PhieuMuon.ngayTra INTO ngayTraDuKien
        FROM ChiTietPhieuMuon
        JOIN PhieuMuon ON ChiTietPhieuMuon.maPhieuMuon = PhieuMuon.maPhieuMuon
        WHERE ChiTietPhieuMuon.maChiTietPM = NEW.maChiTietPM;

        SET soNgayMuon = GREATEST(0, DATEDIFF(NEW.ngayTraSach, ngayTraDuKien));
        SET NEW.tienPhat = soNgayMuon * rate;
      END
    `);

    // Trigger giảm số lượng sách khi mượn
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS trg_giam_so_luong_sach;');
    await queryInterface.sequelize.query(`
      CREATE TRIGGER trg_giam_so_luong_sach
      AFTER INSERT ON ChiTietPhieuMuon
      FOR EACH ROW
      BEGIN
        UPDATE Sach
        SET soLuongHienCo = soLuongHienCo - NEW.soLuongSachMuon
        WHERE maSach = NEW.maSach;
      END
    `);

    // Trigger tăng số lượng sách khi trả
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS trg_tang_so_luong_sach;');
    await queryInterface.sequelize.query(`
      CREATE TRIGGER trg_tang_so_luong_sach
      AFTER INSERT ON PhieuTra
      FOR EACH ROW
      BEGIN
        DECLARE sl_muon INT;
        SELECT soLuongSachMuon INTO sl_muon
        FROM ChiTietPhieuMuon
        WHERE maChiTietPM = NEW.maChiTietPM;

        UPDATE Sach
        SET soLuongHienCo = soLuongHienCo + sl_muon
        WHERE maSach = (SELECT maSach FROM ChiTietPhieuMuon WHERE maChiTietPM = NEW.maChiTietPM);
      END
    `);

    // Procedure: danh sách phiếu mượn chưa trả
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS sp_danh_sach_phieu_muon_chua_tra;');
    await queryInterface.sequelize.query(`
      CREATE PROCEDURE sp_danh_sach_phieu_muon_chua_tra ()
      BEGIN
        SELECT * FROM PhieuMuon WHERE trangThai = 'Dang muon';
      END
    `);

    // Procedure: thống kê sách mượn trong tháng
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS sp_thong_ke_sach_muon_thang;');
    await queryInterface.sequelize.query(`
      CREATE PROCEDURE sp_thong_ke_sach_muon_thang ()
      BEGIN
        SELECT SUM(ChiTietPhieuMuon.soLuongSachMuon) AS tongSachMuonThang
        FROM ChiTietPhieuMuon
        JOIN PhieuMuon ON ChiTietPhieuMuon.maPhieuMuon = PhieuMuon.maPhieuMuon
        WHERE MONTH(PhieuMuon.ngayMuon) = MONTH(CURRENT_DATE())
          AND YEAR(PhieuMuon.ngayMuon) = YEAR(CURRENT_DATE());
      END
    `);

    // Procedure: thống kê sách đang mượn trong năm
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS sp_thong_ke_sach_dang_muon_nam;');
    await queryInterface.sequelize.query(`
      CREATE PROCEDURE sp_thong_ke_sach_dang_muon_nam ()
      BEGIN
        SELECT SUM(ChiTietPhieuMuon.soLuongSachMuon) AS tongSachDangMuonNam
        FROM ChiTietPhieuMuon
        JOIN PhieuMuon ON ChiTietPhieuMuon.maPhieuMuon = PhieuMuon.maPhieuMuon
        WHERE YEAR(PhieuMuon.ngayMuon) = YEAR(CURRENT_DATE())
          AND PhieuMuon.trangThai = 'Dang muon';
      END
    `);

    // Procedure: kiểm tra trạng thái độc giả
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS sp_check_reader_status;');
    await queryInterface.sequelize.query(`
      CREATE PROCEDURE sp_check_reader_status (IN maDocGia_in INT)
      BEGIN
        DECLARE hasPendingLoan INT;
        SELECT COUNT(*) INTO hasPendingLoan
        FROM PhieuMuon
        WHERE maDocGia = maDocGia_in AND trangThai = 'Dang muon';
        SELECT hasPendingLoan AS hasPendingLoan;
      END
    `);

    // Procedure: kiểm tra tính hợp lệ khóa ngoại của sách
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS sp_validate_book_foreign_keys;');
    await queryInterface.sequelize.query(`
      CREATE PROCEDURE sp_validate_book_foreign_keys (
        IN maTacGia_in INT,
        IN maNXB_in INT,
        IN maTheLoai_in INT,
        OUT isValid INT
      )
      BEGIN
        DECLARE tacGiaExists INT;
        DECLARE nxbExists INT;
        DECLARE theLoaiExists INT;

        SELECT COUNT(*) INTO tacGiaExists FROM TacGia WHERE maTacGia = maTacGia_in;
        SELECT COUNT(*) INTO nxbExists FROM NhaXuatBan WHERE maNXB = maNXB_in;
        SELECT COUNT(*) INTO theLoaiExists FROM TheLoai WHERE maTheLoai = maTheLoai_in;

        IF tacGiaExists > 0 AND nxbExists > 0 AND theLoaiExists > 0 THEN
          SET isValid = 1;
        ELSE
          SET isValid = 0;
        END IF;

        -- Explicitly return the isValid value as a result set
        SELECT isValid AS isValid;
      END 
    `);

    // Function: kiểm tra số sách của nhà xuất bản
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS fn_check_publisher_books;');
    await queryInterface.sequelize.query(`
      CREATE FUNCTION fn_check_publisher_books (maNXB_in INT)
      RETURNS INT DETERMINISTIC
      BEGIN
        DECLARE bookCount INT;
        SELECT COUNT(*) INTO bookCount FROM Sach WHERE maNXB = maNXB_in;
        RETURN bookCount;
      END
    `);
    // Procedure: tìm kiếm sách nâng cao
    await queryInterface.sequelize.query(`
      DROP PROCEDURE IF EXISTS sp_tim_kiem_sach_nang_cao;
    `);
    await queryInterface.sequelize.query(`
      CREATE PROCEDURE sp_tim_kiem_sach_nang_cao(
        IN p_tenSach VARCHAR(255),
        IN p_maSach INT,
        IN p_maTacGia INT,
        IN p_maNXB INT,
        IN p_maTheLoai INT,
        IN p_namMin INT,
        IN p_namMax INT,
        IN p_nguonGoc VARCHAR(100),
        IN p_sortBy VARCHAR(50),
        IN p_order VARCHAR(4),
        IN p_limit INT,
        IN p_offset INT,
        OUT p_total INT
      )
      BEGIN
        -- Đếm tổng số bản ghi
        SET @count_sql = 'SELECT COUNT(*) INTO @total_count FROM Sach
                          LEFT JOIN TacGia ON Sach.maTacGia = TacGia.maTacGia
                          LEFT JOIN NhaXuatBan ON Sach.maNXB = NhaXuatBan.maNXB
                          LEFT JOIN TheLoai ON Sach.maTheLoai = TheLoai.maTheLoai
                          WHERE 1=1';

        -- Truy vấn chính: trả về JSON_OBJECT cho TacGia, NhaXuatBan, TheLoai
        SET @sql = 'SELECT
                      Sach.*,
                      JSON_OBJECT(
                        "maTacGia", TacGia.maTacGia,
                        "tenTacGia", TacGia.tenTacGia
                      ) AS TacGia,
                      JSON_OBJECT(
                        "maNXB", NhaXuatBan.maNXB,
                        "tenNXB", NhaXuatBan.tenNXB
                      ) AS NhaXuatBan,
                      JSON_OBJECT(
                        "maTheLoai", TheLoai.maTheLoai,
                        "tenTheLoai", TheLoai.tenTheLoai
                      ) AS TheLoai
                    FROM Sach
                    LEFT JOIN TacGia ON Sach.maTacGia = TacGia.maTacGia
                    LEFT JOIN NhaXuatBan ON Sach.maNXB = NhaXuatBan.maNXB
                    LEFT JOIN TheLoai ON Sach.maTheLoai = TheLoai.maTheLoai
                    WHERE 1=1';

        -- === XÂY DỰNG ĐIỀU KIỆN ===
        IF p_tenSach IS NOT NULL AND p_tenSach != '' THEN
          SET @sql = CONCAT(@sql, ' AND Sach.tenSach LIKE ', QUOTE(CONCAT('%', p_tenSach, '%')));
          SET @count_sql = CONCAT(@count_sql, ' AND Sach.tenSach LIKE ', QUOTE(CONCAT('%', p_tenSach, '%')));
        END IF;

        IF p_maSach IS NOT NULL THEN
          SET @sql = CONCAT(@sql, ' AND Sach.maSach = ', p_maSach);
          SET @count_sql = CONCAT(@count_sql, ' AND Sach.maSach = ', p_maSach);
        END IF;

        IF p_maTacGia IS NOT NULL THEN
          SET @sql = CONCAT(@sql, ' AND Sach.maTacGia = ', p_maTacGia);
          SET @count_sql = CONCAT(@count_sql, ' AND Sach.maTacGia = ', p_maTacGia);
        END IF;

        IF p_maNXB IS NOT NULL THEN
          SET @sql = CONCAT(@sql, ' AND Sach.maNXB = ', p_maNXB);
          SET @count_sql = CONCAT(@count_sql, ' AND Sach.maNXB = ', p_maNXB);
        END IF;

        IF p_maTheLoai IS NOT NULL THEN
          SET @sql = CONCAT(@sql, ' AND Sach.maTheLoai = ', p_maTheLoai);
          SET @count_sql = CONCAT(@count_sql, ' AND Sach.maTheLoai = ', p_maTheLoai);
        END IF;

        IF p_namMin IS NOT NULL THEN
          SET @sql = CONCAT(@sql, ' AND Sach.namXuatBan >= ', p_namMin);
          SET @count_sql = CONCAT(@count_sql, ' AND Sach.namXuatBan >= ', p_namMin);
        END IF;

        IF p_namMax IS NOT NULL THEN
          SET @sql = CONCAT(@sql, ' AND Sach.namXuatBan <= ', p_namMax);
          SET @count_sql = CONCAT(@count_sql, ' AND Sach.namXuatBan <= ', p_namMax);
        END IF;

        IF p_nguonGoc IS NOT NULL AND p_nguonGoc != '' THEN
          SET @sql = CONCAT(@sql, ' AND Sach.nguonGoc LIKE ', QUOTE(CONCAT('%', p_nguonGoc, '%')));
          SET @count_sql = CONCAT(@count_sql, ' AND Sach.nguonGoc LIKE ', QUOTE(CONCAT('%', p_nguonGoc, '%')));
        END IF;

        -- === SẮP XẾP ===
        SET @sortField = IFNULL(NULLIF(p_sortBy, ''), 'tenSach');
        SET @sortOrder = IFNULL(NULLIF(p_order, ''), 'ASC');
        SET @sql = CONCAT(@sql, ' ORDER BY Sach.', @sortField, ' ', @sortOrder);

        -- === PHÂN TRANG ===
        SET @sql = CONCAT(@sql, ' LIMIT ', p_limit, ' OFFSET ', p_offset);

        -- === THỰC THI ĐẾM TỔNG ===
        PREPARE count_stmt FROM @count_sql;
        EXECUTE count_stmt;
        DEALLOCATE PREPARE count_stmt;
        SET p_total = @total_count;

        -- === THỰC THI TRUY VẤN CHÍNH ===
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
      END
    `);
    await queryInterface.sequelize.query(`
  DROP PROCEDURE IF EXISTS sp_tim_kiem_nha_xuat_ban_nang_cao;
`);

await queryInterface.sequelize.query(`
  CREATE PROCEDURE sp_tim_kiem_nha_xuat_ban_nang_cao(
    IN p_tenNXB VARCHAR(255),
    IN p_maNXB INT,
    IN p_diaChi VARCHAR(255),
    IN p_namMin INT,
    IN p_namMax INT,
    IN p_sortBy VARCHAR(50),
    IN p_order VARCHAR(4),
    IN p_limit INT,
    IN p_offset INT,
    OUT p_total INT
)
BEGIN
    DECLARE v_sortBy VARCHAR(50) DEFAULT 'maNXB';
    DECLARE v_order VARCHAR(4) DEFAULT 'ASC';
    DECLARE v_sql TEXT;
    DECLARE v_count_sql TEXT;

    -- Kiểm tra sortBy hợp lệ để tránh lỗi hoặc SQL injection
    IF p_sortBy IN ('maNXB', 'tenNXB', 'diaChi') THEN
        SET v_sortBy = p_sortBy;
    END IF;

    IF UPPER(p_order) IN ('ASC', 'DESC') THEN
        SET v_order = UPPER(p_order);
    END IF;

    -- Câu SQL đếm tổng
    SET v_count_sql = 'SELECT COUNT(DISTINCT nxb.maNXB)
                       FROM NhaXuatBan nxb
                       LEFT JOIN Sach s ON nxb.maNXB = s.maNXB
                       WHERE 1=1';

    -- Câu SQL chính
    SET v_sql = 'SELECT 
                    nxb.*,
                    COALESCE(
                        JSON_ARRAYAGG(
                            CASE 
                                WHEN s.maSach IS NOT NULL THEN JSON_OBJECT(
                                    "maSach", s.maSach,
                                    "tenSach", s.tenSach,
                                    "namXuatBan", s.namXuatBan,
                                    "soLuongHienCo", s.soLuongHienCo,
                                    "donGia", s.donGia
                                )
                            END
                        ), JSON_ARRAY()
                    ) AS Sach
                FROM NhaXuatBan nxb
                LEFT JOIN Sach s ON nxb.maNXB = s.maNXB
                WHERE 1=1';

    -- Thêm điều kiện lọc
    IF p_tenNXB IS NOT NULL AND p_tenNXB != '' THEN
        SET v_sql = CONCAT(v_sql, ' AND nxb.tenNXB LIKE ', QUOTE(CONCAT('%', p_tenNXB, '%')));
        SET v_count_sql = CONCAT(v_count_sql, ' AND nxb.tenNXB LIKE ', QUOTE(CONCAT('%', p_tenNXB, '%')));
    END IF;
    IF p_maNXB IS NOT NULL THEN
        SET v_sql = CONCAT(v_sql, ' AND nxb.maNXB = ', p_maNXB);
        SET v_count_sql = CONCAT(v_count_sql, ' AND nxb.maNXB = ', p_maNXB);
    END IF;
    IF p_diaChi IS NOT NULL AND p_diaChi != '' THEN
        SET v_sql = CONCAT(v_sql, ' AND nxb.diaChi LIKE ', QUOTE(CONCAT('%', p_diaChi, '%')));
        SET v_count_sql = CONCAT(v_count_sql, ' AND nxb.diaChi LIKE ', QUOTE(CONCAT('%', p_diaChi, '%')));
    END IF;
    IF p_namMin IS NOT NULL THEN
        SET v_sql = CONCAT(v_sql, ' AND (s.namXuatBan >= ', p_namMin, ' OR s.namXuatBan IS NULL)');
        SET v_count_sql = CONCAT(v_count_sql, ' AND (s.namXuatBan >= ', p_namMin, ' OR s.namXuatBan IS NULL)');
    END IF;
    IF p_namMax IS NOT NULL THEN
        SET v_sql = CONCAT(v_sql, ' AND (s.namXuatBan <= ', p_namMax, ' OR s.namXuatBan IS NULL)');
        SET v_count_sql = CONCAT(v_count_sql, ' AND (s.namXuatBan <= ', p_namMax, ' OR s.namXuatBan IS NULL)');
    END IF;

    -- Thêm GROUP BY và ORDER BY
    SET v_sql = CONCAT(v_sql,
        ' GROUP BY nxb.maNXB 
          ORDER BY nxb.', v_sortBy, ' ', v_order,
        ' LIMIT ', p_limit, ' OFFSET ', p_offset);

    -- Đếm tổng
    SET @count_query = v_count_sql;
    PREPARE stmt_count FROM @count_query;
    EXECUTE stmt_count;
    DEALLOCATE PREPARE stmt_count;

    SELECT COUNT(*) INTO p_total FROM (
        SELECT DISTINCT nxb.maNXB
        FROM NhaXuatBan nxb
        LEFT JOIN Sach s ON nxb.maNXB = s.maNXB
        WHERE 1=1
    ) AS tmp;

    -- Truy vấn chính
    SET @final_sql = v_sql;
    PREPARE stmt FROM @final_sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END
`);

    await queryInterface.sequelize.query(`
  DROP PROCEDURE IF EXISTS sp_tim_kiem_tac_gia_nang_cao;
`);

await queryInterface.sequelize.query(`
  CREATE PROCEDURE sp_tim_kiem_tac_gia_nang_cao(
    IN p_tenTacGia VARCHAR(255),
    IN p_maTacGia INT,
    IN p_diaChi VARCHAR(255),
    IN p_namMin INT,
    IN p_namMax INT,
    IN p_sortBy VARCHAR(50),
    IN p_order VARCHAR(5),
    IN p_limit INT,
    IN p_offset INT,
    OUT p_total INT
)
BEGIN
    DECLARE v_sortBy VARCHAR(50) DEFAULT 'maTacGia';
    DECLARE v_order VARCHAR(5) DEFAULT 'ASC';
    DECLARE v_sql TEXT;
    DECLARE v_count_sql TEXT;

    IF p_sortBy IN ('maTacGia', 'tenTacGia', 'diaChi') THEN
        SET v_sortBy = p_sortBy;
    END IF;

    IF UPPER(p_order) IN ('ASC', 'DESC') THEN
        SET v_order = UPPER(p_order);
    END IF;

    SET v_count_sql = 'SELECT COUNT(DISTINCT tg.maTacGia) AS total
                       FROM TacGia tg
                       LEFT JOIN Sach s ON tg.maTacGia = s.maTacGia
                       WHERE 1=1';

    SET v_sql = 'SELECT 
                    tg.*,
                    COALESCE(
                        JSON_ARRAYAGG(
                            CASE 
                                WHEN s.maSach IS NOT NULL THEN JSON_OBJECT(
                                    "maSach", s.maSach,
                                    "tenSach", s.tenSach,
                                    "namXuatBan", s.namXuatBan,
                                    "soLuongHienCo", s.soLuongHienCo,
                                    "donGia", s.donGia
                                )
                                ELSE NULL
                            END
                        ), JSON_ARRAY()
                    ) AS Sach
                FROM TacGia tg
                LEFT JOIN Sach s ON tg.maTacGia = s.maTacGia
                WHERE 1=1';

    -- Lọc theo tên
    IF p_tenTacGia IS NOT NULL AND p_tenTacGia != '' THEN
        SET v_sql = CONCAT(v_sql, ' AND tg.tenTacGia LIKE ', QUOTE(CONCAT('%', p_tenTacGia, '%')));
        SET v_count_sql = CONCAT(v_count_sql, ' AND tg.tenTacGia LIKE ', QUOTE(CONCAT('%', p_tenTacGia, '%')));
    END IF;

    -- Lọc theo mã
    IF p_maTacGia IS NOT NULL THEN
        SET v_sql = CONCAT(v_sql, ' AND tg.maTacGia = ', p_maTacGia);
        SET v_count_sql = CONCAT(v_count_sql, ' AND tg.maTacGia = ', p_maTacGia);
    END IF;

    -- Lọc theo địa chỉ
    IF p_diaChi IS NOT NULL AND p_diaChi != '' THEN
        SET v_sql = CONCAT(v_sql, ' AND tg.diaChi LIKE ', QUOTE(CONCAT('%', p_diaChi, '%')));
        SET v_count_sql = CONCAT(v_count_sql, ' AND tg.diaChi LIKE ', QUOTE(CONCAT('%', p_diaChi, '%')));
    END IF;

    -- Lọc theo năm xuất bản
    IF p_namMin IS NOT NULL THEN
        SET v_sql = CONCAT(v_sql, ' AND (s.namXuatBan >= ', p_namMin, ' OR s.namXuatBan IS NULL)');
        SET v_count_sql = CONCAT(v_count_sql, ' AND (s.namXuatBan >= ', p_namMin, ' OR s.namXuatBan IS NULL)');
    END IF;

    IF p_namMax IS NOT NULL THEN
        SET v_sql = CONCAT(v_sql, ' AND (s.namXuatBan <= ', p_namMax, ' OR s.namXuatBan IS NULL)');
        SET v_count_sql = CONCAT(v_count_sql, ' AND (s.namXuatBan <= ', p_namMax, ' OR s.namXuatBan IS NULL)');
    END IF;

    -- Nhóm & sắp xếp
    SET v_sql = CONCAT(v_sql,
        ' GROUP BY tg.maTacGia 
          ORDER BY tg.', v_sortBy, ' ', v_order);

    IF p_limit IS NOT NULL AND p_offset IS NOT NULL THEN
        SET v_sql = CONCAT(v_sql, ' LIMIT ', p_limit, ' OFFSET ', p_offset);
    END IF;

    -- Tính tổng
    SET @count_query = v_count_sql;
    PREPARE stmt_count FROM @count_query;
    EXECUTE stmt_count;
    DEALLOCATE PREPARE stmt_count;

    SELECT COUNT(DISTINCT tg.maTacGia) INTO p_total
    FROM TacGia tg
    LEFT JOIN Sach s ON tg.maTacGia = s.maTacGia
    WHERE 1=1;

    -- Truy vấn chính
    SET @final_sql = v_sql;
    PREPARE stmt FROM @final_sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END


`);
 


    await queryInterface.sequelize.query(`
      DROP PROCEDURE IF EXISTS sp_tim_kiem_the_loai_nang_cao;
    `);
    await queryInterface.sequelize.query(`
      CREATE PROCEDURE sp_tim_kiem_the_loai_nang_cao(
          IN p_tenTheLoai VARCHAR(255),
          IN p_maTheLoai INT,
          IN p_namMin INT,
          IN p_namMax INT,
          IN p_sortBy VARCHAR(50),
          IN p_order VARCHAR(4),
          IN p_limit INT,
          IN p_offset INT,
          OUT p_total INT
      )
      BEGIN
          DECLARE v_sortBy VARCHAR(50) DEFAULT 'tenTheLoai';
          DECLARE v_order VARCHAR(4) DEFAULT 'ASC';
          DECLARE v_sql TEXT;
          DECLARE v_count_sql TEXT;

          -- Xác thực tên cột & thứ tự để tránh SQL Injection
          IF p_sortBy IN ('maTheLoai', 'tenTheLoai') THEN
              SET v_sortBy = p_sortBy;
          END IF;

          IF UPPER(p_order) IN ('ASC', 'DESC') THEN
              SET v_order = UPPER(p_order);
          END IF;

          -- Câu truy vấn đếm tổng
          SET v_count_sql = 'SELECT COUNT(DISTINCT tl.maTheLoai)
                            FROM TheLoai tl
                            LEFT JOIN Sach s ON tl.maTheLoai = s.maTheLoai
                            WHERE 1=1';

          -- Câu truy vấn chính
          SET v_sql = 'SELECT 
                          tl.*,
                          COALESCE(
                              JSON_ARRAYAGG(
                                  CASE 
                                      WHEN s.maSach IS NOT NULL THEN JSON_OBJECT(
                                          "maSach", s.maSach,
                                          "tenSach", s.tenSach,
                                          "namXuatBan", s.namXuatBan,
                                          "soLuongHienCo", s.soLuongHienCo,
                                          "donGia", s.donGia
                                      )
                                  END
                              ),
                              JSON_ARRAY()
                          ) AS Sach
                      FROM TheLoai tl
                      LEFT JOIN Sach s ON tl.maTheLoai = s.maTheLoai
                      WHERE 1=1';

          --  Thêm điều kiện
          IF p_tenTheLoai IS NOT NULL AND p_tenTheLoai != '' THEN
              SET v_sql = CONCAT(v_sql, ' AND tl.tenTheLoai LIKE ', QUOTE(CONCAT('%', p_tenTheLoai, '%')));
              SET v_count_sql = CONCAT(v_count_sql, ' AND tl.tenTheLoai LIKE ', QUOTE(CONCAT('%', p_tenTheLoai, '%')));
          END IF;

          IF p_maTheLoai IS NOT NULL THEN
              SET v_sql = CONCAT(v_sql, ' AND tl.maTheLoai = ', p_maTheLoai);
              SET v_count_sql = CONCAT(v_count_sql, ' AND tl.maTheLoai = ', p_maTheLoai);
          END IF;

          IF p_namMin IS NOT NULL THEN
              SET v_sql = CONCAT(v_sql, ' AND (s.namXuatBan >= ', p_namMin, ' OR s.namXuatBan IS NULL)');
              SET v_count_sql = CONCAT(v_count_sql, ' AND (s.namXuatBan >= ', p_namMin, ' OR s.namXuatBan IS NULL)');
          END IF;

          IF p_namMax IS NOT NULL THEN
              SET v_sql = CONCAT(v_sql, ' AND (s.namXuatBan <= ', p_namMax, ' OR s.namXuatBan IS NULL)');
              SET v_count_sql = CONCAT(v_count_sql, ' AND (s.namXuatBan <= ', p_namMax, ' OR s.namXuatBan IS NULL)');
          END IF;

          -- Thêm GROUP BY và ORDER BY
          SET v_sql = CONCAT(
              v_sql, 
              ' GROUP BY tl.maTheLoai 
                ORDER BY tl.', v_sortBy, ' ', v_order,
              ' LIMIT ', p_limit, ' OFFSET ', p_offset
          );

          -- Truy vấn tổng số dòng
          SET @count_query = v_count_sql;
          PREPARE stmt_count FROM @count_query;
          EXECUTE stmt_count;
          DEALLOCATE PREPARE stmt_count;

          -- Lưu tổng kết quả vào biến
          SELECT COUNT(*) INTO p_total FROM (
              SELECT DISTINCT tl.maTheLoai
              FROM TheLoai tl
              LEFT JOIN Sach s ON tl.maTheLoai = s.maTheLoai
              WHERE 1=1
          ) AS tmp;

          -- Truy vấn chính
          SET @final_sql = v_sql;
          PREPARE stmt FROM @final_sql;
          EXECUTE stmt;
          DEALLOCATE PREPARE stmt;
      END
    `);

    
    
  
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS trg_tinh_tien_phat;');
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS trg_giam_so_luong_sach;');
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS trg_tang_so_luong_sach;');
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS sp_danh_sach_phieu_muon_chua_tra;');
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS sp_thong_ke_sach_muon_thang;');
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS sp_thong_ke_sach_dang_muon_nam;');
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS sp_check_reader_status;');
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS sp_validate_book_foreign_keys;');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS fn_check_author_books;');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS fn_check_publisher_books;');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS fn_kiem_tra_so_luong_sach;');
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS sp_tim_kiem_sach_nang_cao;');
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS sp_tim_kiem_nha_xuat_ban_nang_cao;');
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS sp_tim_kiem_tac_gia_nang_cao;');
    await queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS sp_tim_kiem_the_loai_nang_cao;');
    
    
  }
};
