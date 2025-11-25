import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import LoginPage from '@pages/auth/pages/LoginPage';
import ProjectsListPage from '@pages/projects/pages/ProjectsListPage';
import ProjectDetailsPage from '@pages/projects/pages/ProjectDetailsPage';
import MembersPage from '@pages/projects/pages/MembersPage';
import SprintBoardPage from '@pages/sprints/pages/SprintBoardPage';
import IssueDetailsPage from '@pages/issues/pages/IssueDetailsPage';
import NotFoundPage from '@pages/notfound/pages/NotFoundPage';
import { AuthProvider } from '@contexts/AuthContext';
import TicketDashboardPage from '@pages/tickets/pages/TicketDashboardPage';
import TicketDetailPage from '@pages/tickets/pages/TicketDetailPage';
import TicketSubmitPage from '@pages/tickets/pages/TicketSubmitPage';

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
              <Route path="/projects/:projectId/feedback" element={<TicketDashboardPage />} />
              <Route path="/projects/:projectId/feedback/submit" element={<TicketSubmitPage />} />
              <Route path="/projects/:projectId/feedback/:ticketId" element={<TicketDetailPage />} />
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