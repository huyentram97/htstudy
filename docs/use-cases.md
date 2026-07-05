# Use Case Specification - H-T.Study eLearning Platform

## UC001 – Đăng nhập (Login)

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer/Maker/Checker/Admin đăng nhập vào hệ thống |
| **Tác nhân** | Tất cả users |
| **Tiền điều kiện** | User có tài khoản active trong hệ thống |
| **Hậu điều kiện** | User được xác thực, JWT token được cấp, redirect đến Dashboard |

### Luồng chính
1. User truy cập trang Login
2. Hệ thống hiển thị form login với nút SSO/OIDC
3. User click đăng nhập → redirect sang Keycloak
4. User nhập credentials trên Keycloak
5. Keycloak xác thực thành công → redirect về callback URL
6. Hệ thống nhận authorization code, đổi lấy JWT token
7. Hệ thống lưu token, redirect user đến Dashboard theo role

### Luồng thay thế
- **3a.** User đã có session active → redirect thẳng Dashboard
- **4a.** User nhập sai credentials → Keycloak hiển thị lỗi
- **4b.** User quên mật khẩu → redirect đến trang reset password của Keycloak

### Ngoại lệ
- **E1.** Account bị locked (5 lần login thất bại) → hiển thị thông báo "Tài khoản bị khóa 30 phút"
- **E2.** Account inactive → hiển thị thông báo "Tài khoản đã bị vô hiệu hóa"
- **E3.** Keycloak unavailable → hiển thị error page với support email

### Quy tắc nghiệp vụ
- BR-001: Khóa tài khoản 30 phút sau 5 lần đăng nhập thất bại liên tiếp
- BR-002: JWT access token hết hạn theo cấu hình (default 60 phút)
- BR-003: Mỗi lần login/logout ghi vào audit log

### Acceptance Criteria
- Given tài khoản active, When đăng nhập đúng credentials, Then nhận JWT token và vào Dashboard
- Given 5 lần sai password, When thử lần thứ 6, Then bị lock 30 phút
- Given account locked, When đợi 30 phút, Then có thể đăng nhập lại

---

## UC002 – Quên mật khẩu

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | User reset mật khẩu khi quên |
| **Tác nhân** | Tất cả users |
| **Tiền điều kiện** | User có email hợp lệ trong hệ thống |
| **Hậu điều kiện** | Mật khẩu được cập nhật, user có thể đăng nhập |

### Luồng chính
1. User click "Quên mật khẩu" trên Login page
2. Hệ thống redirect đến Keycloak reset password flow
3. User nhập email
4. Keycloak gửi email chứa link reset
5. User click link, nhập mật khẩu mới
6. Keycloak cập nhật mật khẩu
7. User được redirect về Login page

### Ngoại lệ
- **E1.** Email không tồn tại → Keycloak vẫn hiển thị thông báo chung (bảo mật)
- **E2.** Link reset hết hạn → thông báo và yêu cầu gửi lại

---

## UC003 – Import tài liệu

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Maker import tài liệu gốc vào platform |
| **Tác nhân** | Maker |
| **Tiền điều kiện** | Maker đã đăng nhập, có file PDF/Word/Excel/CSV/PPT/Text |
| **Hậu điều kiện** | File được lưu, nội dung được trích xuất và cấu trúc hóa |

### Luồng chính
1. Maker mở trang Import
2. Maker chọn file và khóa học đích
3. Hệ thống validate file (format + size ≤ 100MB)
4. Hệ thống upload file lên Object Storage
5. Hệ thống đưa vào AI queue để xử lý
6. AI Engine thực hiện OCR (nếu cần) và trích xuất text
7. AI Engine chuẩn hóa nội dung theo heading hierarchy
8. Hệ thống tạo versioned content record
9. Hệ thống thông báo Maker import thành công

### Luồng thay thế
- **3a.** File format không hỗ trợ → hiển thị danh sách format hỗ trợ
- **3b.** File quá 100MB → thông báo giới hạn
- **6a.** Một số trang không trích xuất được → xử lý phần còn lại, báo Maker trang lỗi
- **7a.** File không có nội dung text → reject import, thông báo lỗi

### Quy tắc nghiệp vụ
- BR-010: Formats hỗ trợ: PDF, DOCX, XLSX, CSV, PPTX, TXT
- BR-011: Giới hạn file 100MB
- BR-012: Bảo toàn cấu trúc document (headings, paragraphs, lists, tables)
- BR-013: File gốc luôn được lưu trữ trong Object Storage

### Acceptance Criteria
- Given file PDF 50MB, When upload, Then bắt đầu xử lý trong 5 giây
- Given file .exe, When upload, Then reject và hiển thị formats hỗ trợ
- Given file scan image, When xử lý, Then OCR trích xuất text thành công

---

## UC004 – AI OCR và Trích xuất nội dung

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | AI trích xuất text từ document scan/image |
| **Tác nhân** | System (AI Engine) |
| **Tiền điều kiện** | Document đã upload thành công |
| **Hậu điều kiện** | Text được trích xuất và cấu trúc hóa thành learning sections |

### Luồng chính
1. AI Engine nhận task từ queue
2. AI Engine phân tích document, phát hiện image-based content
3. AI Engine áp dụng OCR cho các trang/phần chứa image text
4. AI Engine merge OCR output với text content
5. AI Engine segment content theo heading hierarchy
6. AI Engine lưu structured content vào database
7. AI Engine cập nhật import status = "completed"

### Ngoại lệ
- **E1.** OCR fail 1 page → skip page, ghi warning, xử lý tiếp
- **E2.** Toàn bộ OCR fail → retry 3 lần, nếu vẫn fail → status = "failed"
- **E3.** Document không có readable text → reject với error message

---

## UC005 – AI sinh Slide

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | AI tự động tạo slides từ nội dung đã import |
| **Tác nhân** | Maker (trigger), AI Engine (xử lý) |
| **Tiền điều kiện** | Content đã được import và cấu trúc hóa thành công |
| **Hậu điều kiện** | Slides được tạo với max 5 key points/slide |

### Luồng chính
1. Maker click "Generate Slides" cho lesson
2. Hệ thống tạo AI task với priority
3. AI Engine nhận task, đọc structured content
4. AI Engine group content theo section headings
5. AI Engine tạo slides (max 5 key points per slide)
6. AI Engine lưu slides vào database
7. Hệ thống thông báo Maker và set status "Ready for Review"

### Ngoại lệ
- **E1.** AI generation fail → retry 3 lần (interval 60s)
- **E2.** Tất cả retry fail → notify Maker, ghi error message

### Quy tắc nghiệp vụ
- BR-020: Max 5 key points per slide
- BR-021: Generate trong 120 giây per 10 trang source
- BR-022: Auto-retry 3 lần, interval 60 giây

---

## UC006 – AI sinh Voice

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | AI tạo voice narration cho slides |
| **Tác nhân** | Maker (trigger), AI Engine (xử lý) |
| **Tiền điều kiện** | Slides đã được tạo thành công |
| **Hậu điều kiện** | Mỗi slide có audio file với duration 30-180 giây |

### Luồng chính
1. Maker click "Generate Voice" cho lesson có slides
2. AI Engine tạo TTS cho từng slide (Vietnamese)
3. AI Engine lưu audio files vào Object Storage
4. AI Engine synchronize audio timing với slide transitions
5. Hệ thống cập nhật voice_url và duration cho mỗi slide

### Ngoại lệ
- **E1.** TTS service unavailable → queue cho retry
- **E2.** Audio duration ngoài 30-180s → adjust speaking rate

---

## UC007 – Quản lý Môn học (Subject)

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Admin quản lý danh mục môn học |
| **Tác nhân** | Admin |
| **Tiền điều kiện** | Admin đã đăng nhập |
| **Hậu điều kiện** | Môn học được tạo/sửa/xóa |

### Luồng chính
1. Admin mở trang Subjects
2. Admin click "Thêm mới"
3. Admin nhập tên, mô tả, icon, thứ tự
4. Hệ thống validate và lưu
5. Môn học hiển thị trong danh sách

### Luồng thay thế
- **2a.** Admin chọn sửa môn học → hiển thị form edit
- **2b.** Admin chọn xóa → confirm → xóa (nếu không có course liên kết)
- **5a.** Tên trùng → thông báo lỗi

---

## UC008 – Quản lý Chương (Chapter)

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Maker tạo/sửa/xóa/sắp xếp chương trong khóa học |
| **Tác nhân** | Maker |
| **Tiền điều kiện** | Course đã tồn tại, Maker có quyền edit |
| **Hậu điều kiện** | Chapter được tạo/cập nhật với sort order |

### Luồng chính
1. Maker mở Course detail
2. Maker click "Thêm chương"
3. Maker nhập title, description
4. Hệ thống tạo chapter với sort_order tự động
5. Maker có thể drag-drop để sắp xếp lại

---

## UC009 – Quản lý Bài học (Lesson)

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Maker tạo/sửa bài học trong chương |
| **Tác nhân** | Maker |
| **Tiền điều kiện** | Chapter đã tồn tại |
| **Hậu điều kiện** | Lesson được tạo với content type (text/slide/video/mixed) |

### Luồng chính
1. Maker mở Chapter detail
2. Maker click "Thêm bài học"
3. Maker chọn content type và nhập nội dung
4. Hệ thống validate và lưu
5. Lesson xuất hiện trong chapter

---

## UC010 – Duyệt nội dung (Checker Approve)

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Checker duyệt và publish nội dung |
| **Tác nhân** | Checker |
| **Tiền điều kiện** | Content có status "pending_review" |
| **Hậu điều kiện** | Content status = "published", visible cho Customers |

### Luồng chính
1. Checker mở Inbox (danh sách content pending review)
2. Checker chọn 1 content để review
3. Hệ thống hiển thị preview nội dung
4. Checker click "Approve"
5. Hệ thống cập nhật status = "published"
6. Hệ thống thông báo Maker
7. Content hiển thị cho Customers

### Luồng thay thế
- **4a.** Checker click "Reject" → nhập lý do (≥10 chars) → status = "rejected" → notify Maker

### Quy tắc nghiệp vụ
- BR-030: Maker không thể approve content của chính mình
- BR-031: Content pending review không hiển thị cho Customer
- BR-032: Rejection reason tối thiểu 10 ký tự

---

## UC011 – Học bài (Customer Learning)

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer xem nội dung bài học |
| **Tác nhân** | Customer |
| **Tiền điều kiện** | Course/lesson đã unlocked, content đã published |
| **Hậu điều kiện** | Progress được cập nhật, thời gian học được ghi nhận |

### Luồng chính
1. Customer mở Course → Chapter → Lesson
2. Hệ thống kiểm tra access (unlocked?)
3. Hệ thống hiển thị nội dung (text/slide/video)
4. Customer đọc/xem nội dung
5. Hệ thống auto-save progress mỗi 30 giây
6. Khi hoàn thành lesson → cập nhật % completion

### Luồng thay thế
- **2a.** Content locked → hiển thị unlock options (points/premium/prerequisite)
- **4a.** Lesson có slides → hiển thị slide viewer với sync audio
- **4b.** Lesson có video → hiển thị video player

---

## UC012 – Tiếp tục học (Resume Learning)

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer quay lại đúng vị trí đang học |
| **Tác nhân** | Customer |
| **Tiền điều kiện** | Customer có progress đã lưu |
| **Hậu điều kiện** | Navigate đến exact position (page/scroll/video timestamp) |

### Luồng chính
1. Customer mở Dashboard hoặc Course
2. Hệ thống hiển thị nút "Tiếp tục học" với thông tin (course, chapter, lesson, %)
3. Customer click "Tiếp tục học"
4. Hệ thống navigate đến vị trí đã lưu trong 3 giây

### Ngoại lệ
- **E1.** Content đã bị xóa/restructured → navigate đến lesson gần nhất, notify "Nội dung đã cập nhật"

---

## UC013 – Bookmark nội dung

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer đánh dấu vị trí quan trọng |
| **Tác nhân** | Customer |
| **Tiền điều kiện** | Customer đang xem lesson content |
| **Hậu điều kiện** | Bookmark được lưu với page reference và position |

### Luồng chính
1. Customer click icon Bookmark trên lesson page
2. Hệ thống lưu bookmark (entity, page, scroll position, timestamp)
3. Icon Bookmark chuyển sang trạng thái active

---

## UC014 – Tạo ghi chú (Note)

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer ghi chú trong bài học |
| **Tác nhân** | Customer |
| **Tiền điều kiện** | Customer đang xem lesson |
| **Hậu điều kiện** | Note được lưu gắn với section cụ thể |

### Luồng chính
1. Customer click "Add Note" tại vị trí mong muốn
2. Hệ thống mở editor (bold/italic/highlight)
3. Customer nhập nội dung (max 5000 chars)
4. Hệ thống auto-save trong 2 giây
5. Note hiển thị inline hoặc trong panel

---

## UC015 – Tìm kiếm nội dung

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer tìm kiếm nội dung trên toàn platform |
| **Tác nhân** | Customer |
| **Tiền điều kiện** | Customer đã đăng nhập |
| **Hậu điều kiện** | Kết quả tìm kiếm hiển thị với highlight |

### Luồng chính
1. Customer nhập từ khóa (2-200 chars)
2. Hệ thống search qua Elasticsearch (lessons, slides, quizzes, notes, bookmarks)
3. Hệ thống trả kết quả trong 2 giây
4. Hiển thị results với keyword highlight, content type, 30 words context
5. Customer click result → navigate đến vị trí chính xác

### Quy tắc nghiệp vụ
- BR-040: Hỗ trợ tìm không dấu → khớp với có dấu (và ngược lại)
- BR-041: Max 20 results per page
- BR-042: Query tối thiểu 2 ký tự

---

## UC016 – AI Chat

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer hỏi AI về kiến thức liên quan bài học |
| **Tác nhân** | Customer |
| **Tiền điều kiện** | Customer đang xem lesson, AI Chat enabled |
| **Hậu điều kiện** | AI trả lời dựa trên context bài học hiện tại |

### Luồng chính
1. Customer mở AI Chat panel
2. Customer gõ câu hỏi (max 2000 chars)
3. AI Engine nhận context từ lesson hiện tại
4. AI Engine trả lời trong 10 giây
5. Conversation history được lưu (max 50 messages/session)

### Ngoại lệ
- **E1.** AI không trả lời được → thông báo và gợi ý Search hoặc Support
- **E2.** Session hết hạn (30 phút inactive) → tạo session mới

---

## UC017 – AI Explain

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer chọn text để AI giải thích chi tiết |
| **Tác nhân** | Customer |
| **Tiền điều kiện** | Customer đang xem lesson content |
| **Hậu điều kiện** | AI hiển thị giải thích cho text đã chọn |

### Luồng chính
1. Customer bôi đen text (1-1000 chars)
2. Context menu hiện "AI Explain"
3. Customer click → AI Engine xử lý
4. AI trả lời giải thích trong 15 giây
5. Hiển thị trong popup hoặc chat panel

### Ngoại lệ
- **E1.** Text > 1000 chars → thông báo giới hạn

---

## UC018 – AI Chat tìm tài liệu liên quan (Req 42)

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer hỏi kiến thức và nhận gợi ý tài liệu liên quan trên toàn platform |
| **Tác nhân** | Customer |
| **Tiền điều kiện** | Customer đã đăng nhập, AI material search enabled |
| **Hậu điều kiện** | AI trả lời kèm danh sách tài liệu liên quan (max 10) |

### Luồng chính
1. Customer mở AI Chat (mode: material_search)
2. Customer gõ câu hỏi kiến thức
3. AI Engine phân tích câu hỏi → xác định key topics
4. Search Engine tìm kiếm trên TOÀN BỘ learning materials (không giới hạn enrolled)
5. AI Engine kết hợp: AI answer + danh sách tài liệu liên quan
6. Hiển thị kết quả: câu trả lời AI + max 10 references (title, content type, relevance summary)
7. Mỗi reference hiển thị trạng thái accessible/locked

### Luồng thay thế
- **5a.** Không tìm thấy tài liệu liên quan → hiển thị chỉ AI answer, thông báo không có tài liệu
- **7a.** Customer click reference → navigate đến content (nếu accessible)
- **7b.** Customer click locked reference → hiển thị unlock options

### Quy tắc nghiệp vụ
- BR-050: Search across ALL courses/subjects, không giới hạn enrolled
- BR-051: Max 10 references per question, ranked by relevance
- BR-052: Hiển thị lock/unlock status cho mỗi reference

---

## UC019 – Tạo câu hỏi (Question Bank)

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Maker tạo câu hỏi cho Question Bank |
| **Tác nhân** | Maker |
| **Tiền điều kiện** | Maker đã đăng nhập |
| **Hậu điều kiện** | Câu hỏi được lưu với status "draft" |

### Luồng chính
1. Maker mở Question Bank
2. Maker click "Thêm câu hỏi"
3. Maker chọn type (single/multiple choice)
4. Maker nhập: content, options (2-8), correct answer, explanation, difficulty, subject, tags
5. Hệ thống validate tất cả required fields
6. Hệ thống lưu với status "draft"

### Ngoại lệ
- **E1.** Thiếu required fields → hiển thị danh sách fields cần bổ sung
- **E2.** < 2 options → reject save

---

## UC020 – Import câu hỏi hàng loạt

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Maker import nhiều câu hỏi từ file |
| **Tác nhân** | Maker |
| **Tiền điều kiện** | Maker có file Excel/CSV/Word theo template |
| **Hậu điều kiện** | Câu hỏi được thêm vào Question Bank (status "draft") |

### Luồng chính
1. Maker download template file
2. Maker điền dữ liệu theo template
3. Maker upload file (max 500 questions, max 10MB)
4. Hệ thống parse và validate từng row
5. Hệ thống hiển thị preview (valid + invalid entries)
6. Maker confirm các entries hợp lệ
7. Hệ thống lưu confirmed entries với status "draft"

### Ngoại lệ
- **E1.** File > 10MB hoặc > 500 rows → reject file
- **E2.** Row có lỗi → highlight error với row number và field name

---

## UC021 – Tạo bộ đề thi

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Maker tạo exam từ Question Bank |
| **Tác nhân** | Maker |
| **Tiền điều kiện** | Question Bank có đủ câu hỏi approved |
| **Hậu điều kiện** | Exam được tạo với configured parameters |

### Luồng chính
1. Maker mở Exam Management
2. Maker click "Tạo đề thi"
3. Maker nhập: title, subject, time limit (1-480 min), passing score
4. Maker chọn questions thủ công (filter theo subject/difficulty/certification) HOẶC
5. Maker chọn "AI Generate" (specify: count 5-200, difficulty distribution)
6. Hệ thống validate: no duplicates, đủ questions
7. Hệ thống tạo exam

### Ngoại lệ
- **E1.** Không đủ questions matching criteria → thông báo số lượng khả dụng

---

## UC022 – Làm bài thi

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer làm bài thi |
| **Tác nhân** | Customer |
| **Tiền điều kiện** | Exam unlocked, Customer có quyền access |
| **Hậu điều kiện** | Score được tính, attempt được lưu |

### Luồng chính
1. Customer chọn exam và click "Bắt đầu"
2. Hệ thống tạo attempt, hiển thị questions (randomize nếu configured)
3. Customer trả lời từng câu hỏi
4. Timer đếm ngược
5. Customer click "Nộp bài"
6. Hệ thống tính điểm ngay lập tức
7. Hiển thị: score, passed/failed, correct answers + AI explanations

### Luồng thay thế
- **4a.** Hết thời gian → auto-submit với answers đã chọn

### Quy tắc nghiệp vụ
- BR-060: Unlimited retakes
- BR-061: Mỗi attempt lưu riêng (score, duration, per-question answers)
- BR-062: Auto-submit khi hết time limit

---

## UC023 – Học Flashcard

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer ôn tập bằng flashcard |
| **Tác nhân** | Customer |
| **Tiền điều kiện** | Flashcard set tồn tại và accessible |
| **Hậu điều kiện** | Progress per card được cập nhật |

### Luồng chính
1. Customer chọn Flashcard set
2. Hệ thống hiển thị card (front = question)
3. Customer flip card (back = answer)
4. Customer đánh dấu "Known" hoặc "Need Review"
5. Hệ thống ưu tiên "Need Review" cards trước
6. Tiếp tục cho đến hết hoặc Customer dừng

---

## UC024 – Nhận điểm thưởng

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer nhận points khi hoàn thành activity |
| **Tác nhân** | System (tự động) |
| **Tiền điều kiện** | Customer hoàn thành lesson/quiz/exam |
| **Hậu điều kiện** | Points credited, transaction recorded |

### Luồng chính
1. Customer hoàn thành activity
2. Gamification Engine xác định activity type + difficulty
3. Engine tra bảng points config → tính điểm
4. Engine credit points cho user
5. Engine ghi transaction record
6. Dashboard cập nhật points balance

---

## UC025 – Combo thời gian học

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer nhận combo bonus khi học liên tục |
| **Tác nhân** | System (tự động) |
| **Tiền điều kiện** | Customer đang trong learning session |
| **Hậu điều kiện** | Combo bonus awarded tại mốc 30/60/90/120 phút |

### Luồng chính
1. Customer bắt đầu học → combo timer bắt đầu (Redis)
2. Mỗi 30 giây hệ thống check elapsed time
3. Tại mốc 30 min → award 30-min combo bonus
4. Tại mốc 60 min → award 60-min combo bonus (higher)
5. Tại mốc 90/120 min → tương tự
6. Hiển thị combo notification cho Customer

### Ngoại lệ
- **E1.** Inactive > 5 phút → reset combo timer về 0

---

## UC026 – Mở khóa bằng điểm

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer dùng điểm để unlock content |
| **Tác nhân** | Customer |
| **Tiền điều kiện** | Content locked, unlock by points enabled |
| **Hậu điều kiện** | Content permanently unlocked, points deducted |

### Luồng chính
1. Customer gặp locked content → thấy point cost
2. Customer click "Mở khóa"
3. Hệ thống check available points ≥ cost
4. Hệ thống deduct points, record transaction
5. Hệ thống grant permanent access
6. Content accessible ngay lập tức

### Luồng thay thế
- **3a.** Insufficient points → hiển thị deficit + gợi ý cách earn thêm

---

## UC027 – Daily Missions

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer nhận và hoàn thành nhiệm vụ hàng ngày |
| **Tác nhân** | Customer |
| **Tiền điều kiện** | Customer đăng nhập |
| **Hậu điều kiện** | Bonus points awarded khi hoàn thành |

### Luồng chính
1. Hệ thống generate missions lúc 00:00 (3-5 missions)
2. Customer mở Dashboard → thấy daily missions + progress bars
3. Customer thực hiện activities → progress cập nhật realtime
4. Khi 1 mission complete → bonus points ngay lập tức
5. Khi ALL missions complete → additional completion bonus

### Ngoại lệ
- **E1.** 23:59 chưa hoàn thành → missions expire, không penalty

---

## UC028 – Xem Leaderboard

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer xem bảng xếp hạng |
| **Tác nhân** | Customer |
| **Tiền điều kiện** | Customer đã đăng nhập |
| **Hậu điều kiện** | Hiển thị top 100 + vị trí của Customer |

### Luồng chính
1. Customer mở trang Leaderboard
2. Customer chọn period (daily/weekly/monthly/all-time)
3. Hệ thống hiển thị top 100 (rank, name, avatar, points, level)
4. Hệ thống highlight vị trí Customer

---

## UC029 – Đăng ký Learning Path

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer đăng ký theo lộ trình học |
| **Tác nhân** | Customer |
| **Tiền điều kiện** | Learning path active |
| **Hậu điều kiện** | Customer enrolled, step 1 unlocked |

### Luồng chính
1. Customer browse Learning Paths
2. Customer xem detail (steps, certifications, total duration)
3. Customer click "Đăng ký"
4. Hệ thống enroll Customer, unlock step 1
5. Dashboard hiển thị learning path với progress

---

## UC030 – Hoàn thành step trong Learning Path

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Auto-unlock next step khi hoàn thành current step |
| **Tác nhân** | System (tự động) |
| **Tiền điều kiện** | Customer enrolled trong learning path |
| **Hậu điều kiện** | Next step unlocked, progress updated |

### Luồng chính
1. Customer completes course/chapter/exam (current step)
2. Learning Path Engine detects completion
3. Engine unlocks next step within 5 seconds
4. Engine recalculates progress percentage
5. Nếu shared content → sync across enrolled paths
6. Nếu final step → mark path "Completed" + notify

---

## UC031 – Quản lý User (Admin)

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Admin quản lý tài khoản users |
| **Tác nhân** | Admin |
| **Tiền điều kiện** | Admin đã đăng nhập |
| **Hậu điều kiện** | User được tạo/sửa/xóa/lock/unlock |

### Luồng chính
1. Admin mở User Management
2. Admin tìm kiếm/filter users
3. Admin thực hiện: tạo mới, edit, change status, delete, assign role/group

### Luồng thay thế
- **3a.** Bulk import via CSV → validate + import report

---

## UC032 – Cấu hình Support Email

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Admin cấu hình email hỗ trợ |
| **Tác nhân** | Admin |
| **Tiền điều kiện** | Admin đã đăng nhập |
| **Hậu điều kiện** | Email hiển thị trên Login, Footer, Profile, Error pages |

### Luồng chính
1. Admin mở System Configuration
2. Admin nhập/sửa support email
3. Hệ thống validate email format
4. Hệ thống lưu config
5. Support email cập nhật across all pages trong 1 phút

---

## UC033 – Xem Audit Log

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Admin xem lịch sử hành động hệ thống |
| **Tác nhân** | Admin |
| **Tiền điều kiện** | Admin đã đăng nhập |
| **Hậu điều kiện** | Audit logs hiển thị với filter |

### Luồng chính
1. Admin mở Audit Logs page
2. Admin filter (date range, user, action type, resource)
3. Hệ thống hiển thị logs (reverse chronological, 100/page)
4. Admin có thể export (CSV/Excel, max 50K records)

### Quy tắc nghiệp vụ
- BR-070: Audit logs immutable (no edit/delete)
- BR-071: Retention minimum 12 months
- BR-072: Export max 50,000 records

---

## UC034 – Admin Dashboard

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Admin xem tổng quan platform |
| **Tác nhân** | Admin |
| **Tiền điều kiện** | Admin đã đăng nhập |
| **Hậu điều kiện** | KPIs và analytics hiển thị |

### Luồng chính
1. Admin mở Dashboard
2. Hệ thống hiển thị KPIs (total users, active users, courses, exams)
3. Hệ thống hiển thị learning analytics (completion rate, avg time, popular courses)
4. Hệ thống hiển thị gamification metrics (points, streaks, leaderboard)
5. Admin filter by date range (default 30 days)
6. Data refresh mỗi 5-60 phút (configurable)

---

## UC035 – Customer Dashboard

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer xem tổng quan cá nhân |
| **Tác nhân** | Customer |
| **Tiền điều kiện** | Customer đã đăng nhập |
| **Hậu điều kiện** | Dashboard hiển thị progress, streak, points, missions |

### Luồng chính
1. Customer mở Dashboard (home page)
2. Hiển thị: streak count, points balance, level, daily missions
3. Hiển thị: 5 recent courses với % và "Tiếp tục học"
4. Hiển thị: enrolled learning paths với %
5. Hiển thị: leaderboard position
6. Hiển thị: AI recommendations

---

## UC036 – Nhận thông báo

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Customer nhận và xem thông báo |
| **Tác nhân** | Customer |
| **Tiền điều kiện** | Event trigger xảy ra (badge, unlock, workflow, system) |
| **Hậu điều kiện** | Notification delivered within 30 seconds |

### Luồng chính
1. Event xảy ra (badge earned, content unlocked, etc.)
2. Notification Service tạo notification
3. Hiển thị unread count badge trên navigation
4. Customer mở notification panel
5. Customer xem và mark as read

---

## UC037 – Export dữ liệu

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Admin/Customer export dữ liệu ra file |
| **Tác nhân** | Admin (all data), Customer (own data only) |
| **Tiền điều kiện** | User đã đăng nhập |
| **Hậu điều kiện** | File sẵn sàng download (PDF/Excel/CSV) |

### Luồng chính
1. User chọn data type và format
2. Hệ thống bắt đầu async generation
3. Hệ thống notify khi file ready
4. User download file (available 24 hours)

### Quy tắc nghiệp vụ
- BR-080: Customer chỉ export data cá nhân
- BR-081: File > 50MB → auto compress
- BR-082: File auto-delete sau 24 giờ

---

## UC038 – Cấp chứng chỉ

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Cấp certificate khi hoàn thành learning path |
| **Tác nhân** | System (tự động) |
| **Tiền điều kiện** | Customer hoàn thành toàn bộ steps trong learning path |
| **Hậu điều kiện** | Certificate generated với unique verification code |

### Luồng chính
1. Learning Path Engine detect path completion
2. System generate certificate từ template
3. System gán unique verification code
4. Certificate hiển thị trên Customer profile
5. Customer download PDF

---

## UC039 – Xác thực chứng chỉ

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | Bên thứ 3 xác minh tính hợp lệ chứng chỉ |
| **Tác nhân** | External (bất kỳ ai) |
| **Tiền điều kiện** | Có verification code |
| **Hậu điều kiện** | Hiển thị thông tin chứng chỉ nếu hợp lệ |

### Luồng chính
1. Third party truy cập trang verify
2. Nhập verification code
3. Hệ thống tìm certificate
4. Hiển thị: tên người nhận, tên chứng chỉ, ngày cấp

### Ngoại lệ
- **E1.** Code không hợp lệ → thông báo "Không tìm thấy chứng chỉ"

---

## UC040 – AI sinh Quiz tự động

| Mục | Nội dung |
|-----|----------|
| **Mục tiêu** | AI tạo quiz từ nội dung bài học |
| **Tác nhân** | Maker (trigger), AI Engine (xử lý) |
| **Tiền điều kiện** | Lesson có content đã import |
| **Hậu điều kiện** | 3-10 quiz questions generated per section |

### Luồng chính
1. Maker click "AI Generate Quiz" cho lesson
2. AI Engine phân tích content
3. AI sinh 3-10 questions (single + multiple choice)
4. AI gán difficulty (Easy/Medium/Hard), đảm bảo ≥1 per level
5. AI tạo explanations (max 500 chars each)
6. Questions saved as "AI-generated" + status "Draft"
7. Notify Maker để review

### Ngoại lệ
- **E1.** Content quá ngắn → AI không đủ sinh 3 questions → notify Maker "nội dung không đủ"
