import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
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

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="app-container">
      <Navbar />
      <div className="flex main-coontent">
        {showSidebar && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>}
        <div className={`flex-1 transition-all duration-500 ${isOpen ? "ml-64" : "ml-16"}`}>{children}</div>
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
