import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import type { UserRole } from "../features/auth/authSlice";

type Props = {
  allowedRoles: UserRole[];
};

const RoleRoute = ({ allowedRoles }: Props) => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
