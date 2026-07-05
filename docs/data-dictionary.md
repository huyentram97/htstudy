# Data Dictionary - H-T.Study eLearning Platform

## 1. Table: tenants

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã định danh tenant |
| 2 | name | VARCHAR | 200 | NOT NULL | - | Required | Tên tổ chức/tenant |
| 3 | slug | VARCHAR | 100 | NOT NULL | - | Unique, lowercase, alphanumeric+dash | URL slug cho tenant |
| 4 | logo_url | VARCHAR | 500 | NULL | - | Valid URL format | Logo tenant |
| 5 | config | JSONB | - | NOT NULL | '{}' | Valid JSON | Cấu hình riêng tenant |
| 6 | status | VARCHAR | 20 | NOT NULL | 'active' | Enum: active, inactive, suspended | Trạng thái tenant |
| 7 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |
| 8 | updated_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-update | Ngày cập nhật |

## 2. Table: users

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã người dùng |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant sở hữu |
| 3 | username | VARCHAR | 50 | NOT NULL | - | Unique, 3-50 chars, [a-zA-Z0-9_] | Tên đăng nhập |
| 4 | email | VARCHAR | 254 | NOT NULL | - | Unique, RFC 5322 format | Email đăng nhập |
| 5 | full_name | VARCHAR | 100 | NOT NULL | - | 1-100 chars | Họ và tên |
| 6 | phone | VARCHAR | 15 | NULL | - | 7-15 digits, optional + prefix | Số điện thoại |
| 7 | avatar_url | VARCHAR | 500 | NULL | - | Valid URL, JPEG/PNG max 2MB | Ảnh đại diện |
| 8 | status | VARCHAR | 20 | NOT NULL | 'active' | Enum: active, inactive, locked | Trạng thái tài khoản |
| 9 | keycloak_id | VARCHAR | 100 | NULL | - | Keycloak subject ID | ID liên kết Keycloak |
| 10 | last_login_at | TIMESTAMP | - | NULL | - | Auto-update on login | Lần đăng nhập cuối |
| 11 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo tài khoản |
| 12 | updated_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-update | Ngày cập nhật |

## 3. Table: roles

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã vai trò |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant sở hữu |
| 3 | name | VARCHAR | 50 | NOT NULL | - | Required | Tên vai trò (Admin/Maker/Checker/Customer) |
| 4 | description | VARCHAR | 500 | NULL | - | Max 500 chars | Mô tả vai trò |
| 5 | is_system | BOOLEAN | - | NOT NULL | FALSE | - | Vai trò hệ thống (không xóa được) |
| 6 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |

## 4. Table: permissions

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã quyền |
| 2 | resource | VARCHAR | 100 | NOT NULL | - | Required | Tài nguyên (course, exam, user...) |
| 3 | action | VARCHAR | 50 | NOT NULL | - | Enum: create, read, update, delete | Hành động được phép |
| 4 | description | VARCHAR | 500 | NULL | - | Max 500 chars | Mô tả quyền |

**Unique constraint:** (resource, action)

## 5. Table: role_permissions

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | role_id | UUID | - | NOT NULL | - | FK → roles.id, PK | Vai trò |
| 2 | permission_id | UUID | - | NOT NULL | - | FK → permissions.id, PK | Quyền được gán |

## 6. Table: user_roles

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | user_id | UUID | - | NOT NULL | - | FK → users.id, PK | Người dùng |
| 2 | role_id | UUID | - | NOT NULL | - | FK → roles.id, PK | Vai trò được gán |

## 7. Table: groups

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã nhóm |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant sở hữu |
| 3 | name | VARCHAR | 100 | NOT NULL | - | Required | Tên nhóm |
| 4 | description | VARCHAR | 500 | NULL | - | Max 500 chars | Mô tả nhóm |
| 5 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |

## 8. Table: user_groups

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | user_id | UUID | - | NOT NULL | - | FK → users.id, PK | Người dùng |
| 2 | group_id | UUID | - | NOT NULL | - | FK → groups.id, PK | Nhóm được gán |

## 9. Table: group_permissions

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | group_id | UUID | - | NOT NULL | - | FK → groups.id, PK | Nhóm |
| 2 | permission_id | UUID | - | NOT NULL | - | FK → permissions.id, PK | Quyền được gán cho nhóm |

## 10. Table: subjects

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã môn học |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant sở hữu |
| 3 | name | VARCHAR | 200 | NOT NULL | - | Required | Tên môn học |
| 4 | description | TEXT | - | NULL | - | - | Mô tả môn học |
| 5 | icon_url | VARCHAR | 500 | NULL | - | Valid URL | Icon môn học |
| 6 | status | VARCHAR | 20 | NOT NULL | 'active' | Enum: active, inactive | Trạng thái |
| 7 | sort_order | INT | - | NOT NULL | 0 | ≥ 0 | Thứ tự hiển thị |
| 8 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |

## 11. Table: courses

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã khóa học |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant sở hữu |
| 3 | subject_id | UUID | - | NULL | - | FK → subjects.id | Môn học liên kết |
| 4 | title | VARCHAR | 300 | NOT NULL | - | Required, 1-300 chars | Tên khóa học |
| 5 | description | TEXT | - | NULL | - | - | Mô tả khóa học |
| 6 | thumbnail_url | VARCHAR | 500 | NULL | - | Valid URL | Ảnh thumbnail |
| 7 | status | VARCHAR | 20 | NOT NULL | 'draft' | Enum: draft, pending_review, published, rejected | Trạng thái workflow |
| 8 | access_type | VARCHAR | 20 | NOT NULL | 'locked' | Enum: free, locked, premium | Loại truy cập |
| 9 | point_cost | INT | - | NOT NULL | 0 | ≥ 0 | Điểm cần để mở khóa |
| 10 | version | INT | - | NOT NULL | 1 | ≥ 1 | Phiên bản hiện tại |
| 11 | created_by | UUID | - | NULL | - | FK → users.id | Maker tạo |
| 12 | reviewed_by | UUID | - | NULL | - | FK → users.id | Checker duyệt |
| 13 | published_at | TIMESTAMP | - | NULL | - | Set on publish | Ngày publish |
| 14 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |
| 15 | updated_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-update | Ngày cập nhật |

## 12. Table: chapters

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã chương |
| 2 | course_id | UUID | - | NOT NULL | - | FK → courses.id | Khóa học chứa |
| 3 | title | VARCHAR | 300 | NOT NULL | - | Required | Tên chương |
| 4 | description | TEXT | - | NULL | - | - | Mô tả chương |
| 5 | sort_order | INT | - | NOT NULL | 0 | ≥ 0 | Thứ tự trong khóa học |
| 6 | access_type | VARCHAR | 20 | NOT NULL | 'locked' | Enum: free, locked, premium | Loại truy cập |
| 7 | point_cost | INT | - | NOT NULL | 0 | ≥ 0 | Điểm mở khóa |
| 8 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |

## 13. Table: lessons

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã bài học |
| 2 | chapter_id | UUID | - | NOT NULL | - | FK → chapters.id | Chương chứa |
| 3 | title | VARCHAR | 300 | NOT NULL | - | Required | Tên bài học |
| 4 | content_type | VARCHAR | 20 | NOT NULL | - | Enum: text, slide, video, mixed | Loại nội dung |
| 5 | content | JSONB | - | NULL | - | Structured content | Nội dung bài học |
| 6 | duration_minutes | INT | - | NOT NULL | 0 | ≥ 0 | Thời lượng ước tính |
| 7 | sort_order | INT | - | NOT NULL | 0 | ≥ 0 | Thứ tự trong chương |
| 8 | access_type | VARCHAR | 20 | NOT NULL | 'locked' | Enum: free, locked, premium | Loại truy cập |
| 9 | point_cost | INT | - | NOT NULL | 0 | ≥ 0 | Điểm mở khóa |
| 10 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |
| 11 | updated_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-update | Ngày cập nhật |

## 14. Table: content_versions

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã phiên bản |
| 2 | entity_type | VARCHAR | 50 | NOT NULL | - | Enum: course, chapter, lesson | Loại entity |
| 3 | entity_id | UUID | - | NOT NULL | - | - | ID entity gốc |
| 4 | version_number | INT | - | NOT NULL | - | Sequential, ≥ 1 | Số phiên bản |
| 5 | content | JSONB | - | NOT NULL | - | Full content snapshot | Nội dung phiên bản |
| 6 | change_summary | VARCHAR | 500 | NOT NULL | - | Required, 1-500 chars | Mô tả thay đổi |
| 7 | author_id | UUID | - | NULL | - | FK → users.id | Người tạo phiên bản |
| 8 | is_revert | BOOLEAN | - | NOT NULL | FALSE | - | Đánh dấu là revert |
| 9 | reverted_from | INT | - | NULL | - | Version number source | Revert từ phiên bản nào |
| 10 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |

## 15. Table: slides

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã slide |
| 2 | lesson_id | UUID | - | NOT NULL | - | FK → lessons.id | Bài học chứa |
| 3 | slide_number | INT | - | NOT NULL | - | ≥ 1, sequential | Số thứ tự slide |
| 4 | title | VARCHAR | 300 | NULL | - | - | Tiêu đề slide |
| 5 | content | JSONB | - | NOT NULL | - | Key points, text, images | Nội dung slide |
| 6 | voice_url | VARCHAR | 500 | NULL | - | Valid URL | URL file voice |
| 7 | voice_duration_seconds | INT | - | NULL | - | 30-180 | Thời lượng voice |
| 8 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |

## 16. Table: media_files

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã media |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant sở hữu |
| 3 | title | VARCHAR | 200 | NOT NULL | - | Required, 1-200 chars | Tiêu đề file |
| 4 | description | VARCHAR | 1000 | NULL | - | Max 1000 chars | Mô tả |
| 5 | file_type | VARCHAR | 20 | NOT NULL | - | Enum: image, video, audio | Loại file |
| 6 | file_format | VARCHAR | 10 | NOT NULL | - | JPEG/PNG/GIF/SVG/WebP/MP4/WebM/MP3/WAV/OGG | Định dạng file |
| 7 | file_url | VARCHAR | 500 | NOT NULL | - | Valid URL, Object Storage path | URL lưu trữ |
| 8 | file_size_bytes | BIGINT | - | NOT NULL | - | > 0, max 500MB (524288000) | Dung lượng file |
| 9 | uploaded_by | UUID | - | NULL | - | FK → users.id | Người upload |
| 10 | usage_count | INT | - | NOT NULL | 0 | ≥ 0, auto-calculated | Số lần được tham chiếu |
| 11 | tags | VARCHAR[] | 50 each | NOT NULL | '{}' | Max 20 tags per file | Nhãn phân loại |
| 12 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày upload |

## 17. Table: document_imports

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã import |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant sở hữu |
| 3 | original_filename | VARCHAR | 300 | NOT NULL | - | Required | Tên file gốc |
| 4 | file_format | VARCHAR | 20 | NOT NULL | - | pdf/docx/xlsx/csv/pptx/txt | Định dạng file |
| 5 | file_size_bytes | BIGINT | - | NOT NULL | - | > 0, max 100MB | Dung lượng |
| 6 | storage_url | VARCHAR | 500 | NOT NULL | - | Object Storage path | Vị trí lưu file gốc |
| 7 | status | VARCHAR | 20 | NOT NULL | 'processing' | Enum: processing, completed, failed | Trạng thái xử lý |
| 8 | target_course_id | UUID | - | NULL | - | FK → courses.id | Khóa học đích |
| 9 | processing_result | JSONB | - | NULL | - | Sections extracted, warnings | Kết quả xử lý |
| 10 | error_message | TEXT | - | NULL | - | - | Thông báo lỗi |
| 11 | uploaded_by | UUID | - | NULL | - | FK → users.id | Người upload |
| 12 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày upload |
| 13 | completed_at | TIMESTAMP | - | NULL | - | Set on complete/fail | Ngày hoàn thành |

## 18. Table: certifications

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã chứng chỉ |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant sở hữu |
| 3 | name | VARCHAR | 200 | NOT NULL | - | Required | Tên chứng chỉ |
| 4 | description | TEXT | - | NULL | - | - | Mô tả chứng chỉ |
| 5 | status | VARCHAR | 20 | NOT NULL | 'active' | Enum: active, inactive | Trạng thái |
| 6 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |

## 19. Table: questions

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã câu hỏi |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant sở hữu |
| 3 | subject_id | UUID | - | NULL | - | FK → subjects.id | Môn học |
| 4 | certification_id | UUID | - | NULL | - | FK → certifications.id | Chứng chỉ liên quan |
| 5 | question_type | VARCHAR | 20 | NOT NULL | - | Enum: single_choice, multiple_choice | Loại câu hỏi |
| 6 | content | TEXT | 5000 | NOT NULL | - | Required, max 5000 chars | Nội dung câu hỏi |
| 7 | options | JSONB | - | NOT NULL | - | Array [{id, text, is_correct}], 2-8 items | Đáp án |
| 8 | explanation | VARCHAR | 2000 | NULL | - | Max 2000 chars | Giải thích đáp án |
| 9 | difficulty | VARCHAR | 10 | NOT NULL | - | Enum: easy, medium, hard | Độ khó |
| 10 | tags | VARCHAR[] | 50 each | NOT NULL | '{}' | Max 10 tags | Nhãn phân loại |
| 11 | is_ai_generated | BOOLEAN | - | NOT NULL | FALSE | - | AI tạo hay thủ công |
| 12 | status | VARCHAR | 20 | NOT NULL | 'draft' | Enum: draft, approved, rejected | Trạng thái duyệt |
| 13 | created_by | UUID | - | NULL | - | FK → users.id | Maker tạo |
| 14 | approved_by | UUID | - | NULL | - | FK → users.id | Checker duyệt |
| 15 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |
| 16 | updated_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-update | Ngày cập nhật |

## 20. Table: exams

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã bộ đề |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant sở hữu |
| 3 | subject_id | UUID | - | NULL | - | FK → subjects.id | Môn học |
| 4 | certification_id | UUID | - | NULL | - | FK → certifications.id | Chứng chỉ |
| 5 | title | VARCHAR | 300 | NOT NULL | - | Required | Tên bộ đề |
| 6 | description | TEXT | - | NULL | - | - | Mô tả |
| 7 | time_limit_minutes | INT | - | NOT NULL | 60 | 1-480 | Thời gian làm bài (phút) |
| 8 | passing_score | INT | - | NOT NULL | 60 | 0-100 | Điểm đạt (%) |
| 9 | randomize_questions | BOOLEAN | - | NOT NULL | FALSE | - | Đảo thứ tự câu hỏi |
| 10 | shuffle_answers | BOOLEAN | - | NOT NULL | FALSE | - | Đảo thứ tự đáp án |
| 11 | question_count | INT | - | NOT NULL | - | 5-200 | Số câu hỏi |
| 12 | access_type | VARCHAR | 20 | NOT NULL | 'locked' | Enum: free, locked, premium | Loại truy cập |
| 13 | point_cost | INT | - | NOT NULL | 0 | ≥ 0 | Điểm mở khóa |
| 14 | status | VARCHAR | 20 | NOT NULL | 'draft' | Enum: draft, published | Trạng thái |
| 15 | created_by | UUID | - | NULL | - | FK → users.id | Maker tạo |
| 16 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |

## 21. Table: exam_questions

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | exam_id | UUID | - | NOT NULL | - | FK → exams.id, PK | Bộ đề |
| 2 | question_id | UUID | - | NOT NULL | - | FK → questions.id, PK | Câu hỏi |
| 3 | sort_order | INT | - | NOT NULL | 0 | ≥ 0 | Thứ tự câu hỏi |

## 22. Table: exam_attempts

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã lượt thi |
| 2 | exam_id | UUID | - | NOT NULL | - | FK → exams.id | Bộ đề |
| 3 | user_id | UUID | - | NOT NULL | - | FK → users.id | Người thi |
| 4 | score | INT | - | NULL | - | 0-100 | Điểm (%) |
| 5 | passed | BOOLEAN | - | NULL | - | score ≥ passing_score | Đạt/Không đạt |
| 6 | duration_seconds | INT | - | NULL | - | ≥ 0 | Thời gian làm (giây) |
| 7 | answers | JSONB | - | NULL | - | [{question_id, selected_options, is_correct}] | Chi tiết trả lời |
| 8 | started_at | TIMESTAMP | - | NOT NULL | - | Required | Thời gian bắt đầu |
| 9 | submitted_at | TIMESTAMP | - | NULL | - | Set on submit | Thời gian nộp |
| 10 | status | VARCHAR | 20 | NOT NULL | 'in_progress' | Enum: in_progress, submitted, timed_out | Trạng thái |

## 23. Table: flashcard_sets

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã bộ flashcard |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant |
| 3 | subject_id | UUID | - | NULL | - | FK → subjects.id | Môn học |
| 4 | certification_id | UUID | - | NULL | - | FK → certifications.id | Chứng chỉ |
| 5 | title | VARCHAR | 300 | NOT NULL | - | Required | Tên bộ flashcard |
| 6 | description | TEXT | - | NULL | - | - | Mô tả |
| 7 | card_count | INT | - | NOT NULL | 0 | 5-200 | Số thẻ |
| 8 | created_by | UUID | - | NULL | - | FK → users.id | Người tạo |
| 9 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |

## 24. Table: flashcards

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã thẻ |
| 2 | set_id | UUID | - | NOT NULL | - | FK → flashcard_sets.id | Bộ thẻ chứa |
| 3 | question_id | UUID | - | NULL | - | FK → questions.id | Câu hỏi nguồn |
| 4 | front_content | TEXT | - | NOT NULL | - | Required | Mặt trước (câu hỏi) |
| 5 | back_content | TEXT | - | NOT NULL | - | Required | Mặt sau (đáp án) |
| 6 | sort_order | INT | - | NOT NULL | 0 | ≥ 0 | Thứ tự |

## 25. Table: flashcard_progress

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã tiến độ |
| 2 | user_id | UUID | - | NOT NULL | - | FK → users.id | Người học |
| 3 | flashcard_id | UUID | - | NOT NULL | - | FK → flashcards.id | Thẻ học |
| 4 | status | VARCHAR | 20 | NOT NULL | 'new' | Enum: new, known, need_review | Trạng thái ôn tập |
| 5 | review_count | INT | - | NOT NULL | 0 | ≥ 0 | Số lần ôn |
| 6 | last_reviewed_at | TIMESTAMP | - | NULL | - | Auto-update | Lần ôn cuối |

**Unique constraint:** (user_id, flashcard_id)

## 26. Table: learning_progress

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã tiến độ |
| 2 | user_id | UUID | - | NOT NULL | - | FK → users.id | Người học |
| 3 | course_id | UUID | - | NOT NULL | - | FK → courses.id | Khóa học |
| 4 | chapter_id | UUID | - | NULL | - | FK → chapters.id | Chương hiện tại |
| 5 | lesson_id | UUID | - | NULL | - | FK → lessons.id | Bài hiện tại |
| 6 | progress_percentage | INT | - | NOT NULL | 0 | 0-100 | % hoàn thành |
| 7 | current_page | INT | - | NULL | - | ≥ 1 | Trang đang xem |
| 8 | scroll_position | INT | - | NULL | - | ≥ 0 (pixel offset) | Vị trí scroll |
| 9 | video_timestamp | INT | - | NULL | - | ≥ 0 (seconds) | Timestamp video |
| 10 | quiz_state | JSONB | - | NULL | - | {question_index, selected_answers} | Trạng thái quiz |
| 11 | time_spent_seconds | INT | - | NOT NULL | 0 | ≥ 0 | Tổng thời gian học (giây) |
| 12 | status | VARCHAR | 20 | NOT NULL | 'in_progress' | Enum: not_started, in_progress, completed | Trạng thái |
| 13 | last_accessed_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-update | Truy cập cuối |
| 14 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày bắt đầu |
| 15 | updated_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-update (≤30s interval) | Ngày cập nhật |

**Unique constraint:** (user_id, course_id)

## 27. Table: learning_sessions

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã phiên học |
| 2 | user_id | UUID | - | NOT NULL | - | FK → users.id | Người học |
| 3 | course_id | UUID | - | NOT NULL | - | FK → courses.id | Khóa học |
| 4 | lesson_id | UUID | - | NULL | - | FK → lessons.id | Bài học |
| 5 | started_at | TIMESTAMP | - | NOT NULL | - | Required | Bắt đầu phiên |
| 6 | ended_at | TIMESTAMP | - | NULL | - | > started_at | Kết thúc phiên |
| 7 | duration_seconds | INT | - | NULL | - | Calculated | Thời lượng phiên |
| 8 | activity_type | VARCHAR | 20 | NULL | - | Enum: lesson, quiz, exam, flashcard | Loại hoạt động |

## 28. Table: bookmarks

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã bookmark |
| 2 | user_id | UUID | - | NOT NULL | - | FK → users.id | Người tạo |
| 3 | entity_type | VARCHAR | 20 | NOT NULL | - | Enum: lesson, slide, chapter | Loại entity |
| 4 | entity_id | UUID | - | NOT NULL | - | - | ID entity |
| 5 | page_reference | INT | - | NULL | - | ≥ 1 | Trang bookmark |
| 6 | scroll_position | INT | - | NULL | - | ≥ 0 | Vị trí scroll |
| 7 | title | VARCHAR | 200 | NULL | - | Auto or user-set | Tiêu đề bookmark |
| 8 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |

## 29. Table: notes

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã ghi chú |
| 2 | user_id | UUID | - | NOT NULL | - | FK → users.id | Người tạo |
| 3 | entity_type | VARCHAR | 20 | NOT NULL | - | Enum: lesson, slide, chapter | Loại entity |
| 4 | entity_id | UUID | - | NOT NULL | - | - | ID entity |
| 5 | content | TEXT | 5000 | NOT NULL | - | Required, max 5000 chars, supports HTML (bold/italic/highlight) | Nội dung ghi chú |
| 6 | section_reference | VARCHAR | 200 | NULL | - | Section identifier | Vị trí trong nội dung |
| 7 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |
| 8 | updated_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-update | Ngày cập nhật |

## 30. Table: access_rules

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã rule |
| 2 | entity_type | VARCHAR | 20 | NOT NULL | - | Enum: course, chapter, lesson, quiz, exam | Loại nội dung |
| 3 | entity_id | UUID | - | NOT NULL | - | - | ID nội dung |
| 4 | unlock_type | VARCHAR | 20 | NOT NULL | - | Enum: points, prerequisite, premium, role | Cơ chế mở khóa |
| 5 | point_cost | INT | - | NOT NULL | 0 | ≥ 0 | Điểm cần (nếu type=points) |
| 6 | prerequisite_entity_type | VARCHAR | 20 | NULL | - | Enum values nếu type=prerequisite | Loại điều kiện tiên quyết |
| 7 | prerequisite_entity_id | UUID | - | NULL | - | - | ID điều kiện tiên quyết |
| 8 | required_role_id | UUID | - | NULL | - | FK → roles.id | Role cần (nếu type=role) |
| 9 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |

## 31. Table: user_unlocks

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã mở khóa |
| 2 | user_id | UUID | - | NOT NULL | - | FK → users.id | Người mở khóa |
| 3 | entity_type | VARCHAR | 20 | NOT NULL | - | Enum: course, chapter, lesson, quiz, exam | Loại nội dung |
| 4 | entity_id | UUID | - | NOT NULL | - | - | ID nội dung mở khóa |
| 5 | unlock_method | VARCHAR | 20 | NOT NULL | - | Enum: points, prerequisite, premium, admin | Phương thức mở khóa |
| 6 | points_spent | INT | - | NOT NULL | 0 | ≥ 0 | Điểm đã chi |
| 7 | unlocked_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày mở khóa |

**Unique constraint:** (user_id, entity_type, entity_id)

## 32. Table: user_points

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã record |
| 2 | user_id | UUID | - | NOT NULL | - | FK → users.id, Unique | Người dùng |
| 3 | total_points | INT | - | NOT NULL | 0 | ≥ 0 | Tổng điểm tích lũy |
| 4 | available_points | INT | - | NOT NULL | 0 | ≥ 0 (total - spent) | Điểm khả dụng |
| 5 | current_level | INT | - | NOT NULL | 1 | ≥ 1 | Level hiện tại |
| 6 | current_streak_days | INT | - | NOT NULL | 0 | ≥ 0 | Số ngày streak liên tiếp |
| 7 | longest_streak_days | INT | - | NOT NULL | 0 | ≥ current_streak | Streak dài nhất |
| 8 | last_activity_date | DATE | - | NULL | - | Calendar date | Ngày hoạt động cuối |
| 9 | updated_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-update | Ngày cập nhật |

## 33. Table: point_transactions

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã giao dịch |
| 2 | user_id | UUID | - | NOT NULL | - | FK → users.id | Người dùng |
| 3 | type | VARCHAR | 20 | NOT NULL | - | Enum: earn, spend | Loại: nhận/chi |
| 4 | amount | INT | - | NOT NULL | - | > 0 | Số điểm |
| 5 | reason | VARCHAR | 50 | NOT NULL | - | lesson_complete/quiz_pass/combo_30/unlock_course... | Lý do |
| 6 | reference_type | VARCHAR | 50 | NULL | - | Entity type liên quan | Loại tham chiếu |
| 7 | reference_id | UUID | - | NULL | - | - | ID tham chiếu |
| 8 | balance_after | INT | - | NOT NULL | - | ≥ 0 | Số dư sau giao dịch |
| 9 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày giao dịch |

## 34. Table: badges

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã huy hiệu |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant |
| 3 | name | VARCHAR | 100 | NOT NULL | - | Required | Tên huy hiệu |
| 4 | description | VARCHAR | 500 | NULL | - | - | Mô tả cách nhận |
| 5 | icon_url | VARCHAR | 500 | NULL | - | Valid URL | Icon huy hiệu |
| 6 | criteria_type | VARCHAR | 50 | NOT NULL | - | course_complete/streak_days/exam_perfect/... | Loại tiêu chí |
| 7 | criteria_value | INT | - | NOT NULL | - | > 0 | Giá trị tiêu chí (threshold) |
| 8 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |

## 35. Table: user_badges

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | user_id | UUID | - | NOT NULL | - | FK → users.id, PK | Người nhận |
| 2 | badge_id | UUID | - | NOT NULL | - | FK → badges.id, PK | Huy hiệu nhận |
| 3 | earned_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày nhận huy hiệu |

## 36. Table: levels

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã level |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant |
| 3 | level_number | INT | - | NOT NULL | - | ≥ 1, min 10 levels | Số thứ tự level |
| 4 | name | VARCHAR | 100 | NULL | - | - | Tên level |
| 5 | points_threshold | INT | - | NOT NULL | - | > previous level | Ngưỡng điểm đạt level |
| 6 | icon_url | VARCHAR | 500 | NULL | - | Valid URL | Icon level |

**Unique constraint:** (tenant_id, level_number)

## 37. Table: daily_missions

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã nhiệm vụ |
| 2 | user_id | UUID | - | NOT NULL | - | FK → users.id | Người nhận nhiệm vụ |
| 3 | mission_date | DATE | - | NOT NULL | - | Today | Ngày nhiệm vụ |
| 4 | mission_type | VARCHAR | 50 | NOT NULL | - | complete_lesson/quiz_correct/study_duration/review_flashcard | Loại nhiệm vụ |
| 5 | target_value | INT | - | NOT NULL | - | > 0 | Mục tiêu cần đạt |
| 6 | current_value | INT | - | NOT NULL | 0 | ≥ 0 | Tiến độ hiện tại |
| 7 | bonus_points | INT | - | NOT NULL | - | > 0 | Điểm thưởng khi hoàn thành |
| 8 | status | VARCHAR | 20 | NOT NULL | 'active' | Enum: active, completed, expired | Trạng thái |
| 9 | completed_at | TIMESTAMP | - | NULL | - | Set on complete | Ngày hoàn thành |
| 10 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto at 00:00 | Ngày tạo |

## 38. Table: learning_paths

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã lộ trình |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant |
| 3 | title | VARCHAR | 300 | NOT NULL | - | Required | Tên lộ trình |
| 4 | description | TEXT | - | NULL | - | - | Mô tả |
| 5 | thumbnail_url | VARCHAR | 500 | NULL | - | Valid URL | Ảnh thumbnail |
| 6 | total_steps | INT | - | NOT NULL | 0 | 2-50 | Tổng số bước |
| 7 | status | VARCHAR | 20 | NOT NULL | 'active' | Enum: active, inactive | Trạng thái |
| 8 | created_by | UUID | - | NULL | - | FK → users.id | Admin tạo |
| 9 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |

## 39. Table: learning_path_steps

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã bước |
| 2 | learning_path_id | UUID | - | NOT NULL | - | FK → learning_paths.id | Lộ trình |
| 3 | step_order | INT | - | NOT NULL | - | ≥ 1 | Thứ tự bước |
| 4 | entity_type | VARCHAR | 20 | NOT NULL | - | Enum: course, chapter, exam | Loại nội dung |
| 5 | entity_id | UUID | - | NOT NULL | - | - | ID nội dung |
| 6 | title | VARCHAR | 300 | NULL | - | Override title | Tiêu đề hiển thị |

**Unique constraint:** (learning_path_id, step_order)

## 40. Table: user_learning_paths

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã đăng ký |
| 2 | user_id | UUID | - | NOT NULL | - | FK → users.id | Người đăng ký |
| 3 | learning_path_id | UUID | - | NOT NULL | - | FK → learning_paths.id | Lộ trình |
| 4 | current_step | INT | - | NOT NULL | 1 | ≥ 1 | Bước hiện tại |
| 5 | progress_percentage | INT | - | NOT NULL | 0 | 0-100 | % hoàn thành |
| 6 | status | VARCHAR | 20 | NOT NULL | 'enrolled' | Enum: enrolled, in_progress, completed | Trạng thái |
| 7 | enrolled_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày đăng ký |
| 8 | completed_at | TIMESTAMP | - | NULL | - | Set on complete | Ngày hoàn thành |

**Unique constraint:** (user_id, learning_path_id)

## 41. Table: certificates

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã chứng nhận |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant |
| 3 | user_id | UUID | - | NOT NULL | - | FK → users.id | Người nhận |
| 4 | learning_path_id | UUID | - | NULL | - | FK → learning_paths.id | Lộ trình hoàn thành |
| 5 | certification_id | UUID | - | NULL | - | FK → certifications.id | Chứng chỉ |
| 6 | template_id | UUID | - | NULL | - | FK → certificate_templates.id | Template sử dụng |
| 7 | verification_code | VARCHAR | 50 | NOT NULL | - | Unique, auto-generated | Mã xác thực |
| 8 | issued_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày cấp |
| 9 | certificate_url | VARCHAR | 500 | NULL | - | PDF URL | URL file PDF |

## 42. Table: ai_tasks

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã task AI |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant |
| 3 | task_type | VARCHAR | 50 | NOT NULL | - | ocr/slide_gen/voice_gen/quiz_gen/chat/explain/recommend/material_search | Loại task |
| 4 | input_data | JSONB | - | NOT NULL | - | Valid JSON | Dữ liệu đầu vào |
| 5 | output_data | JSONB | - | NULL | - | - | Kết quả AI |
| 6 | status | VARCHAR | 20 | NOT NULL | 'queued' | Enum: queued, processing, completed, failed | Trạng thái |
| 7 | retry_count | INT | - | NOT NULL | 0 | 0-3 | Số lần retry |
| 8 | max_retries | INT | - | NOT NULL | 3 | ≥ 0 | Giới hạn retry |
| 9 | priority | INT | - | NOT NULL | 5 | 1-10 (1=highest) | Độ ưu tiên |
| 10 | requested_by | UUID | - | NULL | - | FK → users.id | Người yêu cầu |
| 11 | error_message | TEXT | - | NULL | - | - | Chi tiết lỗi |
| 12 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |
| 13 | started_at | TIMESTAMP | - | NULL | - | Set on processing | Bắt đầu xử lý |
| 14 | completed_at | TIMESTAMP | - | NULL | - | Set on complete/fail | Kết thúc xử lý |

## 43. Table: ai_chat_sessions

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã phiên chat |
| 2 | user_id | UUID | - | NOT NULL | - | FK → users.id | Người dùng |
| 3 | context_type | VARCHAR | 20 | NULL | - | Enum: lesson, general, material_search | Loại ngữ cảnh |
| 4 | context_entity_id | UUID | - | NULL | - | - | ID entity ngữ cảnh |
| 5 | started_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Bắt đầu phiên |
| 6 | last_message_at | TIMESTAMP | - | NULL | - | Auto-update | Tin nhắn cuối |

## 44. Table: ai_chat_messages

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã tin nhắn |
| 2 | session_id | UUID | - | NOT NULL | - | FK → ai_chat_sessions.id | Phiên chat |
| 3 | role | VARCHAR | 10 | NOT NULL | - | Enum: user, assistant | Vai trò: user/AI |
| 4 | content | TEXT | - | NOT NULL | - | Max 2000 chars (user), unlimited (assistant) | Nội dung tin nhắn |
| 5 | referenced_materials | JSONB | - | NULL | - | [{entity_type, entity_id, title, relevance_score}] | Tài liệu liên quan (Req 42) |
| 6 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày gửi |

## 45. Table: notifications

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã thông báo |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant |
| 3 | user_id | UUID | - | NOT NULL | - | FK → users.id | Người nhận |
| 4 | type | VARCHAR | 30 | NOT NULL | - | Enum: achievement, content, workflow, system | Loại thông báo |
| 5 | title | VARCHAR | 200 | NOT NULL | - | Required | Tiêu đề |
| 6 | body | TEXT | - | NULL | - | - | Nội dung chi tiết |
| 7 | data | JSONB | - | NULL | - | Action payload (link, entity) | Dữ liệu hành động |
| 8 | is_read | BOOLEAN | - | NOT NULL | FALSE | - | Đã đọc chưa |
| 9 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set | Ngày tạo |
| 10 | expires_at | TIMESTAMP | - | NULL | - | created_at + 90 days | Ngày hết hạn |

## 46. Table: audit_logs

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã log |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant |
| 3 | user_id | UUID | - | NULL | - | FK → users.id | Người thực hiện |
| 4 | username | VARCHAR | 50 | NULL | - | For failed login attempts | Username (nếu chưa auth) |
| 5 | action_type | VARCHAR | 20 | NOT NULL | - | Enum: create, update, delete, access, login, logout | Loại hành động |
| 6 | resource_type | VARCHAR | 50 | NOT NULL | - | Entity type | Loại tài nguyên |
| 7 | resource_id | UUID | - | NULL | - | - | ID tài nguyên |
| 8 | ip_address | INET | - | NULL | - | Valid IP | Địa chỉ IP |
| 9 | previous_value | JSONB | - | NULL | - | Before change | Giá trị trước thay đổi |
| 10 | new_value | JSONB | - | NULL | - | After change | Giá trị sau thay đổi |
| 11 | metadata | JSONB | - | NULL | - | Extra context | Metadata bổ sung |
| 12 | created_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-set, IMMUTABLE | Thời gian ghi log |

**Note:** Table is append-only. No UPDATE or DELETE allowed.

## 47. Table: system_config

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã config |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant |
| 3 | config_key | VARCHAR | 100 | NOT NULL | - | Required | Khóa cấu hình |
| 4 | config_value | JSONB | - | NOT NULL | - | Valid JSON | Giá trị cấu hình |
| 5 | description | VARCHAR | 500 | NULL | - | - | Mô tả |
| 6 | updated_by | UUID | - | NULL | - | FK → users.id | Admin cập nhật |
| 7 | updated_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-update | Ngày cập nhật |

**Unique constraint:** (tenant_id, config_key)

## 48. Table: ai_config

| # | Field | Type | Length | Nullable | Default | Validation | Business Meaning |
|---|-------|------|--------|----------|---------|------------|-----------------|
| 1 | id | UUID | - | NOT NULL | gen_random_uuid() | PK | Mã AI config |
| 2 | tenant_id | UUID | - | NOT NULL | - | FK → tenants.id | Tenant |
| 3 | model_name | VARCHAR | 100 | NULL | - | Valid model ID | Model AI sử dụng |
| 4 | temperature | NUMERIC | (3,2) | NOT NULL | 0.70 | 0.00-2.00 | Độ sáng tạo |
| 5 | max_response_length | INT | - | NOT NULL | 2000 | 100-10000 | Độ dài response tối đa |
| 6 | language | VARCHAR | 10 | NOT NULL | 'vi' | ISO 639-1 | Ngôn ngữ mặc định |
| 7 | features_enabled | JSONB | - | NOT NULL | All true | {chat, explain, quiz_gen, slide_gen, voice_gen, recommend, material_search} | Feature toggles |
| 8 | queue_limit | INT | - | NOT NULL | 100 | ≥ 1 | Giới hạn queue |
| 9 | updated_by | UUID | - | NULL | - | FK → users.id | Admin cập nhật |
| 10 | updated_at | TIMESTAMP | - | NOT NULL | NOW() | Auto-update | Ngày cập nhật |
