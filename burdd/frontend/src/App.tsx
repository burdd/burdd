import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '@components/layout/AppLayout';
import RequireAuth from '@components/auth/RequireAuth';
import LoginPage from '@features/auth/pages/LoginPage';
import ProjectsListPage from '@features/projects/pages/ProjectsListPage';
import ProjectDetailsPage from '@features/projects/pages/ProjectDetailsPage';
import SprintBoardPage from '@features/sprints/pages/SprintBoardPage';
import IssueDetailsPage from '@features/issues/pages/IssueDetailsPage';
import TicketTriagePage from '@features/tickets/pages/TicketTriagePage';
import NotFoundPage from './pages/NotFoundPage';
import { ApiProvider } from '@contexts/ApiContext';
import { AuthProvider } from '@contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <ApiProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<RequireAuth />}>
              <Route element={<AppLayout />}>
                <Route index element={<Navigate to="/projects" replace />} />
                <Route path="/projects" element={<ProjectsListPage />} />
                <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
                <Route path="/sprints/:sprintId" element={<SprintBoardPage />} />
                <Route path="/issues/:issueId" element={<IssueDetailsPage />} />
                <Route path="/tickets/triage" element={<TicketTriagePage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ApiProvider>
    </AuthProvider>
  );
};

export default App;
