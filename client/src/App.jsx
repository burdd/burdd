import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '@components/layout/AppLayout';
import LoginPage from '@features/auth/pages/LoginPage';
import ProjectsListPage from '@features/projects/pages/ProjectsListPage';
import ProjectDetailsPage from '@features/projects/pages/ProjectDetailsPage';
import MembersPage from '@features/projects/pages/MembersPage';
import SprintBoardPage from '@features/sprints/pages/SprintBoardPage';
import IssueDetailsPage from '@features/issues/pages/IssueDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from '@contexts/AuthContext';
import FeedbackDashboardPage from '@features/feedback/pages/FeedbackDashboardPage';
import FeedbackDetailPage from '@features/feedback/pages/FeedbackDetailPage';
import FeedbackSubmitPage from '@features/feedback/pages/FeedbackSubmitPage';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/projects" replace />} />
              <Route path="/projects" element={<ProjectsListPage />} />
              <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
              <Route path="/projects/:projectId/members" element={<MembersPage />} />
              <Route path="/projects/:projectId/feedback" element={<FeedbackDashboardPage />} />
              <Route path="/projects/:projectId/feedback/submit" element={<FeedbackSubmitPage />} />
              <Route path="/projects/:projectId/feedback/:ticketId" element={<FeedbackDetailPage />} />
              <Route path="/sprints/:sprintId" element={<SprintBoardPage />} />
              <Route path="/issues/:issueId" element={<IssueDetailsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;