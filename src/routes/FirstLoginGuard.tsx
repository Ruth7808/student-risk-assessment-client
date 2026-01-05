import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const FirstLoginGuard = () => {
  const user = useAppSelector((s) => s.auth.user);
  const location = useLocation();

  // אם אין user עדיין, לא מתערבים כאן (ProtectedRoute כבר מטפל)
  if (!user) return <Outlet />;

  const isForceRoute = location.pathname === "/force-password-change";

  if (user.isFirstLogin && !isForceRoute) {
    return <Navigate to="/force-password-change" replace />;
  }

  // אם כבר לא first login, לא נותנים להישאר במסך החלפת סיסמה
  if (!user.isFirstLogin && isForceRoute) {
    // אפשר להפנות לדף לפי role
    const target =
      user.role === "admin" ? "/admin" : user.role === "principal" ? "/principal" : "/teacher";
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
};

export default FirstLoginGuard;
