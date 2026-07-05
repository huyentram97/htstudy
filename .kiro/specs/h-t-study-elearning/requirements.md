# Requirements Document

## Introduction

H-T.Study eLearning Platform v1.0 - Nền tảng eLearning toàn diện phục vụ việc học tập, luyện đề thi, quản trị nội dung và gamification. Hệ thống bao gồm các phân hệ chính: Học (Learning Management), Luyện đề (Exam Practice), Gamification, Learning Path, Quản trị (Administration), và Hỗ trợ (Support). Platform hỗ trợ 4 vai trò chính: Admin, Maker, Checker, Customer với workflow Maker-Checker-Admin cho quản lý nội dung.

## Glossary

- **Platform**: Hệ thống H-T.Study eLearning tổng thể
- **Learning_Module**: Phân hệ quản lý học tập bao gồm import tài liệu, sinh slide, voice, quiz
- **Content_Importer**: Thành phần xử lý import tài liệu PDF/Word/Excel/CSV/PPT/Text
- **AI_Engine**: Thành phần xử lý AI bao gồm OCR, chuẩn hóa nội dung, sinh slide, voice, quiz, chat, explain, recommendation
- **Quiz_Engine**: Thành phần quản lý quiz và câu hỏi trong bài học
- **Exam_Module**: Phân hệ luyện đề thi bao gồm Question Bank, sinh đề, flashcard
- **Question_Bank**: Kho câu hỏi được phân loại theo môn/chứng chỉ
- **Gamification_Engine**: Thành phần xử lý điểm thưởng, streak, combo, badge, level, leaderboard
- **Learning_Path_Engine**: Thành phần quản lý lộ trình học tập theo chứng chỉ
- **Access_Control**: Thành phần quản lý khóa/mở khóa nội dung học tập
- **User_Manager**: Thành phần quản lý User, Role, Group, Permission
- **Workflow_Engine**: Thành phần xử lý quy trình Maker-Checker-Admin
- **Audit_Logger**: Thành phần ghi nhận mọi hành động trong hệ thống
- **Progress_Tracker**: Thành phần theo dõi và lưu trữ tiến độ học tập
- **Resume_Engine**: Thành phần cho phép tiếp tục học đúng vị trí đang học
- **Media_Library**: Thư viện quản lý tài nguyên media (hình ảnh, video, audio)
- **Notification_Center**: Trung tâm thông báo cho người dùng
- **Search_Engine**: Thành phần tìm kiếm nội dung học tập
- **Dashboard_Module**: Thành phần hiển thị tổng quan cho Admin và End User
- **Support_Module**: Thành phần hiển thị thông tin hỗ trợ
- **Report_Engine**: Thành phần tạo báo cáo và analytics
- **Auth_Module**: Thành phần xác thực và phân quyền (SSO/OIDC, JWT)
- **Admin**: Người dùng có toàn quyền quản trị hệ thống
- **Maker**: Người dùng có quyền tạo và chỉnh sửa nội dung
- **Checker**: Người dùng có quyền duyệt và publish nội dung
- **Customer**: Người dùng cuối, học tập và luyện đề

## Requirements

---

### Requirement 1: Import và Xử lý Tài liệu

**User Story:** As a Maker, I want to import tài liệu từ nhiều định dạng (PDF/Word/Excel/CSV/PPT/Text), so that I can chuyển đổi tài liệu gốc thành nội dung học tập trên platform.

#### Acceptance Criteria

1. WHEN a Maker uploads a file in PDF, Word, Excel, CSV, PPT, or Text format, THE Content_Importer SHALL accept the file and begin processing within 5 seconds
2. WHEN a file is uploaded, THE AI_Engine SHALL apply OCR to extract text content from image-based documents
3. WHEN text extraction is complete, THE AI_Engine SHALL normalize and structure the content into learning sections
4. IF a file format is not supported, THEN THE Content_Importer SHALL reject the upload and display the list of supported formats
5. IF a file exceeds the maximum size limit (100MB), THEN THE Content_Importer SHALL reject the upload and inform the Maker of the size limit
6. WHEN processing is complete, THE Content_Importer SHALL store the original file in Object Storage and create a versioned content record
7. THE Content_Importer SHALL preserve the original document structure (headings, paragraphs, lists, tables) during import

---

### Requirement 2: AI Sinh Slide và Voice

**User Story:** As a Maker, I want AI to automatically generate slides and voice narration from imported content, so that learning materials are presented in an engaging multimedia format.

#### Acceptance Criteria

1. WHEN content is successfully imported, THE AI_Engine SHALL generate presentation slides from the structured content
2. WHEN slides are generated, THE AI_Engine SHALL create AI voice narration for each slide
3. WHILE generating slides, THE AI_Engine SHALL maintain logical grouping of content per slide (maximum 5 key points per slide)
4. WHEN voice generation is complete, THE AI_Engine SHALL synchronize audio timing with slide transitions
5. THE AI_Engine SHALL support Vietnamese language for voice narration
6. IF AI generation fails, THEN THE AI_Engine SHALL queue the task for retry and notify the Maker of the failure

---

### Requirement 3: AI Sinh Quiz từ Nội dung

**User Story:** As a Maker, I want AI to automatically generate quiz questions from learning content, so that learners can self-assess their understanding after each section.

#### Acceptance Criteria

1. WHEN content is imported or updated, THE AI_Engine SHALL generate quiz questions (single choice, multiple choice) relevant to the content
2. THE AI_Engine SHALL generate at least 3 quiz questions per learning section
3. WHEN quiz questions are generated, THE AI_Engine SHALL provide correct answers and explanations for each question
4. THE Quiz_Engine SHALL categorize generated questions by difficulty level (Easy, Medium, Hard)
5. IF the AI_Engine cannot generate sufficient questions from the content, THEN THE AI_Engine SHALL notify the Maker and suggest manual question creation

---

### Requirement 4: Bookmark và Note

**User Story:** As a Customer, I want to bookmark pages and add notes to learning content, so that I can quickly revisit important sections and record my thoughts.

#### Acceptance Criteria

1. WHEN a Customer clicks the bookmark button on any learning page, THE Learning_Module SHALL save the bookmark with page reference and timestamp
2. WHEN a Customer creates a note, THE Learning_Module SHALL associate the note with the specific content section and save it immediately
3. THE Learning_Module SHALL display all bookmarks and notes in a consolidated list accessible from the user profile
4. WHEN a Customer clicks a bookmark or note in the list, THE Learning_Module SHALL navigate to the exact position in the learning content
5. THE Learning_Module SHALL allow a Customer to edit or delete existing bookmarks and notes
6. THE Learning_Module SHALL support text formatting (bold, italic, highlight) in notes

---

### Requirement 5: Tìm kiếm Nội dung

**User Story:** As a Customer, I want to search across all learning content, so that I can quickly find specific topics or keywords.

#### Acceptance Criteria

1. WHEN a Customer enters a search query, THE Search_Engine SHALL return relevant results within 2 seconds
2. THE Search_Engine SHALL search across all content types: lessons, slides, quizzes, notes, and bookmarks
3. WHEN results are displayed, THE Search_Engine SHALL highlight matching keywords in context
4. THE Search_Engine SHALL rank results by relevance and display the content type for each result
5. WHEN a Customer clicks a search result, THE Search_Engine SHALL navigate to the exact location within the content
6. THE Search_Engine SHALL support Vietnamese language search with diacritics handling

---

### Requirement 6: AI Chat và AI Explain

**User Story:** As a Customer, I want to chat with AI about learning content and get explanations for difficult concepts, so that I can deepen my understanding without waiting for a human tutor.

#### Acceptance Criteria

1. WHEN a Customer sends a message in the AI Chat interface, THE AI_Engine SHALL respond with a contextually relevant answer within 10 seconds
2. WHILE a Customer is viewing learning content, THE AI_Engine SHALL provide the AI Chat with context from the current lesson
3. WHEN a Customer selects text and requests an explanation, THE AI_Engine SHALL generate a detailed explanation of the selected content
4. THE AI_Engine SHALL maintain conversation history within a learning session
5. IF the AI_Engine cannot provide an answer, THEN THE AI_Engine SHALL inform the Customer and suggest alternative resources
6. THE AI_Engine SHALL support Vietnamese language for both questions and answers

---

### Requirement 7: Learning Progress và Resume Learning

**User Story:** As a Customer, I want the system to track my learning progress and allow me to resume exactly where I left off, so that I can continue learning seamlessly across sessions.

#### Acceptance Criteria

1. THE Progress_Tracker SHALL record the following for each Customer session: current lesson/chapter/page, video timestamp, scroll position, quiz state, time spent, and last access time
2. WHEN a Customer exits a learning session, THE Progress_Tracker SHALL save the exact position (page, scroll offset, or video timestamp) within 1 second
3. WHEN a Customer returns to a previously started course, THE Resume_Engine SHALL display a "Tiếp tục học" (Continue Learning) button with the last position information
4. WHEN the Customer clicks "Tiếp tục học", THE Resume_Engine SHALL navigate to the exact previously saved position (page, scroll offset, or video timestamp)
5. THE Progress_Tracker SHALL calculate and display completion percentage for each course, chapter, and lesson
6. THE Progress_Tracker SHALL update progress in real-time as the Customer advances through content

---

### Requirement 8: Learning History

**User Story:** As a Customer, I want to view my complete learning history, so that I can review what I have studied and track my overall progress.

#### Acceptance Criteria

1. THE Learning_Module SHALL maintain a chronological record of all learning activities for each Customer
2. WHEN a Customer accesses the learning history page, THE Learning_Module SHALL display a list of accessed courses with dates, duration, and completion status
3. THE Learning_Module SHALL allow filtering history by date range, course, and completion status
4. THE Learning_Module SHALL display total learning time aggregated by day, week, and month
5. WHEN a Customer clicks a history entry, THE Learning_Module SHALL navigate to the corresponding course at the last accessed position

---

### Requirement 9: Content Versioning

**User Story:** As a Maker, I want to manage multiple versions of learning content, so that I can track changes and revert to previous versions if needed.

#### Acceptance Criteria

1. WHEN a Maker saves changes to learning content, THE Learning_Module SHALL create a new version with a version number, timestamp, and author
2. THE Learning_Module SHALL maintain a complete version history for each piece of content
3. WHEN a Maker views version history, THE Learning_Module SHALL display a list of all versions with change summaries
4. WHEN a Maker selects a previous version, THE Learning_Module SHALL allow comparison between versions (diff view)
5. WHEN a Maker chooses to revert, THE Learning_Module SHALL restore the selected version as the current version and create a new version record for the revert action
6. THE Learning_Module SHALL retain all versions for the lifetime of the content

---

### Requirement 10: Media Library

**User Story:** As a Maker, I want to manage all media assets (images, videos, audio) in a centralized library, so that I can reuse media across multiple courses and lessons.

#### Acceptance Criteria

1. THE Media_Library SHALL store and organize media files (images, video, audio) with metadata (title, description, tags, upload date, file size)
2. WHEN a Maker uploads media, THE Media_Library SHALL validate the file format and store it in Object Storage
3. THE Media_Library SHALL support search and filtering by file type, tags, upload date, and title
4. WHEN a Maker inserts media into learning content, THE Media_Library SHALL create a reference link (not duplicate the file)
5. THE Media_Library SHALL display usage count indicating how many content items reference each media file
6. IF a Maker attempts to delete a media file that is referenced by content, THEN THE Media_Library SHALL warn the Maker and require confirmation before deletion

---

### Requirement 11: Question Bank Management

**User Story:** As a Maker, I want to manage a centralized Question Bank categorized by subject and certification, so that I can efficiently create exams from pre-approved questions.

#### Acceptance Criteria

1. THE Question_Bank SHALL store questions with the following attributes: content, answer options, correct answer, explanation, difficulty level, subject, certification, and tags
2. WHEN a Maker creates a question, THE Question_Bank SHALL validate that all required fields are populated before saving
3. THE Question_Bank SHALL support single-choice and multiple-choice question types
4. THE Question_Bank SHALL allow categorization of questions by subject (môn học) and certification (chứng chỉ)
5. WHEN a Maker searches the Question Bank, THE Question_Bank SHALL support filtering by subject, certification, difficulty level, and tags
6. THE AI_Engine SHALL generate question suggestions for the Question Bank based on imported learning content
7. WHEN AI generates questions, THE Question_Bank SHALL mark them as "AI-generated" and require Checker approval before use in exams

---

### Requirement 12: Exam Generation và Management

**User Story:** As a Maker, I want to create exams by selecting questions from the Question Bank or having AI generate exam sets, so that Customers can practice with structured assessments.

#### Acceptance Criteria

1. WHEN a Maker creates an exam, THE Exam_Module SHALL allow selection of questions from the Question Bank with filtering by subject, difficulty, and certification
2. THE Exam_Module SHALL support AI-powered exam generation based on specified criteria (subject, difficulty distribution, question count)
3. WHEN an exam is generated, THE Exam_Module SHALL ensure no duplicate questions within the same exam
4. THE Exam_Module SHALL support configurable exam parameters: time limit, passing score, question order randomization, and answer shuffling
5. WHEN a Customer submits an exam, THE Exam_Module SHALL calculate the score immediately and display results with correct answers
6. THE AI_Engine SHALL provide explanations for each answer (correct and incorrect) after exam submission
7. THE Exam_Module SHALL record exam attempts with score, duration, and per-question responses for analytics

---

### Requirement 13: Flashcard

**User Story:** As a Customer, I want to study using flashcards generated from learning content and exam questions, so that I can memorize key concepts through spaced repetition.

#### Acceptance Criteria

1. THE Exam_Module SHALL support creation of flashcard sets from Question Bank questions
2. WHEN a Customer studies flashcards, THE Exam_Module SHALL present one card at a time with the question on front and answer on back
3. THE Exam_Module SHALL allow Customers to mark each flashcard as "Known" or "Need Review"
4. THE Exam_Module SHALL prioritize "Need Review" cards in subsequent study sessions
5. WHEN a Maker creates a flashcard set, THE Exam_Module SHALL allow association with a specific subject or certification
6. THE Exam_Module SHALL track flashcard study progress per Customer

---

### Requirement 14: Gamification - Điểm thưởng và Streak

**User Story:** As a Customer, I want to earn reward points and maintain study streaks, so that I am motivated to study consistently every day.

#### Acceptance Criteria

1. WHEN a Customer completes a learning activity (lesson, quiz, exam), THE Gamification_Engine SHALL award points based on the activity type and difficulty
2. THE Gamification_Engine SHALL track daily study streaks (consecutive days of learning activity)
3. WHEN a Customer studies for 30 continuous minutes, THE Gamification_Engine SHALL award a combo bonus (30-minute combo)
4. WHEN a Customer studies for 60 continuous minutes, THE Gamification_Engine SHALL award a higher combo bonus (60-minute combo)
5. WHEN a Customer studies for 90 continuous minutes, THE Gamification_Engine SHALL award an even higher combo bonus (90-minute combo)
6. WHEN a Customer studies for 120 continuous minutes, THE Gamification_Engine SHALL award the maximum combo bonus (120-minute combo)
7. IF a Customer breaks the daily streak (no activity for a calendar day), THEN THE Gamification_Engine SHALL reset the streak counter to zero
8. THE Gamification_Engine SHALL display current points balance, streak count, and combo status on the Customer dashboard

---

### Requirement 15: Gamification - Mở khóa bằng Điểm

**User Story:** As a Customer, I want to use my earned points to unlock courses, chapters, and exam sets, so that my consistent study effort is rewarded with access to more content.

#### Acceptance Criteria

1. THE Gamification_Engine SHALL allow Customers to spend accumulated points to unlock locked content (courses, chapters, exam sets)
2. WHEN a Customer requests to unlock content with points, THE Gamification_Engine SHALL verify the Customer has sufficient points before processing
3. IF the Customer has insufficient points, THEN THE Gamification_Engine SHALL display the points deficit and suggest activities to earn more points
4. WHEN an unlock is successful, THE Gamification_Engine SHALL deduct the points and grant permanent access to the unlocked content
5. THE Access_Control SHALL display the point cost for each locked content item
6. THE Gamification_Engine SHALL maintain a transaction history of all point earnings and expenditures per Customer

---

### Requirement 16: Leaderboard, Badge, và Level

**User Story:** As a Customer, I want to see my ranking on leaderboards, earn badges for achievements, and level up as I progress, so that I feel a sense of accomplishment and healthy competition.

#### Acceptance Criteria

1. THE Gamification_Engine SHALL calculate and display leaderboard rankings based on total points earned within configurable time periods (daily, weekly, monthly, all-time)
2. THE Gamification_Engine SHALL award badges when a Customer achieves specific milestones (complete a course, maintain a 7-day streak, score 100% on an exam)
3. THE Gamification_Engine SHALL define levels based on cumulative points with increasing thresholds for each level
4. WHEN a Customer earns a badge or levels up, THE Notification_Center SHALL send a congratulatory notification
5. THE Gamification_Engine SHALL display earned badges and current level on the Customer profile
6. THE Gamification_Engine SHALL allow Admin to configure badge criteria, level thresholds, and leaderboard time periods

---

### Requirement 17: Daily Mission

**User Story:** As a Customer, I want to receive daily missions with specific learning goals, so that I have clear objectives each day and earn bonus rewards for completing them.

#### Acceptance Criteria

1. THE Gamification_Engine SHALL generate a set of daily missions for each Customer at the start of each calendar day (00:00)
2. THE Gamification_Engine SHALL include varied mission types: complete a lesson, answer quiz questions correctly, study for a duration, review flashcards
3. WHEN a Customer completes a daily mission, THE Gamification_Engine SHALL award bonus points immediately
4. THE Gamification_Engine SHALL display active daily missions with progress indicators on the Customer dashboard
5. WHEN all daily missions are completed, THE Gamification_Engine SHALL award an additional completion bonus
6. IF a daily mission is not completed by end of day (23:59), THEN THE Gamification_Engine SHALL expire the mission without penalty

---

### Requirement 18: Learning Access Control

**User Story:** As an Admin, I want to control access to learning content at multiple levels (course, chapter, lesson, quiz, exam set), so that content can be monetized and unlocked through various mechanisms.

#### Acceptance Criteria

1. THE Access_Control SHALL support locking content at the following levels: course (môn), chapter (chương), lesson (bài), quiz, and exam set (bộ đề)
2. THE Access_Control SHALL support the following unlock mechanisms: points redemption, prerequisite completion, premium subscription, and role-based permission
3. WHEN a Customer attempts to access locked content, THE Access_Control SHALL display the lock status and available unlock methods
4. WHEN a prerequisite is completed, THE Access_Control SHALL automatically unlock the dependent content
5. THE Access_Control SHALL allow Admin to configure lock/unlock rules for each content item
6. WHILE a Customer has premium subscription active, THE Access_Control SHALL grant access to all premium-designated content

---

### Requirement 19: Learning Path

**User Story:** As an Admin, I want to design learning paths organized by certification, so that Customers can follow a structured progression toward their certification goals.

#### Acceptance Criteria

1. THE Learning_Path_Engine SHALL allow Admin to create learning paths as ordered sequences of courses, chapters, and exams
2. THE Learning_Path_Engine SHALL associate each learning path with one or more certifications
3. WHEN a Customer enrolls in a learning path, THE Learning_Path_Engine SHALL display the full path with steps marked as locked, current, or completed
4. WHEN a Customer completes a step in the learning path, THE Learning_Path_Engine SHALL automatically unlock the next step
5. THE Learning_Path_Engine SHALL calculate and display completion percentage for each enrolled learning path
6. THE Learning_Path_Engine SHALL allow multiple learning paths to share common courses or chapters
7. IF a Customer attempts to access a step that is not yet unlocked, THEN THE Learning_Path_Engine SHALL display the prerequisites required to unlock the step

---

### Requirement 20: User Management

**User Story:** As an Admin, I want to manage users, roles, groups, and permissions in a Keycloak-style interface, so that I can control who has access to what within the platform.

#### Acceptance Criteria

1. THE User_Manager SHALL support CRUD operations for users with attributes: username, email, full name, phone, avatar, status (active/inactive/locked)
2. THE User_Manager SHALL support the following predefined roles: Admin, Maker, Checker, Customer
3. THE User_Manager SHALL allow Admin to create groups and assign users to one or more groups
4. THE User_Manager SHALL support granular permissions assignable to roles and groups
5. WHEN an Admin creates or modifies a user account, THE User_Manager SHALL validate email uniqueness and enforce password complexity rules
6. THE User_Manager SHALL allow Admin to activate, deactivate, or lock user accounts
7. THE User_Manager SHALL support bulk user import via CSV file

---

### Requirement 21: Workflow Maker-Checker-Admin

**User Story:** As an Admin, I want a content approval workflow where Makers create content, Checkers review and approve, so that only quality-verified content is published to Customers.

#### Acceptance Criteria

1. WHEN a Maker submits content for review, THE Workflow_Engine SHALL change the content status to "Pending Review" and notify assigned Checkers
2. WHEN a Checker approves content, THE Workflow_Engine SHALL change the content status to "Published" and make the content visible to Customers
3. WHEN a Checker rejects content, THE Workflow_Engine SHALL change the content status to "Rejected", record the rejection reason, and notify the Maker
4. THE Workflow_Engine SHALL enforce that a Maker cannot approve their own content
5. THE Workflow_Engine SHALL maintain a complete status history for each content item (Created → Pending Review → Published/Rejected)
6. THE Workflow_Engine SHALL allow Admin to override any workflow state
7. WHILE content is in "Pending Review" status, THE Workflow_Engine SHALL prevent the content from being visible to Customers

---

### Requirement 22: Audit Log

**User Story:** As an Admin, I want a comprehensive audit log of all system actions, so that I can track who did what and when for security and compliance purposes.

#### Acceptance Criteria

1. THE Audit_Logger SHALL record all create, update, delete, and access operations with timestamp, user ID, action type, resource type, resource ID, and IP address
2. THE Audit_Logger SHALL record all authentication events (login, logout, failed login attempts)
3. THE Audit_Logger SHALL record all permission and role changes
4. WHEN an Admin views audit logs, THE Audit_Logger SHALL support filtering by date range, user, action type, and resource type
5. THE Audit_Logger SHALL support export of audit log data to CSV and Excel formats
6. THE Audit_Logger SHALL retain audit records for a minimum of 12 months
7. THE Audit_Logger SHALL prevent modification or deletion of audit records by any user including Admin

---

### Requirement 23: AI Configuration

**User Story:** As an Admin, I want to configure AI parameters and behavior, so that I can control how AI generates content, responds to chats, and processes documents.

#### Acceptance Criteria

1. THE Platform SHALL provide an AI Configuration interface accessible only to Admin
2. THE AI_Engine SHALL allow Admin to configure: AI model selection, temperature/creativity settings, maximum response length, and language preferences
3. WHEN Admin updates AI configuration, THE AI_Engine SHALL apply new settings to all subsequent AI operations
4. THE AI_Engine SHALL allow Admin to enable or disable specific AI features (chat, explain, quiz generation, slide generation, voice generation)
5. THE AI_Engine SHALL allow Admin to configure AI processing queue limits and priorities
6. IF AI service is unavailable, THEN THE AI_Engine SHALL display a maintenance message and queue requests for later processing

---

### Requirement 24: System Configuration

**User Story:** As an Admin, I want to configure system-wide settings including support email, branding, and operational parameters, so that I can customize the platform behavior without code changes.

#### Acceptance Criteria

1. THE Platform SHALL provide a System Configuration interface accessible only to Admin
2. THE Platform SHALL allow Admin to configure: support email address, platform name, logo, favicon, and color theme
3. WHEN Admin updates the support email, THE Support_Module SHALL reflect the new email across all display locations (Login, Footer, Profile, Error Page)
4. THE Platform SHALL allow Admin to configure: session timeout, maximum file upload size, allowed file types, and maintenance mode
5. WHEN Admin enables maintenance mode, THE Platform SHALL display a maintenance page to all non-Admin users
6. THE Platform SHALL validate all configuration changes before applying them

---

### Requirement 25: Admin Dashboard

**User Story:** As an Admin, I want a dashboard showing key performance indicators and platform analytics, so that I can monitor platform health and user engagement.

#### Acceptance Criteria

1. THE Dashboard_Module SHALL display the following KPIs for Admin: total users, active users (daily/weekly/monthly), new registrations, total courses, total exams
2. THE Dashboard_Module SHALL display learning analytics: average completion rate, average time per course, most popular courses, and exam pass rates
3. THE Dashboard_Module SHALL display gamification metrics: total points distributed, active streaks, leaderboard activity
4. THE Dashboard_Module SHALL support date range filtering for all metrics
5. THE Dashboard_Module SHALL refresh data at configurable intervals (minimum every 5 minutes)
6. THE Dashboard_Module SHALL support export of dashboard data to PDF and Excel formats

---

### Requirement 26: Customer Dashboard

**User Story:** As a Customer, I want a personalized dashboard showing my learning progress, streaks, points, and recent courses, so that I can quickly see my status and continue learning.

#### Acceptance Criteria

1. THE Dashboard_Module SHALL display the following for each Customer: current streak count, total points balance, current level, and active daily missions
2. THE Dashboard_Module SHALL display recently accessed courses with completion percentage and a "Tiếp tục học" (Continue Learning) button
3. THE Dashboard_Module SHALL display enrolled learning paths with completion percentage
4. THE Dashboard_Module SHALL display upcoming or overdue milestones from enrolled learning paths
5. THE Dashboard_Module SHALL display the Customer's position on the current leaderboard
6. WHEN a Customer clicks "Tiếp tục học" from the dashboard, THE Resume_Engine SHALL navigate to the last saved position in the selected course

---

### Requirement 27: Support Module

**User Story:** As a Customer, I want to easily find support contact information on key pages, so that I can get help when encountering issues with the platform.

#### Acceptance Criteria

1. THE Support_Module SHALL display the configured support email address on the following pages: Login, Footer (all pages), Profile, and Error Pages
2. WHEN Admin updates the support email in System Configuration, THE Support_Module SHALL update the display across all locations within 1 minute
3. THE Support_Module SHALL present the support email as a clickable mailto link
4. THE Support_Module SHALL display the support email consistently with the same styling across all display locations
5. IF no support email is configured, THEN THE Support_Module SHALL hide the support email section from all pages

---

### Requirement 28: Notification Center

**User Story:** As a Customer, I want to receive notifications about important events (badge earned, content unlocked, new courses, workflow status), so that I stay informed about platform activities relevant to me.

#### Acceptance Criteria

1. THE Notification_Center SHALL support the following notification types: achievement (badge, level up), content (new course, unlock), workflow (approval, rejection), and system (maintenance, updates)
2. WHEN a notification-triggering event occurs, THE Notification_Center SHALL deliver the notification within 30 seconds
3. THE Notification_Center SHALL display an unread notification count indicator in the navigation bar
4. WHEN a Customer opens the notification panel, THE Notification_Center SHALL display notifications in reverse chronological order with read/unread status
5. THE Notification_Center SHALL allow Customers to mark notifications as read individually or mark all as read
6. THE Notification_Center SHALL allow Admin to configure which notification types are enabled or disabled
7. THE Notification_Center SHALL retain notifications for a minimum of 90 days

---

### Requirement 29: AI Recommendation

**User Story:** As a Customer, I want to receive personalized course recommendations based on my learning history and preferences, so that I can discover relevant content aligned with my goals.

#### Acceptance Criteria

1. THE AI_Engine SHALL analyze Customer learning history, quiz performance, and enrolled paths to generate personalized course recommendations
2. THE AI_Engine SHALL display a minimum of 3 recommended courses on the Customer dashboard
3. WHEN a Customer completes a course, THE AI_Engine SHALL refresh recommendations within 24 hours
4. THE AI_Engine SHALL provide a brief explanation for each recommendation (e.g., "Based on your interest in Database Administration")
5. THE AI_Engine SHALL avoid recommending courses the Customer has already completed or is currently enrolled in
6. THE AI_Engine SHALL allow Customers to dismiss a recommendation with optional feedback

---

### Requirement 30: Reporting và Analytics

**User Story:** As an Admin, I want comprehensive reports and analytics about learning activities, exam performance, and user engagement, so that I can make data-driven decisions about content and platform improvements.

#### Acceptance Criteria

1. THE Report_Engine SHALL generate the following reports: user engagement (login frequency, session duration), learning completion rates, exam performance (pass/fail rates, score distributions), and gamification statistics
2. THE Report_Engine SHALL support filtering reports by date range, user group, course, and certification
3. THE Report_Engine SHALL support export of all reports to PDF, Excel, and CSV formats
4. THE Report_Engine SHALL generate scheduled reports (daily, weekly, monthly) and deliver them to configured Admin email addresses
5. WHEN an Admin requests a report, THE Report_Engine SHALL generate the report within 30 seconds for datasets up to 100,000 records
6. THE Report_Engine SHALL provide per-Customer analytics: learning time trends, quiz score progression, strengths and weaknesses by topic

---

### Requirement 31: Authentication và Authorization

**User Story:** As an Admin, I want the platform to support SSO/OIDC authentication and JWT-based authorization, so that users can securely access the system with industry-standard authentication protocols.

#### Acceptance Criteria

1. THE Auth_Module SHALL support authentication via SSO/OIDC protocol with configurable identity providers
2. THE Auth_Module SHALL issue JWT tokens upon successful authentication with configurable expiration time
3. THE Auth_Module SHALL validate JWT tokens on every API request and reject expired or invalid tokens
4. WHEN a JWT token is within 5 minutes of expiration, THE Auth_Module SHALL support token refresh without requiring re-authentication
5. THE Auth_Module SHALL enforce role-based access control where: Admin has full system access, Maker can create and edit content, Checker can approve and publish content, Customer can access learning and exam features
6. IF an authentication attempt fails 5 consecutive times, THEN THE Auth_Module SHALL lock the user account for 30 minutes
7. THE Auth_Module SHALL support session invalidation (logout from all devices) by Admin

---

### Requirement 32: API và Integration

**User Story:** As a system administrator, I want the platform to expose RESTful APIs with proper documentation, so that external systems can integrate with the platform.

#### Acceptance Criteria

1. THE Platform SHALL expose RESTful APIs for all platform operations following OpenAPI 3.0 specification
2. THE Platform SHALL require authentication (valid JWT token) for all API endpoints except public endpoints (login, health check)
3. THE Platform SHALL enforce rate limiting on API endpoints to prevent abuse (configurable requests per minute per user)
4. THE Platform SHALL return consistent error response format with error code, message, and timestamp for all API errors
5. WHEN an API receives invalid input, THE Platform SHALL return HTTP 400 with specific validation error messages
6. THE Platform SHALL support API versioning to enable backward-compatible evolution

---

### Requirement 33: Data Export

**User Story:** As an Admin, I want to export data from the platform in multiple formats, so that I can generate offline reports and integrate with external systems.

#### Acceptance Criteria

1. THE Platform SHALL support data export to PDF, Excel (.xlsx), and CSV formats
2. WHEN an Admin initiates a data export, THE Platform SHALL generate the file asynchronously and notify the Admin when ready for download
3. THE Platform SHALL support export of the following data: user lists, learning progress, exam results, audit logs, and analytics data
4. THE Platform SHALL apply role-based access control to exports (Customers can only export their own data)
5. IF an export file exceeds 50MB, THEN THE Platform SHALL compress the file before making it available for download
6. THE Platform SHALL retain exported files for download for 24 hours before automatic deletion

---

### Requirement 34: Responsive Design

**User Story:** As a Customer, I want to access the platform on desktop, tablet, and mobile devices, so that I can learn from any device at any time.

#### Acceptance Criteria

1. THE Platform SHALL render correctly on screen widths from 320px (mobile) to 2560px (large desktop)
2. THE Platform SHALL adapt layout and navigation for three breakpoints: mobile (320-767px), tablet (768-1023px), desktop (1024px and above)
3. WHILE accessing from a mobile device, THE Platform SHALL display a simplified navigation menu accessible via hamburger icon
4. THE Platform SHALL maintain full functionality (learning, quizzes, exams, flashcards) across all supported device sizes
5. THE Platform SHALL ensure touch-friendly interactive elements with minimum target size of 44x44 pixels on mobile devices
6. THE Platform SHALL optimize media loading for mobile connections by serving appropriately sized images

---

### Requirement 35: Data Backup và Recovery

**User Story:** As an Admin, I want automatic data backups with recovery capability, so that the platform can recover from data loss incidents with minimal impact.

#### Acceptance Criteria

1. THE Platform SHALL perform automated daily backups of all database and Object Storage data
2. THE Platform SHALL retain backups for a minimum of 30 days
3. THE Platform SHALL store backups in a geographically separate location from the primary data
4. WHEN an Admin initiates a restore, THE Platform SHALL restore data from a selected backup point within 4 hours
5. THE Platform SHALL verify backup integrity after each backup operation and alert Admin if verification fails
6. THE Platform SHALL support point-in-time recovery for database data

---

### Requirement 36: Certificate Management

**User Story:** As an Admin, I want to issue certificates to Customers who complete learning paths or pass certification exams, so that Customers have proof of their achievement.

#### Acceptance Criteria

1. WHEN a Customer completes all requirements of a learning path, THE Platform SHALL generate a digital certificate
2. THE Platform SHALL allow Admin to configure certificate templates with customizable fields (name, date, certification title, logo)
3. THE Platform SHALL assign a unique verification code to each issued certificate
4. WHEN a third party enters a verification code, THE Platform SHALL confirm the certificate's authenticity and display certificate details
5. THE Platform SHALL maintain a record of all issued certificates per Customer accessible from the Customer profile
6. THE Platform SHALL support certificate download in PDF format

---

### Requirement 37: Performance và Scalability

**User Story:** As a system administrator, I want the platform to meet performance targets under expected load, so that users experience responsive interactions.

#### Acceptance Criteria

1. THE Platform SHALL respond to API requests within 500ms for 95th percentile under normal load (up to 1000 concurrent users)
2. THE Platform SHALL support at least 1000 concurrent users without degradation in response time
3. THE Platform SHALL process AI tasks via an asynchronous queue to prevent blocking user interactions
4. THE Platform SHALL support horizontal scaling of application servers behind a load balancer
5. THE Platform SHALL cache frequently accessed content (course listings, leaderboard) with configurable TTL
6. IF the system detects load exceeding 80% capacity, THEN THE Platform SHALL trigger auto-scaling alerts to Admin

---

### Requirement 38: Multi-tenant Foundation

**User Story:** As a system administrator, I want the platform architecture to support multi-tenant expansion, so that the platform can serve multiple organizations in the future.

#### Acceptance Criteria

1. THE Platform SHALL isolate data by tenant identifier at the database level
2. THE Platform SHALL include a tenant context in all API requests and enforce data isolation
3. THE Platform SHALL support tenant-specific configuration (branding, features, user limits) without code changes
4. WHILE operating in single-tenant mode, THE Platform SHALL function with a default tenant configuration
5. THE Platform SHALL ensure that queries cannot access data belonging to a different tenant under any circumstances
6. THE Platform SHALL support tenant-specific admin accounts separate from system-level admin

---

### Requirement 39: Exam Import

**User Story:** As a Maker, I want to import exam questions from external files (Excel, CSV, Word), so that I can quickly populate the Question Bank from existing exam materials.

#### Acceptance Criteria

1. WHEN a Maker uploads an exam file (Excel, CSV, or Word format), THE Exam_Module SHALL parse the file and extract questions with answers, explanations, and metadata
2. THE Exam_Module SHALL provide a template file for each supported format with the required column/field structure
3. WHEN import parsing is complete, THE Exam_Module SHALL display a preview of extracted questions for Maker review before saving
4. IF the import file contains validation errors (missing required fields, invalid format), THEN THE Exam_Module SHALL display specific error messages with row/line numbers
5. WHEN a Maker confirms the import preview, THE Exam_Module SHALL save questions to the Question Bank with status "Draft" requiring Checker approval
6. THE Exam_Module SHALL support bulk import of up to 500 questions in a single file

---

### Requirement 40: Exam Analytics và Báo cáo

**User Story:** As an Admin, I want detailed analytics on exam performance including per-question analysis, so that I can identify difficult topics and improve exam quality.

#### Acceptance Criteria

1. THE Report_Engine SHALL calculate per-question statistics: correct answer rate, average time spent, discrimination index
2. THE Report_Engine SHALL identify questions with abnormal statistics (too easy, too hard, poor discrimination) and flag them for review
3. THE Report_Engine SHALL display exam-level statistics: average score, pass rate, score distribution, average completion time
4. THE Report_Engine SHALL generate per-Customer exam history with trend analysis (score improvement over time)
5. WHEN a Maker views question analytics, THE Report_Engine SHALL display the question alongside its statistics
6. THE Report_Engine SHALL support comparison of exam performance across different user groups and time periods

---

### Requirement 41: RBAC Permission Matrix

**User Story:** As an Admin, I want a clear permission matrix defining what each role can do within each module, so that access control is consistent and auditable.

#### Acceptance Criteria

1. THE User_Manager SHALL enforce the following Admin permissions: full access to all modules including user management, configuration, audit logs, and all content operations
2. THE User_Manager SHALL enforce the following Maker permissions: create and edit content (courses, lessons, questions, exams, flashcards), view own content status, access Media Library
3. THE User_Manager SHALL enforce the following Checker permissions: review and approve/reject content, publish approved content, view all content in review status
4. THE User_Manager SHALL enforce the following Customer permissions: access enrolled/unlocked learning content, take exams, view personal progress and history, manage bookmarks and notes, use AI chat and explain, redeem points
5. THE User_Manager SHALL deny access and display an "Unauthorized" message when a user attempts an operation outside their role permissions
6. THE User_Manager SHALL allow Admin to create custom roles with configurable permission sets beyond the four predefined roles


---

### Requirement 42: AI Chat Tìm kiếm Tài liệu Liên quan

**User Story:** As a Customer, I want to ask the AI Chat a knowledge question and receive references to related learning materials across the platform, so that I can discover relevant courses, lessons, and documents that help answer my question.

#### Acceptance Criteria

1. WHEN a Customer asks a knowledge question in the AI Chat interface, THE AI_Engine SHALL analyze the question context to identify key topics and concepts
2. WHEN the question context is identified, THE Search_Engine SHALL search across all platform learning materials (courses, lessons, slides, documents, exam questions) to find content related to the question topics
3. WHEN related materials are found, THE AI_Engine SHALL present a list of relevant document references alongside the AI answer, including material title, content type, and a relevance summary
4. WHEN a Customer clicks a referenced material in the AI Chat response, THE Learning_Module SHALL navigate directly to the corresponding content location within the platform
5. IF no related materials are found for a question, THEN THE AI_Engine SHALL inform the Customer that no matching materials are available and provide the AI-generated answer only
6. THE AI_Engine SHALL rank referenced materials by relevance score and display a maximum of 10 references per question
7. THE Search_Engine SHALL search across materials from ALL courses and subjects available on the platform, not limited to the Customer's currently enrolled courses
8. WHEN presenting references, THE AI_Engine SHALL indicate whether the referenced material is accessible (unlocked) or locked for the Customer
