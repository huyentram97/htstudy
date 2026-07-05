-- H-T.Study eLearning Platform - Database Initialization
-- This script creates the initial schema for local development

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. TENANT & IDENTITY
-- =====================================================

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    config JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    avatar_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    keycloak_id VARCHAR(100),
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    UNIQUE(resource, action)
);

CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_groups (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, group_id)
);

CREATE TABLE group_permissions (
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, permission_id)
);

-- =====================================================
-- 2. LEARNING CONTENT
-- =====================================================

CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    subject_id UUID REFERENCES subjects(id),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    access_type VARCHAR(20) NOT NULL DEFAULT 'locked',
    point_cost INT NOT NULL DEFAULT 0,
    version INT NOT NULL DEFAULT 1,
    created_by UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    published_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    access_type VARCHAR(20) NOT NULL DEFAULT 'locked',
    point_cost INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    content_type VARCHAR(20) NOT NULL,
    content JSONB,
    duration_minutes INT NOT NULL DEFAULT 0,
    sort_order INT NOT NULL DEFAULT 0,
    access_type VARCHAR(20) NOT NULL DEFAULT 'locked',
    point_cost INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    slide_number INT NOT NULL,
    title VARCHAR(300),
    content JSONB NOT NULL,
    voice_url VARCHAR(500),
    voice_duration_seconds INT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE content_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    version_number INT NOT NULL,
    content JSONB NOT NULL,
    change_summary VARCHAR(500) NOT NULL,
    author_id UUID REFERENCES users(id),
    is_revert BOOLEAN NOT NULL DEFAULT FALSE,
    reverted_from INT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    file_type VARCHAR(20) NOT NULL,
    file_format VARCHAR(10) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    uploaded_by UUID REFERENCES users(id),
    usage_count INT NOT NULL DEFAULT 0,
    tags VARCHAR(50)[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE document_imports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    original_filename VARCHAR(300) NOT NULL,
    file_format VARCHAR(20) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    storage_url VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'processing',
    target_course_id UUID REFERENCES courses(id),
    processing_result JSONB,
    error_message TEXT,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- =====================================================
-- 3. QUESTION BANK & EXAMS
-- =====================================================

CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    subject_id UUID REFERENCES subjects(id),
    certification_id UUID REFERENCES certifications(id),
    question_type VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    options JSONB NOT NULL,
    explanation VARCHAR(2000),
    difficulty VARCHAR(10) NOT NULL,
    tags VARCHAR(50)[] NOT NULL DEFAULT '{}',
    is_ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    subject_id UUID REFERENCES subjects(id),
    certification_id UUID REFERENCES certifications(id),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    time_limit_minutes INT NOT NULL DEFAULT 60,
    passing_score INT NOT NULL DEFAULT 60,
    randomize_questions BOOLEAN NOT NULL DEFAULT FALSE,
    shuffle_answers BOOLEAN NOT NULL DEFAULT FALSE,
    question_count INT NOT NULL,
    access_type VARCHAR(20) NOT NULL DEFAULT 'locked',
    point_cost INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE exam_questions (
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id),
    sort_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (exam_id, question_id)
);

CREATE TABLE exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(id),
    user_id UUID NOT NULL REFERENCES users(id),
    score INT,
    passed BOOLEAN,
    duration_seconds INT,
    answers JSONB,
    started_at TIMESTAMP NOT NULL,
    submitted_at TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress'
);

CREATE TABLE flashcard_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    subject_id UUID REFERENCES subjects(id),
    certification_id UUID REFERENCES certifications(id),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    card_count INT NOT NULL DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    set_id UUID NOT NULL REFERENCES flashcard_sets(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id),
    front_content TEXT NOT NULL,
    back_content TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE flashcard_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    flashcard_id UUID NOT NULL REFERENCES flashcards(id),
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    review_count INT NOT NULL DEFAULT 0,
    last_reviewed_at TIMESTAMP,
    UNIQUE(user_id, flashcard_id)
);

-- =====================================================
-- 4. GAMIFICATION
-- =====================================================

CREATE TABLE user_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) UNIQUE,
    total_points INT NOT NULL DEFAULT 0,
    available_points INT NOT NULL DEFAULT 0,
    current_level INT NOT NULL DEFAULT 1,
    current_streak_days INT NOT NULL DEFAULT 0,
    longest_streak_days INT NOT NULL DEFAULT 0,
    last_activity_date DATE,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE point_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(20) NOT NULL,
    amount INT NOT NULL,
    reason VARCHAR(50) NOT NULL,
    reference_type VARCHAR(50),
    reference_id UUID,
    balance_after INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    icon_url VARCHAR(500),
    criteria_type VARCHAR(50) NOT NULL,
    criteria_value INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_badges (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id),
    earned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, badge_id)
);

CREATE TABLE levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    level_number INT NOT NULL,
    name VARCHAR(100),
    points_threshold INT NOT NULL,
    icon_url VARCHAR(500),
    UNIQUE(tenant_id, level_number)
);

CREATE TABLE daily_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    mission_date DATE NOT NULL,
    mission_type VARCHAR(50) NOT NULL,
    target_value INT NOT NULL,
    current_value INT NOT NULL DEFAULT 0,
    bonus_points INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 5. LEARNING PROGRESS & ACCESS
-- =====================================================

CREATE TABLE learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    course_id UUID NOT NULL REFERENCES courses(id),
    chapter_id UUID REFERENCES chapters(id),
    lesson_id UUID REFERENCES lessons(id),
    progress_percentage INT NOT NULL DEFAULT 0,
    current_page INT,
    scroll_position INT,
    video_timestamp INT,
    quiz_state JSONB,
    time_spent_seconds INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
    last_accessed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

CREATE TABLE learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    course_id UUID NOT NULL REFERENCES courses(id),
    lesson_id UUID REFERENCES lessons(id),
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP,
    duration_seconds INT,
    activity_type VARCHAR(20)
);

CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    entity_type VARCHAR(20) NOT NULL,
    entity_id UUID NOT NULL,
    page_reference INT,
    scroll_position INT,
    title VARCHAR(200),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    entity_type VARCHAR(20) NOT NULL,
    entity_id UUID NOT NULL,
    content TEXT NOT NULL,
    section_reference VARCHAR(200),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE access_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(20) NOT NULL,
    entity_id UUID NOT NULL,
    unlock_type VARCHAR(20) NOT NULL,
    point_cost INT NOT NULL DEFAULT 0,
    prerequisite_entity_type VARCHAR(20),
    prerequisite_entity_id UUID,
    required_role_id UUID REFERENCES roles(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_unlocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    entity_type VARCHAR(20) NOT NULL,
    entity_id UUID NOT NULL,
    unlock_method VARCHAR(20) NOT NULL,
    points_spent INT NOT NULL DEFAULT 0,
    unlocked_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, entity_type, entity_id)
);

-- =====================================================
-- 6. LEARNING PATH & CERTIFICATES
-- =====================================================

CREATE TABLE learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    total_steps INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE learning_path_certifications (
    learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    certification_id UUID NOT NULL REFERENCES certifications(id),
    PRIMARY KEY (learning_path_id, certification_id)
);

CREATE TABLE learning_path_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    step_order INT NOT NULL,
    entity_type VARCHAR(20) NOT NULL,
    entity_id UUID NOT NULL,
    title VARCHAR(300),
    UNIQUE(learning_path_id, step_order)
);

CREATE TABLE user_learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    learning_path_id UUID NOT NULL REFERENCES learning_paths(id),
    current_step INT NOT NULL DEFAULT 1,
    progress_percentage INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'enrolled',
    enrolled_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    UNIQUE(user_id, learning_path_id)
);

CREATE TABLE certificate_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(200) NOT NULL,
    template_config JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    user_id UUID NOT NULL REFERENCES users(id),
    learning_path_id UUID REFERENCES learning_paths(id),
    certification_id UUID REFERENCES certifications(id),
    template_id UUID REFERENCES certificate_templates(id),
    verification_code VARCHAR(50) UNIQUE NOT NULL,
    issued_at TIMESTAMP NOT NULL DEFAULT NOW(),
    certificate_url VARCHAR(500)
);

-- =====================================================
-- 7. AI & NOTIFICATIONS
-- =====================================================

CREATE TABLE ai_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    task_type VARCHAR(50) NOT NULL,
    input_data JSONB NOT NULL,
    output_data JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'queued',
    retry_count INT NOT NULL DEFAULT 0,
    max_retries INT NOT NULL DEFAULT 3,
    priority INT NOT NULL DEFAULT 5,
    requested_by UUID REFERENCES users(id),
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    context_type VARCHAR(20),
    context_entity_id UUID,
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_message_at TIMESTAMP
);

CREATE TABLE ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(10) NOT NULL,
    content TEXT NOT NULL,
    referenced_materials JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(30) NOT NULL,
    title VARCHAR(200) NOT NULL,
    body TEXT,
    data JSONB,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP
);

-- =====================================================
-- 8. ADMINISTRATION & AUDIT
-- =====================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    user_id UUID,
    username VARCHAR(50),
    action_type VARCHAR(20) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    ip_address INET,
    previous_value JSONB,
    new_value JSONB,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE workflow_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    action_by UUID REFERENCES users(id),
    reason TEXT,
    is_override BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    config_key VARCHAR(100) NOT NULL,
    config_value JSONB NOT NULL,
    description VARCHAR(500),
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, config_key)
);

CREATE TABLE ai_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    model_name VARCHAR(100),
    temperature NUMERIC(3,2) NOT NULL DEFAULT 0.70,
    max_response_length INT NOT NULL DEFAULT 2000,
    language VARCHAR(10) NOT NULL DEFAULT 'vi',
    features_enabled JSONB NOT NULL DEFAULT '{"chat":true,"explain":true,"quiz_gen":true,"slide_gen":true,"voice_gen":true,"recommend":true,"material_search":true}',
    queue_limit INT NOT NULL DEFAULT 100,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_courses_tenant ON courses(tenant_id);
CREATE INDEX idx_courses_subject ON courses(subject_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_chapters_course ON chapters(course_id);
CREATE INDEX idx_lessons_chapter ON lessons(chapter_id);
CREATE INDEX idx_questions_subject ON questions(subject_id);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_exam_attempts_user ON exam_attempts(user_id);
CREATE INDEX idx_exam_attempts_exam ON exam_attempts(exam_id);
CREATE INDEX idx_learning_progress_user ON learning_progress(user_id);
CREATE INDEX idx_point_transactions_user ON point_transactions(user_id);
CREATE INDEX idx_point_transactions_date ON point_transactions(created_at);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_daily_missions_user_date ON daily_missions(user_id, mission_date);

-- =====================================================
-- SEED DATA: Default tenant + roles + permissions
-- =====================================================

INSERT INTO tenants (id, name, slug, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'H-T.Study Default', 'default', 'active');

INSERT INTO roles (id, tenant_id, name, description, is_system) VALUES
('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Admin', 'Toàn quyền quản trị hệ thống', TRUE),
('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Maker', 'Tạo và chỉnh sửa nội dung', TRUE),
('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'Checker', 'Duyệt và publish nội dung', TRUE),
('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001', 'Customer', 'Học, luyện đề, mở khóa', TRUE);

-- Default admin user
INSERT INTO users (id, tenant_id, username, email, full_name, status)
VALUES ('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000001', 'admin', 'admin@htstudy.vn', 'System Admin', 'active');

INSERT INTO user_roles (user_id, role_id)
VALUES ('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000010');

-- Default system config
INSERT INTO system_config (tenant_id, config_key, config_value, description) VALUES
('00000000-0000-0000-0000-000000000001', 'support_email', '"support@htstudy.vn"', 'Email hỗ trợ hiển thị trên platform'),
('00000000-0000-0000-0000-000000000001', 'platform_name', '"H-T.Study"', 'Tên platform'),
('00000000-0000-0000-0000-000000000001', 'session_timeout_minutes', '60', 'Thời gian hết hạn session'),
('00000000-0000-0000-0000-000000000001', 'max_upload_size_mb', '100', 'Giới hạn upload file (MB)'),
('00000000-0000-0000-0000-000000000001', 'maintenance_mode', 'false', 'Chế độ bảo trì');

-- Default AI config
INSERT INTO ai_config (tenant_id, model_name, temperature, max_response_length, language)
VALUES ('00000000-0000-0000-0000-000000000001', 'gpt-4o', 0.70, 2000, 'vi');

-- Default levels (10 levels)
INSERT INTO levels (tenant_id, level_number, name, points_threshold) VALUES
('00000000-0000-0000-0000-000000000001', 1, 'Beginner', 0),
('00000000-0000-0000-0000-000000000001', 2, 'Learner', 100),
('00000000-0000-0000-0000-000000000001', 3, 'Student', 300),
('00000000-0000-0000-0000-000000000001', 4, 'Scholar', 600),
('00000000-0000-0000-0000-000000000001', 5, 'Expert', 1000),
('00000000-0000-0000-0000-000000000001', 6, 'Master', 1500),
('00000000-0000-0000-0000-000000000001', 7, 'Guru', 2200),
('00000000-0000-0000-0000-000000000001', 8, 'Sage', 3000),
('00000000-0000-0000-0000-000000000001', 9, 'Legend', 4000),
('00000000-0000-0000-0000-000000000001', 10, 'Grandmaster', 5500);

-- Initialize user_points for admin
INSERT INTO user_points (user_id, total_points, available_points, current_level)
VALUES ('00000000-0000-0000-0000-000000000100', 0, 0, 1);
