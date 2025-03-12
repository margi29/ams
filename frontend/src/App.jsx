import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AllAssets from "./dashboard/Admin/AllAssets";
import AddNewAsset from "./dashboard/Admin/AddNewAsset";
import AssetHistory from "./dashboard/Admin/AssetHistory";
import AssignAsset from "./dashboard/Admin/AssignAsset";
import AssetRequests from "./dashboard/Admin/AssetRequests";
import MaintenanceAndRepair from "./dashboard/Admin/MaintenanceAndRepair";
import RequestRepair from "./dashboard/Admin/RequestRepair";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import NotFound from "./pages/NotFound";
import "./styles/global.css";
import "./App.css";
import UserManagement from "./dashboard/Admin/UserManagement";
import ReturnAsset from "./dashboard/Admin/ReturnAsset";

const Layout = ({ children }) => {
  const location = useLocation();
  const showSidebar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/manager") ||
    location.pathname.startsWith("/employee");

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="app-container">
      <Navbar />
      <div className="flex main-content">
        {showSidebar && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />}
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
        <Route path="/admin/assets" element={<Layout><AllAssets /></Layout>} />
        <Route path="/admin/add-asset" element={<Layout><AddNewAsset /></Layout>} />
        <Route path="/admin/history" element={<Layout><AssetHistory /></Layout>} />
        <Route path="/admin/assign-asset" element={<Layout><AssignAsset /></Layout>} />
        <Route path="/admin/return-asset" element={<Layout><ReturnAsset /></Layout>} />
        <Route path="/admin/asset-requests" element={<Layout><AssetRequests /></Layout>} />
        <Route path="/admin/scheduled-maintenance" element={<Layout><MaintenanceAndRepair /></Layout>} />
        <Route path="/admin/request-repair" element={<Layout><RequestRepair /></Layout>} />
        <Route path="/admin/user-management" element={<Layout><UserManagement /></Layout>} />
        <Route path="/manager/*" element={<Layout><ManagerDashboard /></Layout>} />
        <Route path="/employee/*" element={<Layout><EmployeeDashboard /></Layout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
