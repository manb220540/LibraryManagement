// // backend/controllers/authorController.js
// const logger = require('../src/logger');
// const { sequelize, TacGia, Sach } = require('../models'); // Import from models/index.js

// const getAllAuthors = async (req, res) => {
//   try {
//     logger.info('Fetching all authors');
//     const authors = await TacGia.findAll();
//     logger.info('Authors fetched', { count: authors.length });
//     res.json(authors);
//   } catch (error) {
//     logger.error('Error in getAllAuthors', { error: error.message, stack: error.stack });
//     res.status(500).json({ message: error.message });
//   }
// };

// const createAuthor = async (req, res) => {
//   try {
//     logger.info('Creating author', { data: req.body });
//     const { maTacGia, ...authorData } = req.body;
//     const author = await TacGia.create(authorData);
//     logger.info('Author created', { author: author.toJSON() });
//     res.status(201).json(author);
//   } catch (error) {
//     logger.error('Create author error', { error: error.message, stack: error.stack });
//     res.status(400).json({ message: error.message });
//   }
// };

// const updateAuthor = async (req, res) => {
//   try {
//     const { id } = req.params; // Use 'id' as defined in the route
//     if (!id) {
//       logger.warn('Missing author ID in request');
//       return res.status(400).json({ message: 'Mã tác giả là bắt buộc' });
//     }
//     logger.info('Updating author', { id, data: req.body });
//     const [updated] = await TacGia.update(req.body, {
//       where: { maTacGia: id }, // Map 'id' to 'maTacGia' in the where clause
//       returning: true,
//     });
//     if (updated === 0) {
//       logger.warn('Author not found', { id });
//       return res.status(404).json({ message: 'Không tìm thấy tác giả' });
//     }
//     const author = await TacGia.findByPk(id);
//     logger.info('Author updated', { author: author.toJSON() });
//     res.json(author);
//   } catch (error) {
//     logger.error('Update author error', { error: error.message, stack: error.stack });
//     res.status(400).json({ message: error.message });
//   }
// };

// const deleteAuthor = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       logger.warn('Missing author ID in request');
//       return res.status(400).json({ message: 'Mã tác giả là bắt buộc' });
//     }
//     logger.info('Checking author books', { id });
//     const [results] = await sequelize.query(
//       'SELECT fn_check_author_books(:maTacGia) as bookCount',
//       {
//         replacements: { maTacGia: parseInt(id) },
//         type: sequelize.QueryTypes.SELECT,
//       }
//     );
//     const bookCount = results[0]?.bookCount || 0;
//     if (bookCount > 0) {
//       logger.warn('Cannot delete author due to associated books', { id, bookCount });
//       return res.status(400).json({ message: 'Không thể xóa tác giả vì có sách liên kết' });
//     }
//     logger.info('Deleting author', { id });
//     const deleted = await TacGia.destroy({ where: { maTacGia: id } });
//     if (deleted === 0) {
//       logger.warn('Author not found for deletion', { id });
//       return res.status(404).json({ message: 'Không tìm thấy tác giả' });
//     }
//     logger.info('Author deleted successfully', { id });
//     res.json({ message: 'Xóa tác giả thành công' });
//   } catch (error) {
//     if (error.message.includes('foreign key constraint fails')) {
//       logger.warn('Cannot delete author due to foreign key constraint', { error: error.message });
//       return res.status(409).json({ message: 'Không thể xóa tác giả vì có sách liên kết' });
//     }
//     logger.error('Delete author error', { error: error.message, stack: error.stack });
//     res.status(500).json({ message: 'Lỗi server khi xóa tác giả' });
//   }
// };

// const getAuthorById = async (req, res) => {
//   try {
//     const { id } = req.params; // Use 'id' instead of 'maTacGia'
//     if (!id) {
//       logger.warn('Missing author ID in request');
//       return res.status(400).json({ message: 'Mã tác giả là bắt buộc' });
//     }
//     logger.info('Fetching author by ID', { id });
//     const author = await TacGia.findByPk(id);
//     if (!author) {
//       logger.warn('Author not found', { id });
//       return res.status(404).json({ message: 'Không tìm thấy tác giả' });
//     }
//     logger.info('Author fetched', { author: author.toJSON() });
//     res.json(author);
//   } catch (error) {
//     logger.error('Get author by ID error', { error: error.message, stack: error.stack });
//     res.status(500).json({ message: error.message });
//   }
// };

// const searchAuthorsAdvanced = async (req, res) => {
//   try {
//     const {
//       tenTacGia,
//       maTacGia,
//       quocTich,
//       namMin,
//       namMax,
//       sortBy = 'tenTacGia',
//       order = 'ASC',
//       limit = 12,
//       page = 1
//     } = req.query;

//     const offset = (page - 1) * limit;
//     logger.info('Searching authors advanced', req.query);

//     // --- 1. Gọi procedure ---
//     await sequelize.query(
//       `CALL sp_tim_kiem_tac_gia_nang_cao(
//         :tenTacGia, :maTacGia, :quocTich, :namMin, :namMax,
//         :sortBy, :order, :limit, :offset, @total
//       )`,
//       {
//         replacements: {
//           tenTacGia: tenTacGia || null,
//           maTacGia: maTacGia ? parseInt(maTacGia) : null,
//           quocTich: quocTich || null,
//           namMin: namMin ? parseInt(namMin) : null,
//           namMax: namMax ? parseInt(namMax) : null,
//           sortBy,
//           order: order.toUpperCase(),
//           limit: parseInt(limit),
//           offset: parseInt(offset)
//         },
//         type: sequelize.QueryTypes.RAW
//       }
//     );

//     // --- 2. Lấy tổng số bản ghi ---
//     const [[{ total }]] = await sequelize.query('SELECT @total AS total');

//     // --- 3. Lấy dữ liệu chi tiết ---
//     const where = [];
//     if (tenTacGia) where.push(`tg.tenTacGia LIKE '%${tenTacGia}%'`);
//     if (maTacGia) where.push(`tg.maTacGia = ${maTacGia}`);
//     if (quocTich) where.push(`tg.quocTich LIKE '%${quocTich}%'`);
//     if (namMin) where.push(`(s.namXuatBan >= ${namMin} OR s.namXuatBan IS NULL)`);
//     if (namMax) where.push(`(s.namXuatBan <= ${namMax} OR s.namXuatBan IS NULL)`);

//     const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

//     const sql = `
//       SELECT
//         tg.*,
//         COALESCE((
//           SELECT JSON_ARRAYAGG(
//             JSON_OBJECT(
//               'maSach', s.maSach,
//               'tenSach', s.tenSach,
//               'namXuatBan', s.namXuatBan,
//               'soLuongHienCo', s.soLuongHienCo,
//               'donGia', s.donGia
//             )
//           )
//           FROM Sach s
//           WHERE s.maTacGia = tg.maTacGia
//         ), JSON_ARRAY()) AS Sach,
//         (
//           SELECT COUNT(*)
//           FROM Sach s
//           WHERE s.maTacGia = tg.maTacGia
//         ) AS soLuongSach
//       FROM TacGia tg
//       LEFT JOIN Sach s ON tg.maTacGia = s.maTacGia
//       ${whereClause}
//       GROUP BY tg.maTacGia
//       ORDER BY tg.${sortBy} ${order}
//       LIMIT ${limit} OFFSET ${offset};
//     `;

//     const [data] = await sequelize.query(sql);
//     const authors = data.map(a => ({
//       ...a,
//       Sach: a.Sach ? JSON.parse(a.Sach) : [],
//       soLuongSach: parseInt(a.soLuongSach) || 0
//     }));

//     res.json({
//       data: authors,
//       pagination: {
//         total: total || 0,
//         page: parseInt(page),
//         limit: parseInt(limit),
//         totalPages: Math.ceil((total || 0) / limit)
//       }
//     });

//   } catch (error) {
//     logger.error('Search authors advanced error', { error: error.message });
//     res.status(500).json({ message: 'Lỗi tìm kiếm tác giả' });
//   }
// };

// module.exports = {
//   getAllAuthors,
//   createAuthor,
//   updateAuthor,
//   deleteAuthor,
//   getAuthorById,
//   searchAuthorsAdvanced,
// };
// backend/controllers/authorController.js
const logger = require('../src/logger');
const { sequelize, TacGia, Sach } = require('../models');

const getAllAuthors = async (req, res) => {
  try {
    logger.info('Fetching all authors');
    const [results] = await sequelize.query(`
      SELECT 
        tg.*,
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
          WHERE s.maTacGia = tg.maTacGia
        ), JSON_ARRAY()) AS Sach,
        (
          SELECT COUNT(*)
          FROM Sach s
          WHERE s.maTacGia = tg.maTacGia
        ) AS soLuongSach
      FROM TacGia tg
      ORDER BY tg.tenTacGia;
    `);

    const authors = results.map(a => ({
      ...a,
      Sach: typeof a.Sach === 'string' ? JSON.parse(a.Sach) : a.Sach,
      soLuongSach: parseInt(a.soLuongSach) || 0,
    }));

    logger.info('Authors fetched', { count: authors.length });
    res.json(authors);
  } catch (error) {
    logger.error('Error in getAllAuthors', { error: error.message, stack: error.stack });
    res.status(500).json({ message: 'Lỗi khi tải danh sách tác giả' });
  }
};

const createAuthor = async (req, res) => {
  try {
    logger.info('Creating author', { data: req.body });
    const { maTacGia, ...authorData } = req.body;
    const author = await TacGia.create(authorData);
    logger.info('Author created', { author: author.toJSON() });
    res.status(201).json(author);
  } catch (error) {
    logger.error('Create author error', { error: error.message, stack: error.stack });
    res.status(400).json({ message: 'Không thể tạo tác giả mới' });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      logger.warn('Missing author ID');
      return res.status(400).json({ message: 'Mã tác giả là bắt buộc' });
    }

    logger.info('Updating author', { id, data: req.body });
    const [updated] = await TacGia.update(req.body, { where: { maTacGia: id } });

    if (updated === 0) {
      logger.warn('Author not found', { id });
      return res.status(404).json({ message: 'Không tìm thấy tác giả' });
    }

    const author = await TacGia.findByPk(id);
    logger.info('Author updated', { author: author.toJSON() });
    res.json(author);
  } catch (error) {
    logger.error('Update author error', { error: error.message, stack: error.stack });
    res.status(400).json({ message: 'Lỗi khi cập nhật tác giả' });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      logger.warn('Missing author ID');
      return res.status(400).json({ message: 'Mã tác giả là bắt buộc' });
    }

    logger.info('Checking author books', { id });
    const results = await sequelize.query(
      'SELECT fn_check_author_books(:maTacGia) AS bookCount',
      {
        replacements: { maTacGia: parseInt(id) },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const bookCount = results[0]?.bookCount || 0;
    if (bookCount > 0) {
      logger.warn('Cannot delete author due to associated books', { id, bookCount });
      return res.status(400).json({ message: 'Không thể xóa tác giả vì có sách liên kết' });
    }

    logger.info('Deleting author', { id });
    const deleted = await TacGia.destroy({ where: { maTacGia: id } });
    if (deleted === 0) {
      logger.warn('Author not found for deletion', { id });
      return res.status(404).json({ message: 'Không tìm thấy tác giả' });
    }

    logger.info('Author deleted successfully', { id });
    res.json({ message: 'Xóa tác giả thành công' });
  } catch (error) {
    if (error.message.includes('foreign key constraint fails')) {
      logger.warn('Foreign key constraint error', { error: error.message });
      return res.status(409).json({ message: 'Không thể xóa tác giả vì có sách liên kết' });
    }
    logger.error('Delete author error', { error: error.message, stack: error.stack });
    res.status(500).json({ message: 'Lỗi server khi xóa tác giả' });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Mã tác giả là bắt buộc' });

    logger.info('Fetching author by ID', { id });
    const author = await TacGia.findByPk(id);
    if (!author) return res.status(404).json({ message: 'Không tìm thấy tác giả' });

    logger.info('Author fetched', { author: author.toJSON() });
    res.json(author);
  } catch (error) {
    logger.error('Get author by ID error', { error: error.message });
    res.status(500).json({ message: 'Lỗi khi lấy thông tin tác giả' });
  }
};

const searchAuthorsAdvanced = async (req, res) => {
  try {
    const {
      tenTacGia,
      maTacGia,
      quocTich,
      namMin,
      namMax,
      sortBy = 'tenTacGia',
      order = 'ASC',
      limit = 12,
      page = 1,
    } = req.query;

    const offset = (page - 1) * limit;
    logger.info('Searching authors advanced', req.query);

    await sequelize.query(
      `CALL sp_tim_kiem_tac_gia_nang_cao(
        :tenTacGia, :maTacGia, :quocTich, :namMin, :namMax,
        :sortBy, :order, :limit, :offset, @total
      )`,
      {
        replacements: {
          tenTacGia: tenTacGia || null,
          maTacGia: maTacGia ? parseInt(maTacGia) : null,
          quocTich: quocTich || null,
          namMin: namMin ? parseInt(namMin) : null,
          namMax: namMax ? parseInt(namMax) : null,
          sortBy,
          order: order.toUpperCase(),
          limit: parseInt(limit),
          offset: parseInt(offset),
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    const [[{ total }]] = await sequelize.query('SELECT @total AS total');

    // Tạo điều kiện WHERE an toàn
    const where = [];
    if (tenTacGia) where.push(`tg.tenTacGia LIKE '%${tenTacGia.replace(/'/g, "''")}%'`);
    if (maTacGia) where.push(`tg.maTacGia = ${parseInt(maTacGia)}`);
    if (quocTich) where.push(`tg.quocTich LIKE '%${quocTich.replace(/'/g, "''")}%'`);
    if (namMin) where.push(`(s.namXuatBan >= ${parseInt(namMin)} OR s.namXuatBan IS NULL)`);
    if (namMax) where.push(`(s.namXuatBan <= ${parseInt(namMax)} OR s.namXuatBan IS NULL)`);

    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

    const sql = `
      SELECT
        tg.*,
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
          WHERE s.maTacGia = tg.maTacGia
        ), JSON_ARRAY()) AS Sach,
        (
          SELECT COUNT(*)
          FROM Sach s
          WHERE s.maTacGia = tg.maTacGia
        ) AS soLuongSach
      FROM TacGia tg
      LEFT JOIN Sach s ON tg.maTacGia = s.maTacGia
      ${whereClause}
      GROUP BY tg.maTacGia
      ORDER BY tg.${sortBy} ${order}
      LIMIT ${limit} OFFSET ${offset};
    `;

    const [data] = await sequelize.query(sql);
    const authors = data.map(a => ({
      ...a,
      Sach: typeof a.Sach === 'string' ? JSON.parse(a.Sach) : (a.Sach || []),
      soLuongSach: parseInt(a.soLuongSach) || 0,
    }));

    res.json({
      data: authors,
      pagination: {
        total: total || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil((total || 0) / limit),
      },
    });
  } catch (error) {
    logger.error('Search authors advanced error', { error: error.message });
    res.status(500).json({ message: 'Lỗi tìm kiếm tác giả' });
  }
};

module.exports = {
  getAllAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthorById,
  searchAuthorsAdvanced,
};
