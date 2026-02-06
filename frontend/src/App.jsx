import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import IssueDetailPage from "./pages/IssueDetailPage";
import IssueFormPage from "./pages/IssueFormPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="issues/new" element={<IssueFormPage />} />
        <Route path="issues/:id" element={<IssueDetailPage />} />
        <Route path="issues/:id/edit" element={<IssueFormPage />} />
      </Route>
    </Routes>
  );
}
