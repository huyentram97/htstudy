import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

// Lazy load pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const CoursesPage = lazy(() => import('./pages/courses/CoursesPage'));
const CourseDetailPage = lazy(() => import('./pages/courses/CourseDetailPage'));
const ExamsPage = lazy(() => import('./pages/exams/ExamsPage'));
const AIChatPage = lazy(() => import('./pages/ai/AIChatPage'));
const LeaderboardPage = lazy(() => import('./pages/leaderboard/LeaderboardPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'));
const ContentManagementPage = lazy(() => import('./pages/admin/ContentManagementPage'));
const SystemConfigPage = lazy(() => import('./pages/admin/SystemConfigPage'));
const AuditLogPage = lazy(() => import('./pages/admin/AuditLogPage'));

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" tip="Đang tải..." />
  </div>
);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/content" element={<ContentManagementPage />} />
          <Route path="/admin/config" element={<SystemConfigPage />} />
          <Route path="/admin/audit" element={<AuditLogPage />} />
        </Route>

        {/* Customer/Learning routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/ai-chat" element={<AIChatPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
