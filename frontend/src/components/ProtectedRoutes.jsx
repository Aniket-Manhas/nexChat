import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoutes = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "var(--background)",
          color: "var(--muted-foreground)",
          gap: "8px",
          fontSize: "var(--text-sm)",
        }}
      >
        <Loader2 className="animate-spin" size={20} />
        <span>Authenticating...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;

