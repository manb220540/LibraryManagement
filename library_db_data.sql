use library_db;


-- Thêm thể loại 
INSERT INTO theloai (maTheLoai, tenTheLoai, createdAt, updatedAt) VALUES
(1, 'Tiểu thuyết', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(2, 'Truyện ngắn', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(3, 'Thơ ca', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(4, 'Văn học Kinh điển', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(5, 'Ký, Tùy bút & Phóng sự', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(6, 'Kịch bản Sân khấu', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(7, 'Văn học Thiếu nhi', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(8, 'Khoa học viễn tưởng', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(9, 'Sách tham khảo - Giáo trình', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(10, 'Truyện tranh', '2025-11-09 12:05:05', '2025-11-09 12:05:05');


-- Thêm tác giả
INSERT INTO tacgia (maTacGia, tenTacGia, diaChi, soDienThoai, createdAt, updatedAt) VALUES
(1, 'Vũ Trọng Phụng', 'Hà Nội', '0354496980', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(2, 'Nam Cao', 'Hà Nam', '0354496981', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(3, 'Ngô Tất Tố', 'Hà Nội', '0354496982', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(4, 'Bảo Ninh', 'Nghệ An', '0354496983', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(5, 'Kim Lân', 'Bắc Ninh', '0354496984', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(6, 'Nguyễn Du', 'Hà Tĩnh', '0354496985', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(7, 'Xuân Diệu', 'Hà Tĩnh', '0354496986', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(8, 'Hàn Mặc Tử', 'Quảng Bình', '0354496987', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(9, 'Nguyễn Trãi', 'Hải Dương', '0354496988', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(10, 'Hồ Xuân Hương', 'Nghệ An', '0354496989', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(11, 'Nguyễn Tuân', 'Hà Nội', '0354496990', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(12, 'Thạch Lam', 'Hà Nội', '0354496991', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(13, 'Lưu Quang Vũ', 'Phú Thọ', '0354496991', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(14, 'Tô Hoài', 'Hà Nội', '0354496992', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(15, 'Nguyễn Nhật Ánh', 'Quảng Nam', '0354496993', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(16, 'Phùng Quán', 'Huế', '0354496994', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(17, 'Hồ Chí Minh', 'Nghệ An', '0354496995', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(18, 'Văn Cao', 'Hải Phòng', '0354496996', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(19, 'Tố Hữu', 'Thừa Thiên - Huế', '0354496997', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(20, 'Huy Cận', 'Hà Tĩnh', '0354496998', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(21, 'Xuân Quỳnh', 'Hà Nội', '0354496999', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(22, 'Frank Herbert', 'USA', '0354497000', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
(23, 'Isaac Asimov', 'USA', '0354497001', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
(24, 'George Orwell', 'United Kingdom', '0354497002', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
(25, 'Aldous Huxley', 'United Kingdom', '0354497003', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
(26, 'Andy Weir', 'USA', '0354497004', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
(27, 'Orson Scott Card', 'USA', '0354497005', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
(28, 'H. G. Wells', 'United Kingdom', '0354497006', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
(29, 'Ray Bradbury', 'USA', '0354497007', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
(30, 'William Gibson', 'Canada/USA', '0354497008', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
(31, 'Fujiko F. Fujio', 'Nhật Bản', '0354497009', '2025-11-10 12:20:00', '2025-11-10 12:20:00'),
(32, 'Eiichiro Oda', 'Nhật Bản', '0354497010', '2025-11-10 12:20:00', '2025-11-10 12:20:00'),
(33, 'Akira Toriyama', 'Nhật Bản', '0354497011', '2025-11-10 12:20:00', '2025-11-10 12:20:00'),
(34, 'Masashi Kishimoto', 'Nhật Bản', '0354497012', '2025-11-10 12:20:00', '2025-11-10 12:20:00'),
(35, 'Gosho Aoyama', 'Nhật Bản', '0354497013', '2025-11-10 12:20:00', '2025-11-10 12:20:00'),
(36, 'Hajime Isayama', 'Nhật Bản', '0354497014', '2025-11-10 12:20:00', '2025-11-10 12:20:00'),
(37, 'Takehiko Inoue', 'Nhật Bản', '0354497015', '2025-11-10 12:20:00', '2025-11-10 12:20:00'),
(38, 'Tsugumi Ohba', 'Nhật Bản', '0354497016', '2025-11-10 12:20:00', '2025-11-10 12:20:00'),
(39, 'Takeshi Obata', 'Nhật Bản', '0354497017', '2025-11-10 12:20:00', '2025-11-10 12:20:00'),
(40, 'Hiromu Arakawa', 'Nhật Bản', '0354497018', '2025-11-10 12:20:00', '2025-11-10 12:20:00'),
(41, 'Koyoharu Gotouge', 'Nhật Bản', '0354497019', '2025-11-10 12:20:00', '2025-11-10 12:20:00'),
(42, 'Lê Văn Tâm (Chủ biên)', 'Cần Thơ', '0354497030', '2025-11-10 12:40:00', '2025-11-10 12:40:00'),
(43, 'Nguyễn Thị Thu Hằng', 'Cần Thơ', '0354497031', '2025-11-10 12:40:00', '2025-11-10 12:40:00'),
(44, 'Trần Văn Hùng (Chủ biên)', 'Cần Thơ', '0354497032', '2025-11-10 12:40:00', '2025-11-10 12:40:00'),
(45, 'Võ Thành Danh', 'Cần Thơ', '0354497033', '2025-11-10 12:40:00', '2025-11-10 12:40:00'),
(46, 'Lê Nguyễn Đoan Khôi', 'Cần Thơ', '0354497034', '2025-11-10 12:40:00', '2025-11-10 12:40:00'),
(47, 'Trần Nhân Dũng', 'Cần Thơ', '0354497035', '2025-11-10 12:40:00', '2025-11-10 12:40:00'),
(48, 'Phan Trung Hiền', 'Cần Thơ', '0354497036', '2025-11-10 12:40:00', '2025-11-10 12:40:00'),
(49, 'Võ Anh Huy (Chủ biên)', 'Cần Thơ', '0354497037', '2025-11-10 12:40:00', '2025-11-10 12:40:00'),
(50, 'Trần Thị Thu Trang', 'Cần Thơ', '0354497038', '2025-11-10 12:40:00', '2025-11-10 12:40:00'),
(51, 'Nguyễn Văn Bé', 'Cần Thơ', '0354497039', '2025-11-10 12:40:00', '2025-11-10 12:40:00');

-- Thêm nhà xuất bản
INSERT INTO nhaxuatban (maNXB, tenNXB, diaChi, createdAt, updatedAt) VALUES
(1, 'NXB Văn học', '19 Nguyễn Trãi, Hà Nội', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(2, 'NXB Trẻ', '161B Lý Chính Thắng, Q.3, TP.HCM', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(3, 'NXB Kim Đồng', '55 Quang Trung, Hà Nội', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(4, 'NXB Hội Nhà Văn', '65 Nguyễn Du, Hà Nội', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(5, 'NXB Giáo dục', '81 Trần Hưng Đạo, Hà Nội', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(6, 'NXB Chính trị Quốc gia Sự thật', '24 Quang Trung, Hoàn Kiếm, Hà Nội', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(7, 'NXB Khoa học và Kỹ thuật', '70 Trần Hưng Đạo, Hà Nội', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(8, 'NXB Đại học Quốc gia Hà Nội', '144 Xuân Thủy, Cầu Giấy, Hà Nội', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(9, 'NXB Đại học Quốc gia TP.HCM', 'Phường Linh Trung, TP. Thủ Đức, TP.HCM', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(10, 'NXB Lao Động', '175 Giảng Võ, Ba Đình, Hà Nội', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(11, 'NXB Phụ Nữ Việt Nam', '39 Hàng Chuối, Hai Bà Trưng, Hà Nội', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(12, 'NXB Thanh Niên', '64 Bà Triệu, Hoàn Kiếm, Hà Nội', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(13, 'NXB Thông Tin và Truyền Thông', '10 Tôn Thất Thuyết, Cầu Giấy, Hà Nội', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(14, 'NXB Tổng hợp TP.HCM', '62 Nguyễn Thị Minh Khai, Q.3, TP.HCM', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(15, 'NXB Văn hóa – Nghệ thuật', '99 Ngô Quyền, Hà Nội', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(16, 'NXB Văn hóa – Thông tin', '36 Tràng Thi, Hoàn Kiếm, Hà Nội', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(17, 'NXB Đại học Sư phạm', '136 Xuân Thủy, Cầu Giấy, Hà Nội', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(18, 'NXB Khoa học Xã hội', '26 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(19, 'NXB Thế Giới', '46 Tràng Thi, Hoàn Kiếm, Hà Nội', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(20, 'NXB Hồng Đức', '37 Hàng Chuối, Hai Bà Trưng, Hà Nội', '2025-11-09 12:05:05', '2025-11-09 12:05:05'),
(21, 'Chilton Books', 'Philadelphia, USA', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
(22, 'Gnome Press', 'New York, USA', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
(23, 'Secker & Warburg', 'London, UK', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
(24, 'Chatto & Windus', 'London, UK', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
(25, 'Crown Publishing Group', 'New York, USA', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
(26, 'Tor Books', 'New York, USA', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
(27, 'William Heinemann', 'London, UK', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
(28, 'Ballantine Books', 'New York, USA', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
(29, 'Ace Books', 'New York, USA', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
(30, 'Shueisha', 'Tokyo, Japan', '2025-11-10 12:20:00', '2025-11-10 12:20:00'),
(31, 'Shogakukan', 'Tokyo, Japan', '2025-11-10 12:20:00', '2025-11-10 12:20:00'),
(32, 'Kodansha', 'Tokyo, Japan', '2025-11-10 12:20:00', '2025-11-10 12:20:00'),
(33, 'Square Enix', 'Tokyo, Japan', '2025-11-10 12:20:00', '2025-11-10 12:20:00'),
(34, 'NXB Đại học Cần Thơ', 'Khu II, Đ. 3/2, P. Xuân Khánh, Q. Ninh Kiều, TP. Cần Thơ', '2025-11-10 12:40:00', '2025-11-10 12:40:00');


-- Thêm sách có thể loại là tiểu thuyết
INSERT INTO sach (maSach, tenSach, maTacGia, maTheLoai, maNXB, donGia, soLuongHienCo, namXuatBan, nguonGoc, imagePath, createdAt, updatedAt) VALUES
('101', 'Số đỏ', 1, 1, 1, 85000, 30, 2020, 'Việt Nam', 'uploads/101_so_do.jpg', '2025-11-09 12:10:05', '2025-11-09 12:10:05'),
('102', 'Chí Phèo', 2, 1, 1, 70000, 25, 2021, 'Việt Nam', 'uploads/102_chi_pheo.jpg', '2025-11-09 12:10:05', '2025-11-09 12:10:05'),
('103', 'Tắt đèn', 3, 1, 1, 65000, 20, 2019, 'Việt Nam', 'uploads/103_tat_den.jpg', '2025-11-09 12:10:05', '2025-11-09 12:10:05'),
('104', 'Nỗi buồn chiến tranh', 4, 1, 4, 95000, 18, 2022, 'Việt Nam', 'uploads/104_noi_buon_chien_tranh.jpg', '2025-11-09 12:10:05', '2025-11-09 12:10:05'),
('105', 'Vợ nhặt', 5, 1, 1, 72000, 27, 2021, 'Việt Nam', 'uploads/105_vo_nhat.jpg', '2025-11-09 12:10:05', '2025-11-09 12:10:05'),
('106', 'Truyện Kiều', 6, 1, 1, 90000, 50, 2018, 'Việt Nam', 'uploads/106_truyen_kieu.jpg', '2025-11-09 12:10:05', '2025-11-09 12:10:05'),
('107', 'Vang bóng một thời', 11, 1, 4, 78000, 25, 2020, 'Việt Nam', 'uploads/107_vang_bong_mot_thoi.jpg', '2025-11-09 12:10:05', '2025-11-09 12:10:05'),
('108', 'Hai đứa trẻ', 12, 1, 1, 68000, 35, 2021, 'Việt Nam', 'uploads/108_hai_dua_tre.jpg', '2025-11-09 12:10:05', '2025-11-09 12:10:05'),
('109', 'Dế Mèn phiêu lưu ký', 14, 1, 3, 60000, 40, 2022, 'Việt Nam', 'uploads/109_de_men_phieu_luu_ky.jpg', '2025-11-09 12:10:05', '2025-11-09 12:10:05'),
('110', 'Mắt biếc', 15, 1, 2, 105000, 30, 2023, 'Việt Nam', 'uploads/110_mat_biec.jpg', '2025-11-09 12:10:05', '2025-11-09 12:10:05');



-- Thêm sách thuộc thể loại Truyện ngắn
INSERT INTO sach (maSach, tenSach, maTacGia, maTheLoai, maNXB, donGia, soLuongHienCo, namXuatBan, nguonGoc, imagePath, createdAt, updatedAt) VALUES
('211', 'Lão Hạc', 2, 2, 1, 55000, 50, 2022, 'Việt Nam', 'uploads/211_lao_hac.jpg', '2025-11-09 14:00:00', '2025-11-09 14:00:00'),
('212', 'Làng', 5, 2, 5, 48000, 45, 2021, 'Việt Nam', 'uploads/212_lang.jpg', '2025-11-09 14:00:00', '2025-11-09 14:00:00'),
('213', 'Gió lạnh đầu mùa', 12, 2, 1, 62000, 40, 2023, 'Việt Nam', 'uploads/213_gio_lanh_dau_mua.jpg', '2025-11-09 14:00:00', '2025-11-09 14:00:00'),
('214', 'Vợ chồng A Phủ', 14, 2, 1, 70000, 35, 2022, 'Việt Nam', 'uploads/214_vo_chong_a_phu.jpg', '2025-11-09 14:00:00', '2025-11-09 14:00:00'),
('215', 'Chữ người tử tù', 11, 2, 4, 75000, 30, 2021, 'Việt Nam', 'uploads/215_chu_nguoi_tu_tu.jpg', '2025-11-09 14:00:00', '2025-11-09 14:00:00'),
('216', 'Đời thừa', 2, 2, 4, 80000, 25, 2023, 'Việt Nam', 'uploads/216_doi_thua.jpg', '2025-11-09 14:00:00', '2025-11-09 14:00:00'),
('217', 'Con chó xấu xí', 5, 2, 3, 58000, 38, 2022, 'Việt Nam', 'uploads/217_con_cho_xau_xi.jpg', '2025-11-09 14:00:00', '2025-11-09 14:00:00'),
('218', 'Dưới bóng hoàng lan', 12, 2, 2, 65000, 42, 2023, 'Việt Nam', 'uploads/218_duoi_bong_hoang_lan.jpg', '2025-11-09 14:00:00', '2025-11-09 14:00:00'),
('219', 'Truyện ngắn Nguyễn Tuân', 11, 2, 1, 95000, 28, 2022, 'Việt Nam', 'uploads/219_truyen_ngan_nguyen_tuan.jpg', '2025-11-09 14:00:00', '2025-11-09 14:00:00'),
('220', 'Truyện ngắn Tô Hoài', 14, 2, 3, 88000, 33, 2021, 'Việt Nam', 'uploads/220_truyen_ngan_to_hoai.jpg', '2025-11-09 14:00:00', '2025-11-09 14:00:00');

-- Thêm sách thuộc thể loại Thơ ca 
INSERT INTO sach (maSach, tenSach, maTacGia, maTheLoai, maNXB, donGia, soLuongHienCo, namXuatBan, nguonGoc, imagePath, createdAt, updatedAt) VALUES
('321', 'Việt Bắc', 19, 3, 1, 80000, 40, 2022, 'Việt Nam', 'uploads/321_viet_bac.jpg', '2025-11-09 14:10:00', '2025-11-09 14:10:00'),
('322', 'Gửi hương cho gió', 7, 3, 4, 75000, 35, 2021, 'Việt Nam', 'uploads/322_gui_huong_cho_gio.jpg', '2025-11-09 14:10:00', '2025-11-09 14:10:00'),
('323', 'Đau thương', 8, 3, 4, 90000, 25, 2023, 'Việt Nam', 'uploads/323_dau_thuong.jpg', '2025-11-09 14:10:00', '2025-11-09 14:10:00'),
('324', 'Ánh sáng và phù sa', 4, 3, 1, 85000, 30, 2022, 'Việt Nam', 'uploads/324_anh_sang_va_phu_sa.jpg', '2025-11-09 14:10:00', '2025-11-09 14:10:00'),
('325', 'Lời ru trên mặt đất', 21, 3, 11, 78000, 45, 2023, 'Việt Nam', 'uploads/325_loi_ru_tren_mat_dat.jpg', '2025-11-09 14:10:00', '2025-11-09 14:10:00'),
('326', 'Nhật ký trong tù', 17, 3, 6, 95000, 50, 2021, 'Việt Nam', 'uploads/326_nhat_ky_trong_tu.jpg', '2025-11-09 14:10:00', '2025-11-09 14:10:00'),
('327', 'Vũ trụ ca', 20, 3, 1, 70000, 33, 2022, 'Việt Nam', 'uploads/327_vu_tru_ca.jpg', '2025-11-09 14:10:00', '2025-11-09 14:10:00'),
('328', 'Mây trắng của đời tôi', 13, 3, 4, 88000, 28, 2023, 'Việt Nam', 'uploads/328_may_trang_cua_doi_toi.jpg', '2025-11-09 14:10:00', '2025-11-09 14:10:00'),
('329', 'Ức Trai thi tập', 9, 3, 18, 110000, 20, 2020, 'Việt Nam', 'uploads/329_uc_trai_thi_tap.jpg', '2025-11-09 14:10:00', '2025-11-09 14:10:00'),
('330', 'Lá', 18, 3, 1, 65000, 37, 2022, 'Việt Nam', 'uploads/330_la.jpg', '2025-11-09 14:10:00', '2025-11-09 14:10:00');


-- Thêm sách thuộc thể loại Văn học Kinh điển (Đã cập nhật maSach từ 431-440 và imagePath)
INSERT INTO sach (maSach, tenSach, maTacGia, maTheLoai, maNXB, donGia, soLuongHienCo, namXuatBan, nguonGoc, imagePath, createdAt, updatedAt) VALUES
('431', 'Giông tố', 1, 4, 1, 90000, 30, 2021, 'Việt Nam', 'uploads/431_giong_to.jpg', '2025-11-09 14:20:00', '2025-11-09 14:20:00'),
('432', 'Lều chõng', 3, 4, 1, 85000, 25, 2022, 'Việt Nam', 'uploads/432_leu_chong.jpg', '2025-11-09 14:20:00', '2025-11-09 14:20:00'),
('433', 'Bình Ngô đại cáo', 9, 4, 6, 95000, 20, 2020, 'Việt Nam', 'uploads/433_binh_ngo_dai_cao.jpg', '2025-11-09 14:20:00', '2025-11-09 14:20:00'),
('434', 'Hà Nội băm sáu phố phường', 12, 4, 1, 75000, 35, 2023, 'Việt Nam', 'uploads/434_ha_noi_bam_sau_pho_phuong.jpg', '2025-11-09 14:20:00', '2025-11-09 14:20:00'),
('435', 'Người lái đò Sông Đà', 11, 4, 4, 105000, 28, 2022, 'Việt Nam', 'uploads/435_nguoi_lai_do_song_da.jpg', '2025-11-09 14:20:00', '2025-11-09 14:20:00'),
('436', 'Từ ấy', 19, 4, 1, 88000, 33, 2021, 'Việt Nam', 'uploads/436_tu_ay.jpg', '2025-11-09 14:20:00', '2025-11-09 14:20:00'),
('437', 'Tuyên ngôn Độc lập', 17, 4, 6, 70000, 40, 2022, 'Việt Nam', 'uploads/437_tuyen_ngon_doc_lap.jpg', '2025-11-09 14:20:00', '2025-11-09 14:20:00'),
('438', 'Văn tế thập loại chúng sinh', 6, 4, 1, 82000, 22, 2023, 'Việt Nam', 'uploads/438_van_te_thap_loai_chung_sinh.jpg', '2025-11-09 14:20:00', '2025-11-09 14:20:00'),
('439', 'Giăng sáng', 2, 4, 1, 78000, 27, 2021, 'Việt Nam', 'uploads/439_giang_sang.jpg', '2025-11-09 14:20:00', '2025-11-09 14:20:00'),
('440', 'Tuổi thơ dữ dội', 16, 4, 3, 115000, 50, 2023, 'Việt Nam', 'uploads/440_tuoi_tho_du_doi.jpg', '2025-11-09 14:20:00', '2025-11-09 14:20:00');


-- Thêm sách thuộc thể loại Ký, Tùy bút & Phóng sự
INSERT INTO sach (maSach, tenSach, maTacGia, maTheLoai, maNXB, donGia, soLuongHienCo, namXuatBan, nguonGoc, imagePath, createdAt, updatedAt) VALUES
('541', 'Cạm bẫy người', 1, 5, 1, 75000, 25, 2022, 'Việt Nam', 'uploads/541_cam_bay_nguoi.jpg', '2025-11-09 14:30:00', '2025-11-09 14:30:00'),
('542', 'Kỹ nghệ lấy Tây', 1, 5, 1, 80000, 20, 2021, 'Việt Nam', 'uploads/542_ky_nghe_lay_tay.jpg', '2025-11-09 14:30:00', '2025-11-09 14:30:00'),
('543', 'Cơm thầy cơm cô', 1, 5, 10, 78000, 30, 2023, 'Việt Nam', 'uploads/543_com_thay_com_co.jpg', '2025-11-09 14:30:00', '2025-11-09 14:30:00'),
('544', 'Chiếc lư đồng mắt cua', 11, 5, 4, 95000, 22, 2022, 'Việt Nam', 'uploads/544_chiec_lu_dong_mat_cua.jpg', '2025-11-09 14:30:00', '2025-11-09 14:30:00'),
('545', 'Tùy bút kháng chiến', 11, 5, 4, 100000, 18, 2021, 'Việt Nam', 'uploads/545_tuy_but_khang_chien.jpg', '2025-11-09 14:30:00', '2025-11-09 14:30:00'),
('546', 'Hà Nội ta đánh Mỹ giỏi', 11, 5, 6, 85000, 35, 2023, 'Việt Nam', 'uploads/546_ha_noi_ta_danh_my_gioi.jpg', '2025-11-09 14:30:00', '2025-11-09 14:30:00'),
('547', 'Truyện Tây Bắc', 14, 5, 1, 90000, 40, 2022, 'Việt Nam', 'uploads/547_truyen_tay_bac.jpg', '2025-11-09 14:30:00', '2025-11-09 14:30:00'),
('548', 'Cát bụi chân ai', 14, 5, 4, 110000, 28, 2021, 'Việt Nam', 'uploads/548_cat_bui_chan_ai.jpg', '2025-11-09 14:30:00', '2025-11-09 14:30:00'),
('549', 'Bản án chế độ thực dân Pháp', 17, 5, 6, 92000, 50, 2023, 'Việt Nam', 'uploads/549_ban_an_che_do_thuc_dan_phap.jpg', '2025-11-09 14:30:00', '2025-11-09 14:30:00'),
('550', 'Đường Kách mệnh', 17, 5, 6, 88000, 45, 2022, 'Việt Nam', 'uploads/550_duong_kach_menh.jpg', '2025-11-09 14:30:00', '2025-11-09 14:30:00');


-- Thêm sách thuộc thể loại Kịch bản Sân khấu
INSERT INTO sach (maSach, tenSach, maTacGia, maTheLoai, maNXB, donGia, soLuongHienCo, namXuatBan, nguonGoc, imagePath, createdAt, updatedAt) VALUES
('651', 'Hồn Trương Ba, da hàng thịt', 13, 6, 4, 90000, 30, 2022, 'Việt Nam', 'uploads/651_hon_truong_ba_da_hang_thit.jpg', '2025-11-09 14:40:00', '2025-11-09 14:40:00'),
('652', 'Lời thề thứ 9', 13, 6, 1, 85000, 25, 2021, 'Việt Nam', 'uploads/652_loi_the_thu_9.jpg', '2025-11-09 14:40:00', '2025-11-09 14:40:00'),
('653', 'Nàng Sita', 13, 6, 4, 95000, 20, 2023, 'Việt Nam', 'uploads/653_nang_sita.jpg', '2025-11-09 14:40:00', '2025-11-09 14:40:00'),
('654', 'Bệnh sĩ', 13, 6, 2, 88000, 35, 2022, 'Việt Nam', 'uploads/654_benh_si.jpg', '2025-11-09 14:40:00', '2025-11-09 14:40:00'),
('655', 'Tôi và chúng ta', 13, 6, 1, 100000, 28, 2021, 'Việt Nam', 'uploads/655_toi_va_chung_ta.jpg', '2025-11-09 14:40:00', '2025-11-09 14:40:00'),
('656', 'Ông không phải là bố tôi', 13, 6, 4, 82000, 30, 2023, 'Việt Nam', 'uploads/656_ong_khong_phai_la_bo_toi.jpg', '2025-11-09 14:40:00', '2025-11-09 14:40:00'),
('657', 'Tin ở hoa hồng', 13, 6, 2, 79000, 33, 2022, 'Việt Nam', 'uploads/657_tin_o_hoa_hong.jpg', '2025-11-09 14:40:00', '2025-11-09 14:40:00'),
('658', 'Lời nói dối cuối cùng', 13, 6, 1, 92000, 27, 2021, 'Việt Nam', 'uploads/658_loi_noi_doi_cuoi_cung.jpg', '2025-11-09 14:40:00', '2025-11-09 14:40:00'),
('659', 'Hoa cúc xanh trên đầm lầy', 13, 6, 4, 87000, 24, 2023, 'Việt Nam', 'uploads/659_hoa_cuc_xanh_tren_dam_lay.jpg', '2025-11-09 14:40:00', '2025-11-09 14:40:00'),
('660', 'Hồn bướm mơ tiên', 13, 6, 3, 75000, 40, 2022, 'Việt Nam', 'uploads/660_hon_buom_mo_tien.jpg', '2025-11-09 14:40:00', '2025-11-09 14:40:00');


-- Thêm sách thuộc thể loại Văn học Thiếu nhi 
INSERT INTO sach (maSach, tenSach, maTacGia, maTheLoai, maNXB, donGia, soLuongHienCo, namXuatBan, nguonGoc, imagePath, createdAt, updatedAt) VALUES
('761', 'Cho tôi xin một vé đi tuổi thơ', 15, 7, 2, 98000, 60, 2022, 'Việt Nam', 'uploads/761_cho_toi_xin_mot_ve_di_tuoi_tho.jpg', '2025-11-09 14:50:00', '2025-11-09 14:50:00'),
('762', 'Tôi thấy hoa vàng trên cỏ xanh', 15, 7, 2, 110000, 50, 2023, 'Việt Nam', 'uploads/762_toi_thay_hoa_vang_tren_co_xanh.jpg', '2025-11-09 14:50:00', '2025-11-09 14:50:00'),
('763', 'Kính vạn hoa', 15, 7, 3, 80000, 70, 2021, 'Việt Nam', 'uploads/763_kinh_van_hoa.jpg', '2025-11-09 14:50:00', '2025-11-09 14:50:00'),
('764', 'Chú bé rắc rối', 15, 7, 3, 85000, 45, 2022, 'Việt Nam', 'uploads/764_chu_be_rac_roi.jpg', '2025-11-09 14:50:00', '2025-11-09 14:50:00'),
('765', 'Lá cờ thêu sáu chữ vàng', 14, 7, 3, 70000, 40, 2023, 'Việt Nam', 'uploads/765_la_co_theu_sau_chu_vang.jpg', '2025-11-09 14:50:00', '2025-11-09 14:50:00'),
('766', 'Góc sân và khoảng trời', 21, 7, 11, 75000, 35, 2022, 'Việt Nam', 'uploads/766_goc_san_va_khoang_troi.jpg', '2025-11-09 14:50:00', '2025-11-09 14:50:00'),
('767', 'Bầu trời trong quả trứng', 21, 7, 3, 65000, 30, 2021, 'Việt Nam', 'uploads/767_bau_troi_trong_qua_trung.jpg', '2025-11-09 14:50:00', '2025-11-09 14:50:00'),
('768', 'Tuổi thơ im lặng', 16, 7, 3, 90000, 25, 2023, 'Việt Nam', 'uploads/768_tuoi_tho_im_lang.jpg', '2025-11-09 14:50:00', '2025-11-09 14:50:00'),
('769', 'Chuyện hoa chuyện quả', 14, 7, 3, 68000, 38, 2022, 'Việt Nam', 'uploads/769_chuyen_hoa_chuyen_hoa.jpg', '2025-11-09 14:50:00', '2025-11-09 14:50:00'),
('770', 'Ngồi khóc trên cây', 15, 7, 2, 105000, 55, 2021, 'Việt Nam', 'uploads/770_ngoi_khoc_tren_cay.jpg', '2025-11-09 14:50:00', '2025-11-09 14:50:00');

-- Thêm sách thuộc thể loại Khoa học viễn tưởng 
INSERT INTO sach (maSach, tenSach, maTacGia, maTheLoai, maNXB, donGia, soLuongHienCo, namXuatBan, nguonGoc, imagePath, createdAt, updatedAt) VALUES
('871', 'Dune', 22, 8, 21, 150000, 20, 1965, 'Mỹ', 'uploads/871_dune.jpg', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
('872', 'Foundation', 23, 8, 22, 140000, 25, 1951, 'Mỹ', 'uploads/872_foundation.jpg', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
('873', '1984', 24, 8, 23, 120000, 30, 1949, 'Anh', 'uploads/873_1984.jpg', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
('874', 'Brave New World', 25, 8, 24, 110000, 18, 1932, 'Anh', 'uploads/874_brave_new_world.jpg', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
('875', 'The Martian', 26, 8, 25, 160000, 22, 2014, 'Mỹ', 'uploads/875_the_martian.jpg', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
('876', 'Ender''s Game', 27, 8, 26, 130000, 30, 1985, 'Mỹ', 'uploads/876_enders_game.jpg', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
('877', 'The Time Machine', 28, 8, 27, 100000, 28, 1995, 'Anh', 'uploads/877_time_machine.jpg', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
('878', 'Fahrenheit 451', 29, 8, 28, 115000, 24, 1953, 'Mỹ', 'uploads/878_fahrenheit451.jpg', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
('879', 'Neuromancer', 30, 8, 29, 150000, 15, 1984, 'Mỹ', 'uploads/879_neuromancer.jpg', '2025-11-09 15:10:00', '2025-11-09 15:10:00'),
('880', 'I, Robot', 23, 8, 22, 125000, 20, 1950, 'Mỹ', 'uploads/880_i_robot.jpg', '2025-11-09 15:10:00', '2025-11-09 15:10:00');

-- Thêm giáo trình của Đại học Cần Thơ 
INSERT INTO sach (maSach, tenSach, maTacGia, maTheLoai, maNXB, donGia, soLuongHienCo, namXuatBan, nguonGoc, imagePath, createdAt, updatedAt) VALUES
('981', 'Giáo trình Vi sinh vật học', 42, 9, 34, 150000, 50, 2022, 'Việt Nam', 'uploads/981_vi_sinh_vat.jpg', '2025-11-10 12:45:00', '2025-11-10 12:45:00'),
('982', 'Giáo trình Bệnh học Thủy sản', 43, 9, 34, 180000, 40, 2021, 'Việt Nam', 'uploads/982_benh_thuy_san.jpg', '2025-11-10 12:45:00', '2025-11-10 12:45:00'),
('983', 'Giáo trình Hóa học Đại cương (CTU)', 44, 9, 34, 130000, 60, 2023, 'Việt Nam', 'uploads/983_hoa_dai_cuong_ctu.jpg', '2025-11-10 12:45:00', '2025-11-10 12:45:00'),
('984', 'Giáo trình Kinh tế Lượng', 45, 9, 34, 160000, 45, 2022, 'Việt Nam', 'uploads/984_kinh_te_luong.jpg', '2025-11-10 12:45:00', '2025-11-10 12:45:00'),
('985', 'Giáo trình Quản trị Marketing', 46, 9, 34, 170000, 50, 2023, 'Việt Nam', 'uploads/985_qt_marketing.jpg', '2025-11-10 12:45:00', '2025-11-10 12:45:00'),
('986', 'Giáo trình Di truyền học', 47, 9, 34, 190000, 35, 2021, 'Việt Nam', 'uploads/986_di_truyen_hoc.jpg', '2025-11-10 12:45:00', '2025-11-10 12:45:00'),
('987', 'Giáo trình Luật Hiến pháp', 48, 9, 34, 140000, 40, 2022, 'Việt Nam', 'uploads/987_luat_hien_phap.jpg', '2025-11-10 12:45:00', '2025-11-10 12:45:00'),
('988', 'Giáo trình Kỹ thuật Điện', 49, 9, 34, 200000, 30, 2023, 'Việt Nam', 'uploads/988_ky_thuat_dien.jpg', '2025-11-10 12:45:00', '2025-11-10 12:45:00'),
('989', 'Giáo trình Cơ sở Văn hóa Việt Nam', 50, 9, 34, 120000, 55, 2022, 'Việt Nam', 'uploads/989_csvh_vietnam.jpg', '2025-11-10 12:45:00', '2025-11-10 12:45:00'),
('990', 'Tiếng Anh chuyên ngành Công nghẹe thông tin', 51, 9, 34, 110000, 50, 2021, 'Việt Nam', 'uploads/990_ta_cntt.jpg', '2025-11-10 12:45:00', '2025-11-10 12:45:00');


-- Thêm sách thuộc thể loại Truyện tranh 
INSERT INTO sach (maSach, tenSach, maTacGia, maTheLoai, maNXB, donGia, soLuongHienCo, namXuatBan, nguonGoc, imagePath, createdAt, updatedAt) VALUES
('1091', 'One Piece', 32, 10, 30, 25000, 150, 1997, 'Nhật Bản', 'uploads/1091_one_piece.jpg', '2025-11-10 12:25:00', '2025-11-10 12:25:00'),
('1092', 'Naruto', 34, 10, 30, 22000, 120, 1999, 'Nhật Bản', 'uploads/1092_naruto.jpg', '2025-11-10 12:25:00', '2025-11-10 12:25:00'),
('1093', 'Dragon Ball', 33, 10, 30, 20000, 130, 1984, 'Nhật Bản', 'uploads/1093_dragon_ball.jpg', '2025-11-10 12:25:00', '2025-11-10 12:25:00'),
('1094', 'Detective Conan', 35, 10, 31, 23000, 140, 1994, 'Nhật Bản', 'uploads/1094_conan.jpg', '2025-11-10 12:25:00', '2025-11-10 12:25:00'),
('1095', 'Doraemon', 31, 10, 31, 20000, 200, 1969, 'Nhật Bản', 'uploads/1095_doraemon.jpg', '2025-11-10 12:25:00', '2025-11-10 12:25:00'),
('1096', 'Attack on Titan', 36, 10, 32, 28000, 100, 2009, 'Nhật Bản', 'uploads/1096_attack_on_titan.jpg', '2025-11-10 12:25:00', '2025-11-10 12:25:00'),
('1097', 'Slam Dunk', 37, 10, 30, 25000, 90, 1990, 'Nhật Bản', 'uploads/1097_slam_dunk.jpg', '2025-11-10 12:25:00', '2025-11-10 12:25:00'),
('1098', 'Death Note', 38, 10, 30, 27000, 80, 2003, 'Nhật Bản', 'uploads/1098_death_note.jpg', '2025-11-10 12:25:00', '2025-11-10 12:25:00'),
('1099', 'Fullmetal Alchemist', 40, 10, 33, 30000, 70, 2001, 'Nhật Bản', 'uploads/1099_fullmetal_alchemist.jpg', '2025-11-10 12:25:00', '2025-11-10 12:25:00'),
('1100', 'Demon Slayer', 41, 10, 30, 28000, 110, 2016, 'Nhật Bản', 'uploads/1100_demon_slayer.jpg', '2025-11-10 12:25:00', '2025-11-10 12:25:00');


-- Thêm nhân viên
INSERT INTO nhanvien (MSNV, hoTenNV, chucVu, diaChi, soDienThoai, password, createdAt, updatedAt) VALUES
(221, 'Trần Tiểu Mẫn', 'Quản trị viên', 'Cần Thơ', '0912345678', 'TieuMan221', '2025-11-10 13:00:00', '2025-11-10 13:00:00'),
(222, 'Trần Bạch Tuyết Minh', 'Thủ thư', 'Cần Thơ', '0987654321', 'TuyetMinh222', '2025-11-10 13:01:00', '2025-11-10 13:01:00'),
(233, 'Nguyễn Thanh Bình', 'Quản lý kho', 'Cần Thơ', '0905123456', 'ThanhBinh233', '2025-11-10 13:02:00', '2025-11-10 13:02:00'),
(234, 'Hồ Gia Huy', 'Nhân viên', 'Cần Thơ', '0935987654', 'GiaHuy234', '2025-11-10 13:03:00', '2025-11-10 13:03:00');


-- Thêm độc giả
USE library_db;

-- Thêm 10 độc giả với otpExpiry cố định
INSERT INTO docgia (maDocGia, hoLot, ten, ngaySinh, phai, diaChi, dienThoai, email, password, otp, otpExpiry, createdAt, updatedAt) VALUES
(111, 'Nguyễn Văn', 'An', '1998-05-15', 'Nam', '123 Nguyễn Văn Cừ, Cần Thơ', '0905111222', 'an222@gmail.com', 'An1998', '123456', '2025-11-09 18:07:30', '2025-11-10 14:00:00', '2025-11-10 14:00:00'),
(112, 'Trần Thị', 'Bích', '2000-02-20', 'Nữ', '456 Lê Lợi, Cần Thơ', '0915333444', 'bich444@gmail.com', 'Bich2000', '234567', '2025-11-09 18:07:30', '2025-11-10 14:00:00', '2025-11-10 14:00:00'),
(113, 'Lê Minh', 'Cường', '1995-11-30', 'Nam', '789 CMT8, TP. HCM', '0988555666', 'cuong666@gmail.com', 'Cuong1995', '345678', '2025-11-09 18:07:30', '2025-11-10 14:00:00', '2025-11-10 14:00:00'),
(114, 'Phạm Thị', 'Dung', '2002-01-10', 'Nữ', '11 Hùng Vương, Hà Nội', '0977777888', 'dung888@gmail.com', 'Dung2002', '456789', '2025-11-09 18:07:30', '2025-11-10 14:00:00', '2025-11-10 14:00:00'),
(115, 'Võ Thành', 'Em', '2003-07-25', 'Nam', '22 Trần Hưng Đạo, Cần Thơ', '0905999000', 'em000@gmail.com', 'Em2003', '567890', '2025-11-09 18:07:30', '2025-11-10 14:00:00', '2025-11-10 14:00:00'),
(116, 'Đặng Gia', 'Hân', '1999-09-09', 'Nữ', '33 Nguyễn Trãi, Cần Thơ', '0918123456', 'han456@gmail.com', 'Han1999', '678901', '2025-11-09 18:07:30', '2025-11-10 14:00:00', '2025-11-10 14:00:00'),
(117, 'Huỳnh Quốc', 'Khang', '1997-12-01', 'Nam', '55 Mậu Thân, Cần Thơ', '0945678901', 'khang901@gmail.com', 'Khang1997', '789012', '2025-11-09 18:07:30', '2025-11-10 14:00:00', '2025-11-10 14:00:00'),
(118, 'Mai Thùy', 'Linh', '2001-04-18', 'Nữ', '66 Võ Văn Kiệt, Sóc Trăng', '0939111222', 'linh222@gmail.com', 'Linh2001', '890123', '2025-11-09 18:07:30', '2025-11-10 14:00:00', '2025-11-10 14:00:00'),
(119, 'Bùi Tấn', 'Phát', '1994-08-05', 'Nam', '77 Nguyễn Thị Minh Khai, Vĩnh Long', '0907333444', 'phat444@gmail.com', 'Phat1994', '901234', '2025-11-09 18:07:30', '2025-11-10 14:00:00', '2025-11-10 14:00:00'),
(120, 'Phan Ngọc', 'Quyên', '2004-03-12', 'Nữ', '88 Hòa Bình, Bạc Liêu', '0909555666', 'quyen666@gmail.com', 'Quyen2004', '112233', '2025-11-09 18:07:30', '2025-11-10 14:00:00', '2025-11-10 14:00:00');