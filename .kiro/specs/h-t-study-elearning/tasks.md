# Implementation Tasks - H-T.Study eLearning Platform

## Phase 1: Foundation & Infrastructure

### Task 1.1: Project Setup & Configuration
- [ ] Initialize monorepo structure (NestJS backend + React frontend)
- [ ] Configure TypeScript, ESLint, Prettier
- [ ] Setup Docker Compose for local development (PostgreSQL, Redis, Elasticsearch, RabbitMQ, MinIO)
- [ ] Configure environment variables and secrets management
- [ ] Setup CI/CD pipeline (build, test, deploy stages)

**Relates to:** Req 32 (API), Req 37 (Performance)

### Task 1.2: Database Setup & Migrations
- [ ] Create PostgreSQL database with multi-tenant schema
- [ ] Implement tenant table and Row-Level Security policies
- [ ] Create User & Identity tables (users, roles, permissions, groups, mappings)
- [ ] Create Learning Content tables (subjects, courses, chapters, lessons, slides)
- [ ] Create Question Bank & Exam tables
- [ ] Create Gamification tables (points, badges, levels, missions)
- [ ] Create Learning Path & Certificate tables
- [ ] Create AI & Notification tables
- [ ] Create Audit & Configuration tables
- [ ] Setup database indexes for performance
- [ ] Configure automated backup schedule

**Relates to:** Req 35 (Backup), Req 38 (Multi-tenant), Design ERD

### Task 1.3: Authentication & Authorization Service
- [ ] Integrate Keycloak for SSO/OIDC
- [ ] Implement JWT token issuance and validation
- [ ] Implement token refresh mechanism
- [ ] Implement account lockout after 5 failed attempts
- [ ] Implement session invalidation (logout all devices)
- [ ] Create RBAC middleware with role-permission checks
- [ ] Define default roles (Admin, Maker, Checker, Customer)
- [ ] Define default permission sets per role
- [ ] Implement API Gateway JWT validation

**Relates to:** Req 20, Req 31, Req 41

## Phase 2: User Management & Administration

### Task 2.1: User CRUD & Group Management
- [ ] Implement User CRUD API (create, read, update, delete, list with pagination)
- [ ] Implement email uniqueness and password complexity validation
- [ ] Implement user status management (active/inactive/locked)
- [ ] Implement Group CRUD and user-group assignment
- [ ] Implement bulk user import via CSV (up to 5000 rows, validation, error report)
- [ ] Implement user search and filtering

**Relates to:** Req 20

### Task 2.2: Role & Permission Management
- [ ] Implement Role CRUD API
- [ ] Implement Permission CRUD API
- [ ] Implement role-permission assignment
- [ ] Implement group-permission assignment
- [ ] Implement custom role creation by Admin
- [ ] Implement permission inheritance (role → user, group → user)
- [ ] Implement "Unauthorized" response for denied access

**Relates to:** Req 20, Req 41

### Task 2.3: System Configuration
- [ ] Implement system config CRUD (key-value with JSONB)
- [ ] Implement support email configuration
- [ ] Implement branding config (name, logo, favicon, theme)
- [ ] Implement operational config (session timeout, file upload limits, maintenance mode)
- [ ] Implement config validation before applying
- [ ] Implement maintenance mode toggle (display maintenance page to non-Admin)

**Relates to:** Req 24

### Task 2.4: AI Configuration
- [ ] Implement AI config CRUD
- [ ] Implement model selection, temperature, response length settings
- [ ] Implement feature toggle (chat, explain, quiz gen, slide gen, voice gen, recommend, material search)
- [ ] Implement queue limit and priority configuration
- [ ] Apply config to all AI service calls

**Relates to:** Req 23

### Task 2.5: Audit Log
- [ ] Implement audit log recording for all CRUD operations
- [ ] Implement authentication event logging (login, logout, failed attempts)
- [ ] Implement permission/role change logging
- [ ] Implement audit log API with filtering (date range, user, action type, resource)
- [ ] Implement audit log export (CSV, Excel)
- [ ] Implement 12-month retention policy
- [ ] Ensure append-only (prevent modification/deletion)

**Relates to:** Req 22

## Phase 3: Learning Content Management

### Task 3.1: Subject & Course Management
- [ ] Implement Subject CRUD API
- [ ] Implement Course CRUD API with status management
- [ ] Implement course access type (free/locked/premium) and point cost
- [ ] Implement course listing with filters (subject, status, access type)
- [ ] Implement Chapter CRUD (nested under course, with sort order)
- [ ] Implement Lesson CRUD (nested under chapter, support text/slide/video/mixed)

**Relates to:** Req 18

### Task 3.2: Content Workflow (Maker-Checker)
- [ ] Implement content status state machine (draft → pending_review → published/rejected)
- [ ] Implement submit-for-review action (Maker)
- [ ] Implement approve action (Checker) → publish content
- [ ] Implement reject action (Checker) → require rejection reason ≥10 chars
- [ ] Implement resubmit after rejection (Maker)
- [ ] Implement Admin override capability
- [ ] Enforce: Maker cannot approve own content
- [ ] Enforce: content not visible to Customers while pending
- [ ] Implement workflow status history recording
- [ ] Implement notifications to Checkers/Makers on status change

**Relates to:** Req 21

### Task 3.3: Content Versioning
- [ ] Implement version creation on every content save
- [ ] Implement version history API (list versions with change summaries)
- [ ] Implement version comparison (diff view)
- [ ] Implement version revert with new version record
- [ ] Require change summary on each save (max 500 chars)

**Relates to:** Req 9

### Task 3.4: Document Import
- [ ] Implement file upload endpoint (PDF, Word, Excel, CSV, PPT, Text)
- [ ] Implement file format validation and size limit check (100MB)
- [ ] Implement file storage in Object Storage (MinIO/S3)
- [ ] Implement async processing via message queue
- [ ] Implement import status tracking API
- [ ] Implement document structure preservation (headings, paragraphs, lists, tables)
- [ ] Implement error handling for partial extraction failures

**Relates to:** Req 1

### Task 3.5: Media Library
- [ ] Implement media upload with format validation (JPEG, PNG, GIF, SVG, WebP, MP4, WebM, MP3, WAV, OGG)
- [ ] Implement file size limit (500MB) and storage in Object Storage
- [ ] Implement media metadata (title, description, tags, upload date, file size)
- [ ] Implement media search and filtering
- [ ] Implement reference linking (no file duplication)
- [ ] Implement usage count tracking
- [ ] Implement delete with referencing warning and confirmation

**Relates to:** Req 10

## Phase 4: AI Services

### Task 4.1: AI Infrastructure Setup
- [ ] Setup RabbitMQ queues for AI tasks (ocr, slide, voice, quiz, chat, explain, recommend, material_search)
- [ ] Implement AI task queue with priority system
- [ ] Implement retry mechanism (max 3 retries, 60s interval)
- [ ] Implement AI task status tracking API
- [ ] Integrate with LLM provider (OpenAI/Azure OpenAI)
- [ ] Implement rate limiting and token budget management
- [ ] Implement fallback and maintenance message when AI unavailable

**Relates to:** Req 23, Req 37

### Task 4.2: OCR & Content Processing
- [ ] Integrate OCR engine for image-based document extraction
- [ ] Implement text normalization and structuring into learning sections
- [ ] Implement heading hierarchy detection for section splitting
- [ ] Handle partial extraction failures (process remaining, report failed sections)
- [ ] Handle empty content detection (reject if no readable content)

**Relates to:** Req 1

### Task 4.3: AI Slide & Voice Generation
- [ ] Implement slide generation from structured content
- [ ] Implement content grouping (max 5 key points per slide)
- [ ] Integrate TTS (Text-to-Speech) for Vietnamese voice narration
- [ ] Implement audio-slide synchronization
- [ ] Implement voice duration tracking per slide (30-180 seconds)
- [ ] Implement completion notification to Maker
- [ ] Set content status to "Ready for Review" after generation

**Relates to:** Req 2

### Task 4.4: AI Quiz Generation
- [ ] Implement quiz generation from learning section content
- [ ] Generate 3-10 questions per section (single/multiple choice)
- [ ] Generate correct answers and explanations (max 500 chars)
- [ ] Implement difficulty level categorization (Easy/Medium/Hard)
- [ ] Mark as "AI-generated" with Draft status requiring Maker review
- [ ] Handle insufficient content (notify Maker)

**Relates to:** Req 3

### Task 4.5: AI Chat & Explain
- [ ] Implement AI chat session management (30 min inactivity timeout)
- [ ] Implement chat with current lesson context
- [ ] Implement text selection explain (1-1000 chars, response within 15s)
- [ ] Implement conversation history (up to 50 messages per session)
- [ ] Implement Vietnamese language support
- [ ] Handle AI failure (inform Customer, suggest alternatives)

**Relates to:** Req 6

### Task 4.6: AI Material Search (Requirement 42)
- [ ] Implement question analysis to extract key topics and concepts
- [ ] Implement cross-platform material search via Elasticsearch
- [ ] Search across courses, lessons, slides, documents, exam questions
- [ ] Implement relevance scoring and ranking (max 10 references)
- [ ] Combine AI answer with material references in response
- [ ] Include material title, content type, relevance summary
- [ ] Check and indicate access status (locked/unlocked) per reference
- [ ] Search across ALL courses, not limited to enrolled
- [ ] Handle no results case (provide AI answer only)

**Relates to:** Req 42

### Task 4.7: AI Recommendation
- [ ] Implement learning history and quiz performance analysis
- [ ] Generate personalized course recommendations (3-10 courses)
- [ ] Provide explanation for each recommendation (max 150 chars)
- [ ] Exclude completed/enrolled/dismissed courses
- [ ] Implement recommendation refresh on course completion (within 24h)
- [ ] Implement dismiss with optional feedback
- [ ] Fallback: popular/trending courses for new users

**Relates to:** Req 29

## Phase 5: Exam & Question Bank

### Task 5.1: Question Bank
- [ ] Implement Question CRUD API with all attributes
- [ ] Implement validation (content, options 2-8, correct answer, difficulty, subject)
- [ ] Implement single-choice and multiple-choice types
- [ ] Implement subject and certification categorization
- [ ] Implement question search and filtering (subject, certification, difficulty, tags)
- [ ] Implement AI-generated question marking and Checker approval requirement

**Relates to:** Req 11

### Task 5.2: Exam Management
- [ ] Implement Exam CRUD API
- [ ] Implement manual question selection with filtering
- [ ] Implement AI-powered exam generation (subject, difficulty distribution, count)
- [ ] Implement no-duplicate validation within same exam
- [ ] Implement configurable parameters (time limit 1-480 min, passing score, randomize, shuffle)
- [ ] Implement exam start/submit flow
- [ ] Implement auto-submit on time expiry
- [ ] Implement immediate score calculation and results display
- [ ] Implement AI answer explanations post-submission
- [ ] Implement attempt recording (score, duration, per-question responses)
- [ ] Allow unlimited retakes per Customer

**Relates to:** Req 12

### Task 5.3: Exam Import
- [ ] Implement file upload for exam import (Excel, CSV, Word)
- [ ] Provide downloadable template files for each format
- [ ] Implement file parsing and question extraction
- [ ] Implement preview display before saving
- [ ] Implement row-level validation errors
- [ ] Implement selective saving (valid entries only)
- [ ] Save with "Draft" status requiring Checker approval
- [ ] Support up to 500 questions per file (max 10 MB)

**Relates to:** Req 39

### Task 5.4: Flashcard
- [ ] Implement Flashcard Set CRUD (min 5, max 200 cards)
- [ ] Implement flashcard creation from Question Bank questions
- [ ] Implement subject/certification association
- [ ] Implement study session (one card at a time, front/back)
- [ ] Implement Known/Need Review marking per card per user
- [ ] Implement prioritization (Need Review cards first)
- [ ] Implement progress tracking (cards studied, known count, review count)

**Relates to:** Req 13

### Task 5.5: Exam Analytics
- [ ] Implement per-question statistics (correct rate, avg time, discrimination index)
- [ ] Implement abnormal question detection and flagging
- [ ] Implement exam-level statistics (avg score, pass rate, distribution, completion time)
- [ ] Implement per-Customer exam history with trend analysis
- [ ] Implement question-analytics combined view for Makers
- [ ] Implement cross-group/period comparison

**Relates to:** Req 40

## Phase 6: Gamification

### Task 6.1: Points & Streak System
- [ ] Implement points table and configurable point values per activity type/difficulty
- [ ] Implement point awarding on activity completion (lesson, quiz, exam)
- [ ] Implement daily streak tracking (consecutive calendar days with activity)
- [ ] Implement streak reset on missed day (based on Customer timezone)
- [ ] Implement combo timer (Redis-based, 5 min inactivity reset)
- [ ] Implement combo bonuses at 30/60/90/120 min thresholds
- [ ] Implement combo notification on achievement
- [ ] Implement point transaction history (earn/spend)

**Relates to:** Req 14

### Task 6.2: Unlock with Points
- [ ] Implement unlock request API (verify sufficient points)
- [ ] Implement point deduction and permanent access grant
- [ ] Implement insufficient points response (show deficit, suggest activities)
- [ ] Display point cost on locked content items
- [ ] Record unlock in user_unlocks table

**Relates to:** Req 15

### Task 6.3: Leaderboard, Badge & Level
- [ ] Implement leaderboard calculation (daily/weekly/monthly/all-time)
- [ ] Implement Redis sorted sets for real-time leaderboard
- [ ] Implement top 100 display, tie resolution by earlier date
- [ ] Implement badge criteria configuration (Admin)
- [ ] Implement automatic badge award on milestone achievement
- [ ] Implement level threshold configuration (min 10 levels)
- [ ] Implement level-up detection and notification
- [ ] Display badges, level, progress to next level on profile

**Relates to:** Req 16

### Task 6.4: Daily Missions
- [ ] Implement mission generation at 00:00 daily (3-5 missions per user)
- [ ] Implement varied mission types (lesson, quiz, study duration, flashcard)
- [ ] Implement mission progress tracking
- [ ] Implement bonus points on mission completion
- [ ] Implement additional bonus on all-missions-complete
- [ ] Implement mission expiry at 23:59 (no penalty)
- [ ] Display active missions with progress indicators on dashboard

**Relates to:** Req 17

## Phase 7: Learning Progress & Features

### Task 7.1: Learning Progress Tracking
- [ ] Implement progress recording (page, scroll position, video timestamp, quiz state, time spent)
- [ ] Implement auto-save at 30-second intervals
- [ ] Implement save on exit (within 1 second)
- [ ] Handle unexpected session end (retain last auto-save)
- [ ] Implement completion percentage calculation per course/chapter/lesson
- [ ] Define completion criteria (scroll to bottom, 90% video, quiz submitted)
- [ ] Implement real-time progress updates (within 2 seconds)

**Relates to:** Req 7

### Task 7.2: Resume Learning
- [ ] Implement "Tiếp tục học" button with last position info
- [ ] Implement navigation to exact saved position (page, scroll, video timestamp)
- [ ] Handle invalid position (content removed/restructured → navigate to nearest lesson)
- [ ] Display course name, chapter, lesson, and completion percentage
- [ ] Navigate within 3 seconds

**Relates to:** Req 7

### Task 7.3: Learning History
- [ ] Implement chronological activity recording (lesson views, quiz attempts, exam attempts, flashcard sessions)
- [ ] Implement history listing (paginated, 20 per page, sorted by recent)
- [ ] Implement filtering (date range, course, completion status)
- [ ] Implement time aggregation (day/week/month)
- [ ] Implement click-to-navigate to last position via Resume Engine
- [ ] Handle empty state (suggest courses)

**Relates to:** Req 8

### Task 7.4: Bookmark & Note
- [ ] Implement bookmark creation (page reference, timestamp, auto-title)
- [ ] Implement note creation (max 5000 chars, section association, within 2 seconds)
- [ ] Implement text formatting support (bold, italic, highlight)
- [ ] Implement consolidated list view (sorted by creation date, most recent first)
- [ ] Implement click-to-navigate to exact content position
- [ ] Implement edit and delete with confirmation
- [ ] Handle stale references (content removed → inform Customer)
- [ ] Handle save failure (display error, retain unsaved content)

**Relates to:** Req 4

### Task 7.5: Search
- [ ] Setup Elasticsearch with Vietnamese analyzer (ICU tokenizer, folding)
- [ ] Implement content indexing pipeline (courses, lessons, slides, quizzes, notes, bookmarks)
- [ ] Implement search API (min 2 chars, max 200 chars, results within 2 seconds)
- [ ] Implement keyword highlighting with 30 words context
- [ ] Implement relevance ranking and content type display
- [ ] Implement pagination (20 per page)
- [ ] Implement Vietnamese diacritics handling (search without diacritics matches content with)
- [ ] Implement click-to-navigate to exact content location
- [ ] Handle no results and minimum length validation

**Relates to:** Req 5

## Phase 8: Learning Path, Access Control & Certificates

### Task 8.1: Learning Access Control
- [ ] Implement content locking at course/chapter/lesson/quiz/exam levels
- [ ] Default new content to "locked" until Admin sets access rule
- [ ] Implement multiple unlock mechanisms (points, prerequisite, premium, role)
- [ ] Allow simultaneous mechanisms per content (any satisfied → access)
- [ ] Implement auto-unlock on prerequisite completion (within 5 seconds)
- [ ] Display lock status and unlock methods to Customer (within 2 seconds)
- [ ] Implement premium subscription access grant
- [ ] Handle premium expiry (revoke access unless unlocked by other mechanism)
- [ ] Implement Admin access rule configuration

**Relates to:** Req 18

### Task 8.2: Learning Path
- [ ] Implement Learning Path CRUD (ordered steps, min 2, max 50)
- [ ] Implement certification association
- [ ] Implement Customer enrollment
- [ ] Implement step status display (locked/current/completed)
- [ ] Implement auto-unlock next step on completion (within 5 seconds)
- [ ] Implement progress percentage (completed/total, rounded to nearest integer)
- [ ] Implement shared content across paths (completion syncs across enrolled paths)
- [ ] Display prerequisite info for locked steps
- [ ] Implement path completion → notify Customer
- [ ] Handle Admin modifications (preserve existing progress, recalculate percentage)

**Relates to:** Req 19

### Task 8.3: Certificate Management
- [ ] Implement certificate generation on learning path completion
- [ ] Implement certificate template configuration (Admin)
- [ ] Implement unique verification code generation
- [ ] Implement public verification endpoint (code → certificate details)
- [ ] Implement certificate listing per Customer profile
- [ ] Implement PDF download generation

**Relates to:** Req 36

## Phase 9: Notifications, Dashboard & Reports

### Task 9.1: Notification Center
- [ ] Implement notification types (achievement, content, workflow, system)
- [ ] Implement delivery within 30 seconds of triggering event
- [ ] Implement unread count indicator (real-time via WebSocket or polling)
- [ ] Implement notification panel (reverse chronological, read/unread)
- [ ] Implement mark-as-read (individual and all)
- [ ] Implement Admin configuration of enabled/disabled notification types
- [ ] Implement 90-day retention

**Relates to:** Req 28

### Task 9.2: Admin Dashboard
- [ ] Implement KPI queries (total users, active users DAU/WAU/MAU, registrations, courses, exams)
- [ ] Implement learning analytics (completion rate, avg time, popular courses, exam pass rates)
- [ ] Implement gamification metrics (total points, active streaks, leaderboard activity)
- [ ] Implement date range filtering (default 30 days, max 12 months)
- [ ] Implement configurable refresh interval (5-60 min)
- [ ] Implement dashboard data export (PDF, Excel)
- [ ] Handle partial data failure (show error per section, display available sections)

**Relates to:** Req 25

### Task 9.3: Customer Dashboard
- [ ] Implement personal stats display (streak, points, level, daily missions)
- [ ] Implement recently accessed courses (top 5, with completion % and "Tiếp tục học" button)
- [ ] Implement enrolled learning paths with progress
- [ ] Implement milestones (overdue/upcoming within 7 days, max 10)
- [ ] Implement leaderboard position (weekly, rank + points)
- [ ] Implement "Tiếp tục học" navigation to last saved position
- [ ] Handle empty state (suggest courses/paths)

**Relates to:** Req 26

### Task 9.4: Support Module
- [ ] Implement support email display on Login, Footer, Profile, Error Pages
- [ ] Read email from system_config (support_email key)
- [ ] Implement clickable mailto link with consistent styling
- [ ] Update display within 1 minute of Admin config change
- [ ] Hide section when no email configured

**Relates to:** Req 27

### Task 9.5: Reports & Analytics
- [ ] Implement user engagement report (login frequency, session duration)
- [ ] Implement learning completion rate report
- [ ] Implement exam performance report (pass/fail, score distribution)
- [ ] Implement gamification statistics report
- [ ] Implement filtering (date range, user group, course, certification)
- [ ] Implement export (PDF, Excel, CSV)
- [ ] Implement scheduled reports (daily/weekly/monthly to Admin email)
- [ ] Implement per-Customer analytics (time trends, score progression, topic strengths)
- [ ] Performance: generate within 30 seconds for up to 100K records

**Relates to:** Req 30

### Task 9.6: Data Export
- [ ] Implement async export generation (user lists, progress, exam results, audit, analytics)
- [ ] Implement export to PDF, Excel, CSV
- [ ] Implement role-based export control (Customer: own data only)
- [ ] Implement compression for files >50MB
- [ ] Implement 24-hour file retention with auto-deletion
- [ ] Implement notification when export ready for download

**Relates to:** Req 33

## Phase 10: Frontend Development

### Task 10.1: Frontend Foundation
- [ ] Setup React + TypeScript project with build tooling (Vite)
- [ ] Configure UI framework (Ant Design / Material UI)
- [ ] Implement responsive layout system (mobile 320px, tablet 768px, desktop 1024px+)
- [ ] Implement navigation (sidebar for desktop, hamburger for mobile)
- [ ] Implement authentication flow (Keycloak redirect, JWT storage)
- [ ] Implement API client with interceptors (JWT, error handling)
- [ ] Implement role-based route protection
- [ ] Implement global state management (Zustand/Redux Toolkit)

**Relates to:** Req 34

### Task 10.2: Login & Auth Pages
- [ ] Implement Login page with SSO/OIDC redirect
- [ ] Display support email on Login page
- [ ] Implement account lockout feedback
- [ ] Implement error pages (403, 404, 500) with support email

### Task 10.3: Admin Panel
- [ ] Implement Admin Dashboard page (KPIs, charts, date filter)
- [ ] Implement User Management pages (CRUD, search, bulk import)
- [ ] Implement Role & Permission management pages
- [ ] Implement Group management pages
- [ ] Implement System Configuration page
- [ ] Implement AI Configuration page
- [ ] Implement Audit Log page (filterable, exportable)
- [ ] Implement Report generation pages
- [ ] Implement Certificate Template management
- [ ] Implement Learning Path designer (drag-and-drop steps)

**Relates to:** Req 20-25

### Task 10.4: Content Management (Maker/Checker)
- [ ] Implement Course management pages (CRUD, workflow actions)
- [ ] Implement Chapter/Lesson editor (rich text, media insertion)
- [ ] Implement Document import page (upload, progress, preview)
- [ ] Implement Media Library page (upload, browse, search, insert)
- [ ] Implement Question Bank pages (CRUD, filter, AI generation)
- [ ] Implement Exam builder (manual selection + AI generation)
- [ ] Implement Flashcard set management
- [ ] Implement Version history and diff view
- [ ] Implement Workflow inbox (Checker: review, approve/reject)
- [ ] Implement Content status badges and action buttons

**Relates to:** Req 1, 9, 10, 11, 12, 13, 21, 39

### Task 10.5: Learning Experience (Customer)
- [ ] Implement Course catalog page (browse, filter, search)
- [ ] Implement Course detail page (chapters, lessons, progress)
- [ ] Implement Lesson viewer (text, slides with sync audio, video)
- [ ] Implement Quiz component (single/multiple choice, submit, results)
- [ ] Implement Bookmark and Note UI (create, list, navigate)
- [ ] Implement AI Chat sidebar (chat, explain, material references)
- [ ] Implement Search page with highlighted results
- [ ] Implement "Tiếp tục học" button and resume navigation
- [ ] Implement Learning Path enrollment and progress view
- [ ] Implement Exam taking interface (timer, questions, submit)
- [ ] Implement Exam results page (score, explanations, analytics)
- [ ] Implement Flashcard study interface (flip, known/review)

**Relates to:** Req 4-8, 12, 13, 18, 19, 42

### Task 10.6: Gamification UI (Customer)
- [ ] Implement Points & Streak display (dashboard widget)
- [ ] Implement Combo progress indicator (real-time timer)
- [ ] Implement Daily Missions widget (progress bars)
- [ ] Implement Leaderboard page (tabs: daily/weekly/monthly/all-time)
- [ ] Implement Badge collection page
- [ ] Implement Level progress bar
- [ ] Implement Unlock modal (point cost, confirm)
- [ ] Implement Point transaction history page

**Relates to:** Req 14-17

### Task 10.7: Profile & Notifications
- [ ] Implement Customer profile page (info, badges, level, certificates)
- [ ] Implement Notification bell with unread count
- [ ] Implement Notification panel (list, mark read)
- [ ] Implement AI Recommendations widget on dashboard
- [ ] Implement Certificate viewer and download
- [ ] Implement Support email in Footer and Profile

**Relates to:** Req 27, 28, 29, 36

## Phase 11: Integration, Testing & Deployment

### Task 11.1: API Documentation
- [ ] Generate OpenAPI 3.0 spec for all endpoints
- [ ] Setup Swagger UI for interactive API documentation
- [ ] Document authentication requirements per endpoint
- [ ] Document request/response schemas with examples
- [ ] Implement API versioning (v1 prefix)

**Relates to:** Req 32

### Task 11.2: Performance Optimization
- [ ] Implement Redis caching strategy (see Design: Caching Strategy)
- [ ] Optimize database queries with proper indexes
- [ ] Implement connection pooling
- [ ] Load test: verify 500ms p95 with 1000 concurrent users
- [ ] Implement auto-scaling alerts (CPU/memory >80% for 60s)
- [ ] Verify AI tasks don't block user-facing responses

**Relates to:** Req 37

### Task 11.3: Search Optimization
- [ ] Configure Elasticsearch Vietnamese analyzer
- [ ] Implement real-time content indexing pipeline
- [ ] Verify Vietnamese diacritics handling
- [ ] Verify search response <2 seconds
- [ ] Implement index optimization and maintenance schedules

**Relates to:** Req 5, 42

### Task 11.4: Security Hardening
- [ ] Implement rate limiting on all API endpoints
- [ ] Implement input validation and sanitization
- [ ] Implement CORS configuration
- [ ] Verify audit log completeness
- [ ] Verify RBAC enforcement on all endpoints
- [ ] Verify multi-tenant data isolation (no cross-tenant access)
- [ ] Implement secure file upload handling

**Relates to:** Req 31, 32, 38

### Task 11.5: Deployment & DevOps
- [ ] Create Kubernetes manifests (deployments, services, ingress)
- [ ] Configure Horizontal Pod Autoscaler (HPA)
- [ ] Setup monitoring and alerting (Prometheus/Grafana)
- [ ] Configure automated daily backups (PostgreSQL + Object Storage)
- [ ] Setup backup verification and geo-replication
- [ ] Implement point-in-time recovery capability
- [ ] Configure SSL/TLS certificates
- [ ] Setup staging and production environments

**Relates to:** Req 35, 37

### Task 11.6: Acceptance Testing
- [ ] Verify all 42 requirements against acceptance criteria
- [ ] Test Maker-Checker workflow end-to-end
- [ ] Test gamification flows (points, streak, combo, badge, level up, unlock)
- [ ] Test AI features (chat, explain, material search, quiz gen, slide gen)
- [ ] Test resume learning accuracy (position restore)
- [ ] Test multi-device responsive behavior
- [ ] Test RBAC enforcement for all 4 roles
- [ ] Test exam flow (start, answer, timeout, submit, results)
- [ ] Test learning path progression (auto-unlock, shared content)
- [ ] Test notification delivery and timing
- [ ] Performance test under expected load

**Relates to:** All Requirements
