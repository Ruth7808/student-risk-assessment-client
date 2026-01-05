import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../features/auth/components/LoginPage";
import RegisterPage from "../features/auth/components/RegisterPage";

import AdminDashboard from "../features/admin/components/AdminDashboard";
import PrincipalDashboard from "../features/admin/components/PrincipalDashboard";
import TeacherDashboard from "../features/admin/components/TeacherDashboard";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import ForcePasswordChangePage from "../features/auth/components/ForcePasswordChangePage";
import FirstLoginGuard from "./FirstLoginGuard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<FirstLoginGuard />}>

          <Route path="/force-password-change" element={<ForcePasswordChangePage />} />
          {/* Register – רק admin / principal */}
          <Route element={<RoleRoute allowedRoles={["admin", "principal"]} />}>
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Admin */}
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Principal */}
          <Route element={<RoleRoute allowedRoles={["principal"]} />}>
            <Route path="/principal" element={<PrincipalDashboard />} />
          </Route>

          {/* Teacher */}
          <Route element={<RoleRoute allowedRoles={["teacher"]} />}>
            <Route path="/teacher" element={<TeacherDashboard />} />
          </Route>
        </Route>
      </Route>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
};

export default AppRoutes;
