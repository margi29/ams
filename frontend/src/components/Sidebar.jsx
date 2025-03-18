import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Home, Settings, User, Package, QrCode, Wrench, LogOut } from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.pathname.split("/")[1];

  const toggleSubMenu = (label) => {
    setIsOpen(true);
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  const handleSidebarToggle = () => {
    setIsOpen((prev) => {
      if (prev) setOpenMenu(null);
      return !prev;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onLogout = () => navigate("/");

  const menuItems = {
    admin: [
      { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
      {
        icon: Package, label: "Assets Management",
        subItems: [
          { name: "All Assets", path: "/admin/assets" },
          { name: "Add New Asset", path: "/admin/add-asset" },
          { name: "Asset History", path: "/admin/history" }
        ]
      },
      {
        icon: User, label: "Asset Allocation",
        subItems: [
          { name: "Assign Asset", path: "/admin/assign-asset" },
          { name: "Returned Asset", path: "/admin/return-asset" },
          { name: "Asset Requests", path: "/admin/asset-requests" }
        ]
      },
      { icon: QrCode, label: "QR Code List", path: "/admin/qr-logs" },
      { icon: Wrench, label: "Maintenance & Repair", path: "/admin/scheduled-maintenance" },
      { icon: User, label: "User Management", path: "/admin/user-management" },
      { icon: Settings, label: "Settings", path: "/admin/settings" }
    ],
    
    employee: [
      { icon: Home, label: "Dashboard", path: "/employee/dashboard" },
      {
        icon: Package, label: "My Assets",
        subItems: [
          { name: "View My Assets", path: "/employee/view-my-asset" },
          { name: "Return Request", path: "/employee/return-request" },
          { name: "Maintenance Request", path: "/employee/maintenance-request"}
        ]
      },
      {
        icon: Package, label: "Request Asset",
        subItems: [
          { name: "Request New Asset", path:"/employee/request-new-asset" },
          { name: "View Request Status", path: "/employee/view-requests" }
        ]
      },
      {
        icon: Settings, label: "Help & Support",
        subItems: [
          { name: "Guidelines", path: "/employee/guidelines" },
          { name: "Contact Admin", path: "/employee/contact-support" }
        ]
      }
    ]
  };

  return (
    <div className="flex h-screen relative">
      <div
  ref={sidebarRef}
  className={`h-screen bg-[#302757] text-white flex flex-col transition-all duration-500 fixed top-16 left-0 
    ${isOpen ? "w-65" : "w-15"} 
    max-h-[calc(100vh-64px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 shadow-lg`}
>

        <button className="mt-4 ml-2 p-2 text-white" onClick={handleSidebarToggle}>
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
        <nav className="flex-1 pt-4 pb-2">
          <ul className="p-0 m-0 list-none">
            {menuItems[role]?.map((item, index) => {
              const isActive = location.pathname === item.path || 
                (item.subItems && item.subItems.some(subItem => location.pathname === subItem.path));

              return (
                <li key={index} className="cursor-pointer ml-1 mb-2">
                  <div
                    className={`flex justify-between rounded-md p-3 items-center transition-all
                      ${isActive ? "bg-[#4D3F8C]" : "hover:bg-[#4D3F8C]"}`}
                    onClick={() => toggleSubMenu(item.label)}
                  >
                    <Link to={item.path || "#"} className="flex gap-3 items-center w-full">
                      {item.icon && <item.icon size={24} />}
                      {isOpen && item.label}
                    </Link>
                    {item.subItems && isOpen && (
                      <ChevronDown size={18} className={`${openMenu === item.label ? "rotate-180" : ""}`} />
                    )}
                  </div>
                  {item.subItems && openMenu === item.label && isOpen && (
                    <ul className="ml-5 mt-2 list-none">
                      {item.subItems.map((subItem, subIndex) => {
                        const isSubActive = location.pathname === subItem.path;
                        return (
                          <li
                            key={subIndex}
                            className={`text-gray-100 p-2 m-2 rounded-md cursor-pointer transition-all 
                              ${isSubActive ? "bg-[#5A4A99]" : "hover:bg-[#4D3F8C]"}`}
                          >
                            <Link to={subItem.path}>{subItem.name}</Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-auto pb-4">
          <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-100">
            <LogOut size={24} /> {isOpen && "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
