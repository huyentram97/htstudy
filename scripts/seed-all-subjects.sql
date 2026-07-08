-- =====================================================
-- SEED H-T.Study: 5 MÔN = 5 KHÓA HỌC
-- Mỗi khóa học chứa nhiều chương, mỗi chương chứa bài học
-- =====================================================

-- Clear
TRUNCATE TABLE lessons CASCADE;
TRUNCATE TABLE chapters CASCADE;
TRUNCATE TABLE courses CASCADE;
TRUNCATE TABLE subjects CASCADE;

-- =====================================================
-- SUBJECTS (5 môn = 5 khóa học)
-- =====================================================
INSERT INTO subjects (id, tenant_id, name, description, sort_order) VALUES
('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', 'Phân tích đầu tư chứng khoán', 'Phân tích cơ bản, kỹ thuật, định giá cổ phiếu và trái phiếu.', 1),
('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', 'Những vấn đề cơ bản của thị trường chứng khoán', 'Tổng quan TTCK, công cụ tài chính, tổ chức kinh doanh, giám sát, đạo đức.', 2),
('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000001', 'CK Phái sinh và TTCK Phái sinh', 'Hợp đồng tương lai, quyền chọn, bù trừ thanh toán CKPS.', 3),
('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000001', 'Môi giới CK và tư vấn đầu tư CK', 'Nghiệp vụ môi giới, tư vấn đầu tư, quản lý danh mục.', 4),
('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000001', 'Pháp luật về chứng khoán và TTCK', 'Luật CK, nghị định, thông tư, quy định phát hành, niêm yết, giao dịch.', 5);

-- =====================================================
-- KHÓA HỌC 1: Phân tích đầu tư chứng khoán
-- =====================================================
INSERT INTO courses (id, tenant_id, subject_id, title, description, status, access_type, created_by) VALUES
('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000201',
 'Phân tích đầu tư chứng khoán',
 'Kiến thức toàn diện về phân tích và đầu tư chứng khoán: lý thuyết, công thức, bài tập mẫu.',
 'published', 'free', '00000000-0000-0000-0000-000000000100');

INSERT INTO chapters (id, course_id, title, description, sort_order) VALUES
('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000301', 'Lý thuyết phân tích đầu tư', 'Kiến thức nền tảng về phân tích cơ bản và kỹ thuật', 1),
('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000301', 'Công thức & Tính toán', 'Bảng công thức, tóm tắt công thức hay thi', 2),
('00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000301', 'Bài tập mẫu & Lời giải', 'Định giá cổ phiếu, trái phiếu với hướng dẫn giải chi tiết', 3),
('00000000-0000-0000-0000-000000000404', '00000000-0000-0000-0000-000000000301', 'Tài liệu ôn tập tổng hợp', 'Tổng hợp nội dung ôn thi', 4);

-- =====================================================
-- KHÓA HỌC 2: Những vấn đề cơ bản của TTCK
-- =====================================================
INSERT INTO courses (id, tenant_id, subject_id, title, description, status, access_type, created_by) VALUES
('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000202',
 'Những vấn đề cơ bản của thị trường chứng khoán',
 'Bài giảng từ slide CĐ1-CĐ11, ghi chú ôn tập, bài tập khớp lệnh.',
 'published', 'free', '00000000-0000-0000-0000-000000000100');

INSERT INTO chapters (id, course_id, title, description, sort_order) VALUES
('00000000-0000-0000-0000-000000000405', '00000000-0000-0000-0000-000000000302', 'CĐ1: Tổng quan về TTCK', NULL, 1),
('00000000-0000-0000-0000-000000000406', '00000000-0000-0000-0000-000000000302', 'CĐ2: Các công cụ tài chính trên TTCK', NULL, 2),
('00000000-0000-0000-0000-000000000407', '00000000-0000-0000-0000-000000000302', 'CĐ3: Thị trường sơ cấp', NULL, 3),
('00000000-0000-0000-0000-000000000408', '00000000-0000-0000-0000-000000000302', 'CĐ4: Thị trường thứ cấp và OTC', NULL, 4),
('00000000-0000-0000-0000-000000000409', '00000000-0000-0000-0000-000000000302', 'CĐ5: Công ty Chứng khoán', NULL, 5),
('00000000-0000-0000-0000-000000000410', '00000000-0000-0000-0000-000000000302', 'CĐ6: Công ty QLQ và Quỹ đầu tư CK', NULL, 6),
('00000000-0000-0000-0000-000000000411', '00000000-0000-0000-0000-000000000302', 'CĐ7: Đăng ký, Lưu ký và Bù trừ thanh toán', NULL, 7),
('00000000-0000-0000-0000-000000000412', '00000000-0000-0000-0000-000000000302', 'CĐ8: Hệ thống công bố thông tin', NULL, 8),
('00000000-0000-0000-0000-000000000413', '00000000-0000-0000-0000-000000000302', 'CĐ9: Giám sát giao dịch', NULL, 9),
('00000000-0000-0000-0000-000000000414', '00000000-0000-0000-0000-000000000302', 'CĐ10: Đạo đức nghề nghiệp', NULL, 10),
('00000000-0000-0000-0000-000000000415', '00000000-0000-0000-0000-000000000302', 'CĐ11: CK và CK phái sinh', NULL, 11),
('00000000-0000-0000-0000-000000000416', '00000000-0000-0000-0000-000000000302', 'Ôn tập & Bài tập khớp lệnh', 'Ghi chú ôn tập, bài tập khớp lệnh liên tục', 12);

-- =====================================================
-- KHÓA HỌC 3: CK Phái sinh
-- =====================================================
INSERT INTO courses (id, tenant_id, subject_id, title, description, status, access_type, created_by) VALUES
('00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000203',
 'CK Phái sinh và TTCK Phái sinh',
 'Tổng quan CKPS, Nghị định 158, OTC, Futures, Options, bù trừ thanh toán.',
 'published', 'free', '00000000-0000-0000-0000-000000000100');

INSERT INTO chapters (id, course_id, title, description, sort_order) VALUES
('00000000-0000-0000-0000-000000000417', '00000000-0000-0000-0000-000000000303', 'Tổng quan về CKPS', 'Khái niệm, phân loại, vai trò', 1),
('00000000-0000-0000-0000-000000000418', '00000000-0000-0000-0000-000000000303', 'Pháp lý: Nghị định 158 & Thông tư 58', 'Quy định pháp luật về CKPS', 2),
('00000000-0000-0000-0000-000000000419', '00000000-0000-0000-0000-000000000303', 'CKPS OTC', 'Giao dịch phái sinh phi tập trung', 3),
('00000000-0000-0000-0000-000000000420', '00000000-0000-0000-0000-000000000303', 'Futures - Hợp đồng tương lai', 'Cấu trúc, định giá, chiến lược', 4),
('00000000-0000-0000-0000-000000000421', '00000000-0000-0000-0000-000000000303', 'Options - Quyền chọn', 'Call/Put, định giá, chiến lược', 5),
('00000000-0000-0000-0000-000000000422', '00000000-0000-0000-0000-000000000303', 'Bù trừ và thanh toán CKPS', 'Hoạt động của SGDCK Phái sinh', 6),
('00000000-0000-0000-0000-000000000423', '00000000-0000-0000-0000-000000000303', 'Bài tập & Lời giải CKPS', 'Bài tập tổng hợp với đáp án chi tiết', 7);

-- =====================================================
-- KHÓA HỌC 4: Môi giới CK
-- =====================================================
INSERT INTO courses (id, tenant_id, subject_id, title, description, status, access_type, created_by) VALUES
('00000000-0000-0000-0000-000000000304', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000204',
 'Môi giới CK và tư vấn đầu tư CK',
 'Nghiệp vụ môi giới, tư vấn đầu tư, đạo đức nghề nghiệp.',
 'published', 'free', '00000000-0000-0000-0000-000000000100');

INSERT INTO chapters (id, course_id, title, description, sort_order) VALUES
('00000000-0000-0000-0000-000000000424', '00000000-0000-0000-0000-000000000304', 'Ôn tập Môi giới - Phần 1', NULL, 1),
('00000000-0000-0000-0000-000000000425', '00000000-0000-0000-0000-000000000304', 'Ôn tập Môi giới - Phần 2', NULL, 2),
('00000000-0000-0000-0000-000000000426', '00000000-0000-0000-0000-000000000304', 'Tài liệu ôn thi MG & TVĐTCK', NULL, 3),
('00000000-0000-0000-0000-000000000427', '00000000-0000-0000-0000-000000000304', 'Câu hỏi ôn tập & Đáp án', NULL, 4);

-- =====================================================
-- KHÓA HỌC 5: Pháp luật CK
-- =====================================================
INSERT INTO courses (id, tenant_id, subject_id, title, description, status, access_type, created_by) VALUES
('00000000-0000-0000-0000-000000000305', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000205',
 'Pháp luật về chứng khoán và TTCK',
 'Luật CK, nghị định, thông tư, đề cương ôn thi, bộ đề sát thực tế.',
 'published', 'free', '00000000-0000-0000-0000-000000000100');

INSERT INTO chapters (id, course_id, title, description, sort_order) VALUES
('00000000-0000-0000-0000-000000000428', '00000000-0000-0000-0000-000000000305', 'Đề cương pháp luật CK', 'Nội dung chính của Luật Chứng khoán', 1),
('00000000-0000-0000-0000-000000000429', '00000000-0000-0000-0000-000000000305', 'Luật - Sát đề thi thật', 'Bộ đề cập nhật theo đề thi thực tế', 2),
('00000000-0000-0000-0000-000000000430', '00000000-0000-0000-0000-000000000305', 'Ghi chú & Tóm tắt môn Luật', 'Note quan trọng, bao đậu luật', 3),
('00000000-0000-0000-0000-000000000431', '00000000-0000-0000-0000-000000000305', 'Câu hỏi ôn tập Luật', 'Tổng hợp câu hỏi ôn thi', 4);

-- =====================================================
-- VERIFY
-- =====================================================
SELECT '=== KẾT QUẢ ===' as info;
SELECT COUNT(*) as "Tổng khóa học" FROM courses;
SELECT COUNT(*) as "Tổng chương" FROM chapters;
SELECT c.title as "Khóa học", COUNT(ch.id) as "Số chương"
FROM courses c LEFT JOIN chapters ch ON ch.course_id = c.id
GROUP BY c.title ORDER BY c.title;
