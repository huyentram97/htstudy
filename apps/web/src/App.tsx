import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));

// Customer pages
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const CoursesPage = lazy(() => import('./pages/courses/CoursesPage'));
const CourseDetailPage = lazy(() => import('./pages/courses/CourseDetailPage'));
const LessonViewerPage = lazy(() => import('./pages/courses/LessonViewerPage'));
const ExamsPage = lazy(() => import('./pages/exams/ExamsPage'));
const ExamTakingPage = lazy(() => import('./pages/exams/ExamTakingPage'));
const FlashcardStudyPage = lazy(() => import('./pages/exams/FlashcardStudyPage'));
const AIChatPage = lazy(() => import('./pages/ai/AIChatPage'));
const LeaderboardPage = lazy(() => import('./pages/leaderboard/LeaderboardPage'));
const LearningPathPage = lazy(() => import('./pages/learning-path/LearningPathPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'));
const ContentManagementPage = lazy(() => import('./pages/admin/ContentManagementPage'));
const SystemConfigPage = lazy(() => import('./pages/admin/SystemConfigPage'));
const AuditLogPage = lazy(() => import('./pages/admin/AuditLogPage'));
const RolePermissionPage = lazy(() => import('./pages/admin/RolePermissionPage'));
const ExamManagementPage = lazy(() => import('./pages/admin/ExamManagementPage'));
const LearningPathManagementPage = lazy(() => import('./pages/admin/LearningPathManagementPage'));
const CourseEditPage = lazy(() => import('./pages/admin/CourseEditPage'));

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" tip="Đang tải..." />
  </div>
);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/content" element={<ContentManagementPage />} />
          <Route path="/admin/courses/new" element={<CourseEditPage />} />
          <Route path="/admin/courses/:id" element={<CourseEditPage />} />
          <Route path="/admin/config" element={<SystemConfigPage />} />
          <Route path="/admin/audit" element={<AuditLogPage />} />
          <Route path="/admin/roles" element={<RolePermissionPage />} />
          <Route path="/admin/exams" element={<ExamManagementPage />} />
          <Route path="/admin/learning-paths" element={<LearningPathManagementPage />} />
        </Route>

        {/* Customer */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonViewerPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/exams/:id/take" element={<ExamTakingPage />} />
          <Route path="/exams/flashcard/:setId" element={<FlashcardStudyPage />} />
          <Route path="/ai-chat" element={<AIChatPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/learning-paths" element={<LearningPathPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
