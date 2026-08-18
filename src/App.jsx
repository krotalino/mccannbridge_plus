import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import TrafficIAPage from './pages/TrafficIA/TrafficIAPage';
import BriefsPage from './pages/Briefs/BriefsPage';
import CalendarPage from './pages/Calendar/CalendarPage';
import ValidationPage from './pages/Validation/ValidationPage';
import InfluencePage from './pages/Influence/InfluencePage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import FinancePage from './pages/Finance/FinancePage';

import UsersPage from './pages/Users/UsersPage';

import ReportsPage from './pages/Reports/ReportsPage';
import DocumentsPage from './pages/Documents/DocumentsPage';
import TasksPage from './pages/Tasks/TasksPage';
import GrowthPage from './pages/Growth/GrowthPage';
function ProtectedRoutes() {
  const { isAuthenticated, isAgency } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <AppProvider>
      <Routes>
        <Route element={<DashboardLayout />}>
          {isAgency && <Route path="/traffic" element={<TrafficIAPage />} />}
          <Route path="/briefs" element={<BriefsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/validation" element={<ValidationPage />} />
          <Route path="/influence" element={<InfluencePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/finance" element={<FinancePage />} />

          {isAgency && <Route path="/users" element={<UsersPage />} />}

          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          {isAgency && <Route path="/growth" element={<GrowthPage />} />}
          <Route path="*" element={<Navigate to={isAgency ? "/traffic" : "/briefs"} replace />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
