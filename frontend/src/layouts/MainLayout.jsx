import { Outlet, Link, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      {/* Sidebar Navigation */}
      <aside style={{ width: "260px", background: "#2c3e50", color: "#fff", padding: "1rem", display: "flex", flexDirection: "column" }}>
        <h2>💬 ChatApp</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "2rem", flexGrow: 1 }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>🏠 Home / Dashboard</Link>
          <Link to="/chat/general" style={{ color: "#fff", textDecoration: "none" }}># general</Link>
          <Link to="/chat/random" style={{ color: "#fff", textDecoration: "none" }}># random</Link>
        </nav>
        <button onClick={handleLogout} style={{ padding: "8px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Log Out
        </button>
      </aside>

      {/* Main Chat Content Area */}
      <main style={{ flexGrow: 1, display: "flex", flexDirection: "column", background: "#ecf0f1" }}>
        {/* Active chat views (Home or ChatRoom) will render here via Outlet */}
        <Outlet />
      </main>
    </div>
  );
}
