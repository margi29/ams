import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import NotFound from "./pages/NotFound";
import "./styles/global.css";
import "./App.css";

const Layout = ({ children }) => {
  const location = useLocation();
  const showSidebar = location.pathname.startsWith("/admin") || location.pathname.startsWith("/manager") || location.pathname.startsWith("/employee");

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        {showSidebar && <Sidebar />}
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};


const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app-container">
              <Navbar />
              <div className="login-container">
                <LoginPage />
              </div>
            </div>
          }
        />
        <Route path="/admin/*" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/manager/*" element={<Layout><ManagerDashboard /></Layout>} />
        <Route path="/employee/*" element={<Layout><EmployeeDashboard /></Layout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
