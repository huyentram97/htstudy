# Technical Design Document - H-T.Study eLearning Platform v1.0

## Overview

Tài liệu thiết kế kỹ thuật cho nền tảng H-T.Study eLearning, bao gồm kiến trúc hệ thống, database design, API design, và component interactions. Thiết kế dựa trên 42 requirements đã được xác định trong requirements.md.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Web App │  │Mobile Web│  │  Admin   │  │  API Client  │   │
│  │ (React)  │  │(Responsive)│ │  Panel   │  │  (External)  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   API Gateway     │
                    │  (Rate Limiting,  │
                    │   Auth, Routing)  │
                    └─────────┬─────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                                │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐  │
│  │  Auth      │ │  Learning  │ │   Exam     │ │Gamification│  │
│  │  Service   │ │  Service   │ │  Service   │ │  Service   │  │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘  │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐  │
│  │    AI      │ │Notification│ │  Report    │ │   Admin    │  │
│  │  Service   │ │  Service   │ │  Service   │ │  Service   │  │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │PostgreSQL│  │  Redis   │  │   S3     │  │Elasticsearch │   │
│  │(Primary) │  │ (Cache)  │  │(Storage) │  │  (Search)    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
│  ┌──────────┐  ┌──────────────────────────────────────────┐    │
│  │  Queue   │  │          AI Provider (LLM API)           │    │
│  │(RabbitMQ)│  │                                          │    │
│  └──────────┘  └──────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| Frontend | React + TypeScript | SPA responsive, component reuse, strong typing |
| UI Framework | Ant Design / Material UI | Enterprise-grade components, responsive |
| State Management | Redux Toolkit / Zustand | Predictable state for complex learning flows |
| Backend | Node.js (NestJS) | TypeScript full-stack, modular architecture |
| Database | PostgreSQL 15+ | JSONB support, full-text search, multi-tenant |
| Cache | Redis | Session, leaderboard, real-time progress |
| Search | Elasticsearch | Full-text Vietnamese search, diacritics |
| Object Storage | MinIO / AWS S3 | Document, media, backup storage |
| Message Queue | RabbitMQ | AI task queue, async processing |
| Auth | Keycloak | SSO/OIDC, role management, group support |
| AI Provider | OpenAI / Azure OpenAI | LLM, TTS, OCR capabilities |
| Container | Docker + Kubernetes | Horizontal scaling, deployment |
| CI/CD | GitHub Actions / GitLab CI | Automated build, test, deploy |

### Service Decomposition

```
┌──────────────────────────────────────────────────────────────┐
│                    MICROSERVICES MAP                           │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  auth-service          → SSO/OIDC, JWT, RBAC                │
│  user-service          → User, Role, Group, Permission       │
│  learning-service      → Course, Chapter, Lesson, Content    │
│  content-service       → Import, OCR, Versioning, Media      │
│  exam-service          → Question Bank, Exam, Flashcard      │
│  ai-service            → Chat, Explain, Generate, Recommend  │
│  gamification-service  → Points, Streak, Badge, Level, Board │
│  notification-service  → Push, Email, In-app notifications   │
│  report-service        → Analytics, Dashboard, Export        │
│  admin-service         → Config, Audit, Workflow             │
│  search-service        → Elasticsearch indexing & query      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Database Design (ERD)

### Core Entity Groups

#### 1. User & Identity

```sql
-- Tenant (Multi-tenant foundation)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    config JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    avatar_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active', -- active/inactive/locked
    keycloak_id VARCHAR(100),
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(50) NOT NULL, -- Admin, Maker, Checker, Customer
    description VARCHAR(500),
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Permissions
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL, -- create, read, update, delete
    description VARCHAR(500),
    UNIQUE(resource, action)
);

-- Role-Permission mapping
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id),
    permission_id UUID REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);

-- User-Role mapping
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id),
    role_id UUID REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);

-- Groups
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- User-Group mapping
CREATE TABLE user_groups (
    user_id UUID REFERENCES users(id),
    group_id UUID REFERENCES groups(id),
    PRIMARY KEY (user_id, group_id)
);

-- Group-Permission mapping
CREATE TABLE group_permissions (
    group_id UUID REFERENCES groups(id),
    permission_id UUID REFERENCES permissions(id),
    PRIMARY KEY (group_id, permission_id)
);
```

#### 2. Learning Content

```sql
-- Subjects (Môn học)
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Courses (Khóa học)
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    subject_id UUID REFERENCES subjects(id),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'draft', -- draft/pending_review/published/rejected
    access_type VARCHAR(20) DEFAULT 'locked', -- free/locked/premium
    point_cost INT DEFAULT 0,
    version INT DEFAULT 1,
    created_by UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Chapters (Chương)
CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    access_type VARCHAR(20) DEFAULT 'locked',
    point_cost INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Lessons (Bài học)
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES chapters(id),
    title VARCHAR(300) NOT NULL,
    content_type VARCHAR(20) NOT NULL, -- text/slide/video/mixed
    content JSONB, -- structured content
    duration_minutes INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    access_type VARCHAR(20) DEFAULT 'locked',
    point_cost INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Content Versions
CREATE TABLE content_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL, -- course/chapter/lesson
    entity_id UUID NOT NULL,
    version_number INT NOT NULL,
    content JSONB NOT NULL,
    change_summary VARCHAR(500) NOT NULL,
    author_id UUID REFERENCES users(id),
    is_revert BOOLEAN DEFAULT FALSE,
    reverted_from INT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Slides
CREATE TABLE slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id),
    slide_number INT NOT NULL,
    title VARCHAR(300),
    content JSONB NOT NULL, -- key points, text, images
    voice_url VARCHAR(500),
    voice_duration_seconds INT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Media Library
CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000),
    file_type VARCHAR(20) NOT NULL, -- image/video/audio
    file_format VARCHAR(10) NOT NULL, -- jpg/png/mp4/mp3...
    file_url VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    uploaded_by UUID REFERENCES users(id),
    usage_count INT DEFAULT 0,
    tags VARCHAR(50)[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Document Imports
CREATE TABLE document_imports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    original_filename VARCHAR(300) NOT NULL,
    file_format VARCHAR(20) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    storage_url VARCHAR(500) NOT NULL,
    status VARCHAR(20) DEFAULT 'processing', -- processing/completed/failed
    target_course_id UUID REFERENCES courses(id),
    processing_result JSONB,
    error_message TEXT,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);
```

#### 3. Question Bank & Exam

```sql
-- Certifications (Chứng chỉ)
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Questions
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    subject_id UUID REFERENCES subjects(id),
    certification_id UUID REFERENCES certifications(id),
    question_type VARCHAR(20) NOT NULL, -- single_choice/multiple_choice
    content TEXT NOT NULL,
    options JSONB NOT NULL, -- [{id, text, is_correct}]
    explanation VARCHAR(2000),
    difficulty VARCHAR(10) NOT NULL, -- easy/medium/hard
    tags VARCHAR(50)[] DEFAULT '{}',
    is_ai_generated BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'draft', -- draft/approved/rejected
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Exams (Bộ đề)
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    subject_id UUID REFERENCES subjects(id),
    certification_id UUID REFERENCES certifications(id),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    time_limit_minutes INT NOT NULL DEFAULT 60,
    passing_score INT NOT NULL DEFAULT 60, -- percentage
    randomize_questions BOOLEAN DEFAULT FALSE,
    shuffle_answers BOOLEAN DEFAULT FALSE,
    question_count INT NOT NULL,
    access_type VARCHAR(20) DEFAULT 'locked',
    point_cost INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Exam-Question mapping
CREATE TABLE exam_questions (
    exam_id UUID REFERENCES exams(id),
    question_id UUID REFERENCES questions(id),
    sort_order INT DEFAULT 0,
    PRIMARY KEY (exam_id, question_id)
);

-- Exam Attempts
CREATE TABLE exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(id),
    user_id UUID NOT NULL REFERENCES users(id),
    score INT, -- percentage
    passed BOOLEAN,
    duration_seconds INT,
    answers JSONB, -- [{question_id, selected_options, is_correct}]
    started_at TIMESTAMP NOT NULL,
    submitted_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'in_progress' -- in_progress/submitted/timed_out
);

-- Flashcard Sets
CREATE TABLE flashcard_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    subject_id UUID REFERENCES subjects(id),
    certification_id UUID REFERENCES certifications(id),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    card_count INT DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Flashcards
CREATE TABLE flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    set_id UUID NOT NULL REFERENCES flashcard_sets(id),
    question_id UUID REFERENCES questions(id),
    front_content TEXT NOT NULL,
    back_content TEXT NOT NULL,
    sort_order INT DEFAULT 0
);

-- Flashcard Progress
CREATE TABLE flashcard_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    flashcard_id UUID NOT NULL REFERENCES flashcards(id),
    status VARCHAR(20) DEFAULT 'new', -- new/known/need_review
    review_count INT DEFAULT 0,
    last_reviewed_at TIMESTAMP,
    UNIQUE(user_id, flashcard_id)
);
```

#### 4. Learning Progress & Access

```sql
-- Learning Progress
CREATE TABLE learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    course_id UUID NOT NULL REFERENCES courses(id),
    chapter_id UUID REFERENCES chapters(id),
    lesson_id UUID REFERENCES lessons(id),
    progress_percentage INT DEFAULT 0, -- 0-100
    current_page INT,
    scroll_position INT, -- pixel offset
    video_timestamp INT, -- seconds
    quiz_state JSONB, -- {question_index, selected_answers}
    time_spent_seconds INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'in_progress', -- not_started/in_progress/completed
    last_accessed_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Learning Sessions (for time tracking)
CREATE TABLE learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    course_id UUID NOT NULL REFERENCES courses(id),
    lesson_id UUID REFERENCES lessons(id),
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP,
    duration_seconds INT,
    activity_type VARCHAR(20) -- lesson/quiz/exam/flashcard
);

-- Bookmarks
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    entity_type VARCHAR(20) NOT NULL, -- lesson/slide/chapter
    entity_id UUID NOT NULL,
    page_reference INT,
    scroll_position INT,
    title VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notes
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    entity_type VARCHAR(20) NOT NULL,
    entity_id UUID NOT NULL,
    content TEXT NOT NULL, -- max 5000 chars, supports formatting
    section_reference VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Content Access Rules
CREATE TABLE access_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(20) NOT NULL, -- course/chapter/lesson/quiz/exam
    entity_id UUID NOT NULL,
    unlock_type VARCHAR(20) NOT NULL, -- points/prerequisite/premium/role
    point_cost INT DEFAULT 0,
    prerequisite_entity_type VARCHAR(20),
    prerequisite_entity_id UUID,
    required_role_id UUID REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Content Unlocks
CREATE TABLE user_unlocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    entity_type VARCHAR(20) NOT NULL,
    entity_id UUID NOT NULL,
    unlock_method VARCHAR(20) NOT NULL, -- points/prerequisite/premium/admin
    points_spent INT DEFAULT 0,
    unlocked_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, entity_type, entity_id)
);
```

#### 5. Gamification

```sql
-- User Points
CREATE TABLE user_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    total_points INT DEFAULT 0,
    available_points INT DEFAULT 0, -- total - spent
    current_level INT DEFAULT 1,
    current_streak_days INT DEFAULT 0,
    longest_streak_days INT DEFAULT 0,
    last_activity_date DATE,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Point Transactions
CREATE TABLE point_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(20) NOT NULL, -- earn/spend
    amount INT NOT NULL,
    reason VARCHAR(50) NOT NULL, -- lesson_complete/quiz_pass/combo_30/unlock_course...
    reference_type VARCHAR(50),
    reference_id UUID,
    balance_after INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Badges
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    icon_url VARCHAR(500),
    criteria_type VARCHAR(50) NOT NULL, -- course_complete/streak_days/exam_perfect/...
    criteria_value INT NOT NULL, -- threshold value
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Badges
CREATE TABLE user_badges (
    user_id UUID REFERENCES users(id),
    badge_id UUID REFERENCES badges(id),
    earned_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, badge_id)
);

-- Levels
CREATE TABLE levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    level_number INT NOT NULL,
    name VARCHAR(100),
    points_threshold INT NOT NULL,
    icon_url VARCHAR(500),
    UNIQUE(tenant_id, level_number)
);

-- Daily Missions
CREATE TABLE daily_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    mission_date DATE NOT NULL,
    mission_type VARCHAR(50) NOT NULL, -- complete_lesson/quiz_correct/study_duration/review_flashcard
    target_value INT NOT NULL,
    current_value INT DEFAULT 0,
    bonus_points INT NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active/completed/expired
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Combo Tracker (in Redis, persisted periodically)
-- Key: combo:{user_id} → {start_time, elapsed_minutes, last_combo_awarded}
```

#### 6. Learning Path & Certificate

```sql
-- Learning Paths
CREATE TABLE learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    total_steps INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Learning Path - Certification mapping
CREATE TABLE learning_path_certifications (
    learning_path_id UUID REFERENCES learning_paths(id),
    certification_id UUID REFERENCES certifications(id),
    PRIMARY KEY (learning_path_id, certification_id)
);

-- Learning Path Steps
CREATE TABLE learning_path_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_path_id UUID NOT NULL REFERENCES learning_paths(id),
    step_order INT NOT NULL,
    entity_type VARCHAR(20) NOT NULL, -- course/chapter/exam
    entity_id UUID NOT NULL,
    title VARCHAR(300),
    UNIQUE(learning_path_id, step_order)
);

-- User Learning Path Enrollment
CREATE TABLE user_learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    learning_path_id UUID NOT NULL REFERENCES learning_paths(id),
    current_step INT DEFAULT 1,
    progress_percentage INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'enrolled', -- enrolled/in_progress/completed
    enrolled_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    UNIQUE(user_id, learning_path_id)
);

-- Certificates
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    user_id UUID NOT NULL REFERENCES users(id),
    learning_path_id UUID REFERENCES learning_paths(id),
    certification_id UUID REFERENCES certifications(id),
    template_id UUID,
    verification_code VARCHAR(50) UNIQUE NOT NULL,
    issued_at TIMESTAMP DEFAULT NOW(),
    certificate_url VARCHAR(500)
);

-- Certificate Templates
CREATE TABLE certificate_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(200) NOT NULL,
    template_config JSONB NOT NULL, -- layout, fields, logo, styling
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 7. AI & Notifications

```sql
-- AI Tasks Queue (persistent tracking)
CREATE TABLE ai_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    task_type VARCHAR(50) NOT NULL, -- ocr/slide_gen/voice_gen/quiz_gen/chat/explain/recommend
    input_data JSONB NOT NULL,
    output_data JSONB,
    status VARCHAR(20) DEFAULT 'queued', -- queued/processing/completed/failed
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    priority INT DEFAULT 5, -- 1=highest, 10=lowest
    requested_by UUID REFERENCES users(id),
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- AI Chat Sessions
CREATE TABLE ai_chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    context_type VARCHAR(20), -- lesson/general/material_search
    context_entity_id UUID,
    started_at TIMESTAMP DEFAULT NOW(),
    last_message_at TIMESTAMP
);

-- AI Chat Messages
CREATE TABLE ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES ai_chat_sessions(id),
    role VARCHAR(10) NOT NULL, -- user/assistant
    content TEXT NOT NULL,
    referenced_materials JSONB, -- [{entity_type, entity_id, title, relevance_score}]
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(30) NOT NULL, -- achievement/content/workflow/system
    title VARCHAR(200) NOT NULL,
    body TEXT,
    data JSONB, -- action payload (link, entity_id, etc.)
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);
```

#### 8. Administration & Audit

```sql
-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    user_id UUID,
    username VARCHAR(50),
    action_type VARCHAR(20) NOT NULL, -- create/update/delete/access/login/logout
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    ip_address INET,
    previous_value JSONB,
    new_value JSONB,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Index for fast filtering
CREATE INDEX idx_audit_logs_date ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- Workflow Status History
CREATE TABLE workflow_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    action_by UUID REFERENCES users(id),
    reason TEXT,
    is_override BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- System Configuration
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    config_key VARCHAR(100) NOT NULL,
    config_value JSONB NOT NULL,
    description VARCHAR(500),
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, config_key)
);

-- AI Configuration
CREATE TABLE ai_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    model_name VARCHAR(100),
    temperature NUMERIC(3,2) DEFAULT 0.7,
    max_response_length INT DEFAULT 2000,
    language VARCHAR(10) DEFAULT 'vi',
    features_enabled JSONB DEFAULT '{"chat":true,"explain":true,"quiz_gen":true,"slide_gen":true,"voice_gen":true,"recommend":true,"material_search":true}',
    queue_limit INT DEFAULT 100,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Design

### API Structure Overview

Tất cả API tuân thủ RESTful conventions, sử dụng JWT authentication, và trả về consistent response format:

```json
// Success Response
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "pageSize": 20, "total": 100 }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "timestamp": "2026-07-05T10:00:00Z"
  }
}
```

### API Modules Summary

| Module | Base Path | Estimated Endpoints |
|--------|-----------|-------------------|
| Auth | /api/v1/auth | 8 |
| Users | /api/v1/users | 12 |
| Roles & Permissions | /api/v1/roles, /api/v1/permissions | 10 |
| Groups | /api/v1/groups | 8 |
| Subjects | /api/v1/subjects | 6 |
| Courses | /api/v1/courses | 15 |
| Chapters | /api/v1/courses/:id/chapters | 8 |
| Lessons | /api/v1/lessons | 10 |
| Content Import | /api/v1/imports | 6 |
| Media | /api/v1/media | 8 |
| Questions | /api/v1/questions | 12 |
| Exams | /api/v1/exams | 14 |
| Flashcards | /api/v1/flashcards | 10 |
| Gamification | /api/v1/gamification | 15 |
| Learning Paths | /api/v1/learning-paths | 10 |
| AI | /api/v1/ai | 12 |
| Notifications | /api/v1/notifications | 6 |
| Reports | /api/v1/reports | 10 |
| Audit | /api/v1/audit-logs | 4 |
| Config | /api/v1/config | 6 |
| Dashboard | /api/v1/dashboard | 4 |
| Certificates | /api/v1/certificates | 6 |
| Search | /api/v1/search | 4 |
| Workflow | /api/v1/workflow | 8 |
| **Total** | | **~200 endpoints** |

### Key API Endpoints (Detail)

#### Authentication
```
POST   /api/v1/auth/login              → SSO/OIDC login redirect
POST   /api/v1/auth/callback           → OIDC callback, issue JWT
POST   /api/v1/auth/refresh            → Refresh JWT token
POST   /api/v1/auth/logout             → Invalidate session
POST   /api/v1/auth/logout-all         → Admin: invalidate all user sessions
GET    /api/v1/auth/me                 → Get current user profile
```

#### Learning Content
```
GET    /api/v1/courses                 → List courses (filter, paginate)
POST   /api/v1/courses                 → Create course (Maker)
GET    /api/v1/courses/:id             → Get course detail
PUT    /api/v1/courses/:id             → Update course (Maker)
DELETE /api/v1/courses/:id             → Delete course (Admin)
POST   /api/v1/courses/:id/submit      → Submit for review (Maker)
POST   /api/v1/courses/:id/approve     → Approve course (Checker)
POST   /api/v1/courses/:id/reject      → Reject course (Checker)
GET    /api/v1/courses/:id/versions    → Get version history
POST   /api/v1/courses/:id/revert/:v   → Revert to version (Maker)
GET    /api/v1/courses/:id/chapters    → List chapters
POST   /api/v1/courses/:id/chapters    → Create chapter
GET    /api/v1/lessons/:id             → Get lesson content
GET    /api/v1/lessons/:id/slides      → Get slides for lesson
```

#### Content Import & AI
```
POST   /api/v1/imports                 → Upload document for import
GET    /api/v1/imports/:id/status      → Check import progress
POST   /api/v1/ai/generate-slides     → Generate slides from content
POST   /api/v1/ai/generate-voice      → Generate voice for slides
POST   /api/v1/ai/generate-quiz       → Generate quiz from content
POST   /api/v1/ai/chat                → AI chat message
POST   /api/v1/ai/explain             → AI explain selected text
GET    /api/v1/ai/recommendations     → Get AI course recommendations
POST   /api/v1/ai/search-materials    → AI search related materials (Req 42)
GET    /api/v1/ai/tasks/:id           → Check AI task status
```

#### Exam & Question Bank
```
GET    /api/v1/questions               → List questions (filter)
POST   /api/v1/questions               → Create question (Maker)
POST   /api/v1/questions/import        → Bulk import from file
GET    /api/v1/exams                   → List exams
POST   /api/v1/exams                   → Create exam (Maker)
POST   /api/v1/exams/generate          → AI generate exam
POST   /api/v1/exams/:id/start         → Start exam attempt
POST   /api/v1/exams/:id/submit        → Submit exam answers
GET    /api/v1/exams/:id/results       → Get exam results with explanations
GET    /api/v1/flashcards/sets         → List flashcard sets
POST   /api/v1/flashcards/sets         → Create flashcard set
GET    /api/v1/flashcards/sets/:id/study → Get cards for study session
POST   /api/v1/flashcards/:id/progress → Update card progress (known/review)
```

#### Gamification
```
GET    /api/v1/gamification/points     → Get user points & level
GET    /api/v1/gamification/streak     → Get streak info
GET    /api/v1/gamification/transactions → Point transaction history
POST   /api/v1/gamification/unlock     → Unlock content with points
GET    /api/v1/gamification/leaderboard → Get leaderboard (daily/weekly/monthly)
GET    /api/v1/gamification/badges     → Get user badges
GET    /api/v1/gamification/missions   → Get daily missions
POST   /api/v1/gamification/missions/:id/progress → Update mission progress
GET    /api/v1/gamification/levels     → Get level definitions
```

#### Learning Progress
```
GET    /api/v1/progress/:courseId      → Get progress for course
PUT    /api/v1/progress/:courseId      → Update progress (auto-save)
GET    /api/v1/progress/resume         → Get "Continue Learning" data
GET    /api/v1/progress/history        → Get learning history
GET    /api/v1/bookmarks               → List bookmarks
POST   /api/v1/bookmarks               → Create bookmark
GET    /api/v1/notes                   → List notes
POST   /api/v1/notes                   → Create note
PUT    /api/v1/notes/:id               → Update note
DELETE /api/v1/notes/:id               → Delete note
```

#### Learning Path
```
GET    /api/v1/learning-paths          → List learning paths
GET    /api/v1/learning-paths/:id      → Get path detail with steps
POST   /api/v1/learning-paths/:id/enroll → Enroll in path
GET    /api/v1/learning-paths/:id/progress → Get path progress
```

#### Admin & Config
```
GET    /api/v1/config/system           → Get system config
PUT    /api/v1/config/system           → Update system config
GET    /api/v1/config/ai               → Get AI config
PUT    /api/v1/config/ai               → Update AI config
GET    /api/v1/audit-logs              → List audit logs (filter)
POST   /api/v1/audit-logs/export       → Export audit logs
GET    /api/v1/dashboard/admin         → Admin dashboard KPIs
GET    /api/v1/dashboard/user          → User dashboard data
GET    /api/v1/reports/:type           → Generate report
POST   /api/v1/reports/export          → Export report
```

## Component Interactions

### Flow 1: Document Import → AI Processing Pipeline

```
Maker uploads file
       │
       ▼
┌─────────────────┐     ┌──────────────┐     ┌──────────────┐
│ Content Service │────▶│ Object Store │     │  AI Queue    │
│ (validate file) │     │  (save orig) │     │ (RabbitMQ)   │
└────────┬────────┘     └──────────────┘     └──────┬───────┘
         │                                          │
         │  Publish task                            │ Consume
         └──────────────────────────────────────────┘
                                                    │
                                              ┌─────▼──────┐
                                              │ AI Service │
                                              │  1. OCR    │
                                              │  2. Parse  │
                                              │  3. Slides │
                                              │  4. Voice  │
                                              │  5. Quiz   │
                                              └─────┬──────┘
                                                    │
                                              ┌─────▼──────┐
                                              │  Database  │
                                              │ (save all) │
                                              └─────┬──────┘
                                                    │
                                              ┌─────▼──────┐
                                              │Notification│
                                              │  → Maker   │
                                              └────────────┘
```

### Flow 2: AI Chat with Material Search (Requirement 42)

```
Customer asks question
       │
       ▼
┌─────────────────┐
│   AI Service    │
│ (analyze query) │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌───────────────┐
│  LLM   │ │ Search Service│
│(answer)│ │(Elasticsearch)│
└───┬────┘ └───────┬───────┘
    │              │
    │   ┌──────────┘
    ▼   ▼
┌─────────────────────┐
│  Combine Response   │
│  - AI Answer        │
│  - Material refs    │
│  - Access status    │
└─────────────────────┘
         │
         ▼
    Customer sees answer
    + related materials
    + lock/unlock status
```

### Flow 3: Gamification - Points & Combo

```
Customer completes activity
       │
       ▼
┌──────────────────────┐
│ Gamification Service │
│  1. Award points     │
│  2. Check streak     │
│  3. Check combo      │
│  4. Check badges     │
│  5. Check missions   │
│  6. Check level up   │
└──────────┬───────────┘
           │
     ┌─────┼─────┐
     ▼     ▼     ▼
┌──────┐┌──────┐┌────────────┐
│Redis ││ DB   ││Notification│
│combo ││points││  Service   │
│timer ││txn   ││(if badge/  │
└──────┘└──────┘│ level up)  │
                └────────────┘
```

### Flow 4: Maker-Checker Workflow

```
Maker creates content → status: "draft"
       │
       ▼ (submit for review)
Status → "pending_review"
       │
       ├── Notify Checker(s)
       │
       ▼
Checker reviews
       │
   ┌───┴───┐
   ▼       ▼
Approve   Reject
   │       │
   ▼       ▼
"published"  "rejected"
   │       │
   │       └── Notify Maker (with reason)
   │
   └── Content visible to Customers
```

### Flow 5: Resume Learning

```
Customer opens course
       │
       ▼
┌──────────────────┐
│ Progress Service │
│ Check saved state│
└────────┬─────────┘
         │
    ┌────┴────┐
    ▼         ▼
Has progress  No progress
    │              │
    ▼              ▼
Show "Tiếp tục học"  Show course intro
with last position
    │
    ▼ (click)
Navigate to exact position:
- Page + scroll offset
- Video timestamp
- Quiz state
```

## Security Design

### Authentication Flow

```
User → Login page → Keycloak (SSO/OIDC)
                         │
                    ┌────┴────┐
                    ▼         ▼
              Success      Failure
                │              │
                ▼              ▼
         Issue JWT       Count failures
         (access +       (5 fails → lock 30m)
          refresh)
                │
                ▼
         API requests with
         Authorization: Bearer <jwt>
                │
                ▼
         API Gateway validates JWT
         on every request
```

### RBAC Enforcement

```
API Request arrives
       │
       ▼
┌──────────────────┐
│ JWT Validation   │
│ (signature,      │
│  expiry, tenant) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Role Extraction  │
│ (from JWT claims)│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│Permission Check  │
│ role.permissions │
│ ∩ required perms │
└────────┬─────────┘
         │
    ┌────┴────┐
    ▼         ▼
 Allowed    Denied
    │         │
    ▼         ▼
 Process   HTTP 403
 request   "Unauthorized"
```

## Caching Strategy

| Data | Cache Location | TTL | Invalidation |
|------|---------------|-----|-------------|
| JWT sessions | Redis | 60 min | On logout |
| Leaderboard | Redis sorted set | 5 min | On point change |
| Course listings | Redis | 5 min | On publish/unpublish |
| User points/streak | Redis hash | 30 sec | On point transaction |
| Combo timer | Redis | Session-based | On 5 min inactivity |
| AI Chat context | Redis | 30 min | On session end |
| Dashboard KPIs | Redis | 5 min | Scheduled refresh |
| Search results | Elasticsearch | Real-time | On content index |

## Search Architecture (Elasticsearch)

### Index Design

```json
// learning_content index
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "tenant_id": { "type": "keyword" },
      "entity_type": { "type": "keyword" },
      "title": {
        "type": "text",
        "analyzer": "vietnamese_analyzer",
        "fields": { "keyword": { "type": "keyword" } }
      },
      "content": {
        "type": "text",
        "analyzer": "vietnamese_analyzer"
      },
      "subject_id": { "type": "keyword" },
      "tags": { "type": "keyword" },
      "course_id": { "type": "keyword" },
      "chapter_id": { "type": "keyword" },
      "status": { "type": "keyword" },
      "created_at": { "type": "date" }
    }
  },
  "settings": {
    "analysis": {
      "analyzer": {
        "vietnamese_analyzer": {
          "type": "custom",
          "tokenizer": "icu_tokenizer",
          "filter": ["icu_folding", "lowercase"]
        }
      }
    }
  }
}
```

## Multi-tenant Data Isolation

```
Every table includes tenant_id column
       │
       ▼
┌──────────────────────────┐
│  Row-Level Security (RLS)│
│  PostgreSQL Policy:      │
│  WHERE tenant_id =       │
│  current_setting(        │
│    'app.current_tenant') │
└──────────────────────────┘
       │
       ▼
API Gateway sets tenant context
from JWT claims on every request
```

## Deployment Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    KUBERNETES CLUSTER                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              INGRESS (Nginx/Traefik)                 │   │
│  │         SSL termination, rate limiting              │   │
│  └─────────────────────────┬───────────────────────────┘   │
│                            │                                │
│  ┌────────────┐  ┌────────┴───────┐  ┌────────────────┐   │
│  │ Frontend   │  │  API Gateway   │  │   Keycloak     │   │
│  │ (React SPA)│  │  (Kong/Custom) │  │  (Auth Server) │   │
│  │ 2 replicas │  │  2 replicas    │  │  2 replicas    │   │
│  └────────────┘  └────────┬───────┘  └────────────────┘   │
│                            │                                │
│  ┌─────────────────────────┴───────────────────────────┐   │
│  │              SERVICE PODS                            │   │
│  │  auth(2) | learning(3) | exam(2) | ai(3)           │   │
│  │  gamification(2) | notification(2) | report(2)     │   │
│  │  admin(1) | search(2) | content(2)                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              DATA LAYER (StatefulSets/Managed)       │   │
│  │  PostgreSQL(primary+replica) | Redis(cluster)       │   │
│  │  Elasticsearch(3 nodes) | RabbitMQ(cluster)         │   │
│  │  MinIO/S3 (object storage)                          │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

## Non-Functional Requirements Mapping

| Requirement | Design Solution |
|-------------|----------------|
| SSO/OIDC (Req 31) | Keycloak integration, OIDC flow |
| JWT Auth (Req 31) | API Gateway validation, Redis session |
| Rate Limiting (Req 32) | API Gateway (Kong) or custom middleware |
| Async AI (Req 37) | RabbitMQ queue + worker pods |
| Horizontal Scaling (Req 37) | K8s HPA based on CPU/memory |
| Caching (Req 37) | Redis cluster with TTL policies |
| Full-text Search (Req 5, 42) | Elasticsearch with Vietnamese analyzer |
| Object Storage (Req 1, 10) | MinIO/S3 for docs and media |
| Backup (Req 35) | Daily pg_dump + S3 cross-region sync |
| Multi-tenant (Req 38) | Row-Level Security + tenant_id |
| Export (Req 33) | Async generation + temporary S3 storage |
| Responsive (Req 34) | React responsive + breakpoint system |
| Audit (Req 22) | Append-only audit_logs table, no DELETE |
| Performance 500ms (Req 37) | Caching + DB indexes + connection pool |

## Requirement-to-Component Traceability

| Requirement | Service(s) | Database Table(s) |
|-------------|-----------|-------------------|
| Req 1: Import | content-service, ai-service | document_imports, lessons |
| Req 2: AI Slides/Voice | ai-service | ai_tasks, slides |
| Req 3: AI Quiz | ai-service | ai_tasks, questions |
| Req 4: Bookmark/Note | learning-service | bookmarks, notes |
| Req 5: Search | search-service | Elasticsearch index |
| Req 6: AI Chat/Explain | ai-service | ai_chat_sessions, ai_chat_messages |
| Req 7: Progress/Resume | learning-service | learning_progress |
| Req 8: History | learning-service | learning_sessions |
| Req 9: Versioning | content-service | content_versions |
| Req 10: Media Library | content-service | media_files |
| Req 11: Question Bank | exam-service | questions |
| Req 12: Exam Mgmt | exam-service | exams, exam_questions |
| Req 13: Flashcard | exam-service | flashcard_sets, flashcards |
| Req 14: Points/Streak | gamification-service | user_points, point_transactions |
| Req 15: Unlock | gamification-service | user_unlocks, point_transactions |
| Req 16: Leaderboard/Badge | gamification-service | badges, user_badges, levels |
| Req 17: Daily Mission | gamification-service | daily_missions |
| Req 18: Access Control | learning-service | access_rules, user_unlocks |
| Req 19: Learning Path | learning-service | learning_paths, learning_path_steps |
| Req 20: User Mgmt | user-service | users, roles, groups |
| Req 21: Workflow | admin-service | workflow_history, courses.status |
| Req 22: Audit Log | admin-service | audit_logs |
| Req 23: AI Config | admin-service | ai_config |
| Req 24: System Config | admin-service | system_config |
| Req 25: Admin Dashboard | report-service | aggregated queries |
| Req 26: Customer Dashboard | report-service | learning_progress, user_points |
| Req 27: Support | admin-service | system_config (support_email) |
| Req 28: Notification | notification-service | notifications |
| Req 29: AI Recommend | ai-service | ai_tasks, learning_progress |
| Req 30: Reports | report-service | aggregated queries |
| Req 31: Auth | auth-service | Keycloak + JWT |
| Req 32: API | API Gateway | All services |
| Req 33: Export | report-service | Async file generation |
| Req 34: Responsive | Frontend (React) | N/A |
| Req 35: Backup | DevOps/Infrastructure | pg_dump + S3 |
| Req 36: Certificate | learning-service | certificates, certificate_templates |
| Req 37: Performance | All services | Redis cache, indexes |
| Req 38: Multi-tenant | All services | tenants, RLS policies |
| Req 39: Exam Import | exam-service | questions, document_imports |
| Req 40: Exam Analytics | report-service | exam_attempts, questions |
| Req 41: RBAC | auth-service, user-service | roles, permissions, role_permissions |
| Req 42: AI Material Search | ai-service, search-service | Elasticsearch, ai_chat_messages |
