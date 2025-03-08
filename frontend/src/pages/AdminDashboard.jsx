import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Legend, CartesianGrid } from "recharts";
import { FiDatabase } from "react-icons/fi";
import { FaTools, FaClipboardList, FaBoxes } from "react-icons/fa";
import React from "react";

const AdminDashboard = () => {
  const assetData = [
    { category: "Laptops", value: 50, color: "#673AB7" },
    { category: "Desktops", value: 30, color: "#F88379" },
    { category: "Printers", value: 20, color: "#00B4D8" },
    { category: "Routers", value: 15, color: "#FFC107" },
  ];

  const barChartData = [
    { name: "Jan", assets: 40, assigned: 20, maintenance: 5 },
    { name: "Feb", assets: 50, assigned: 30, maintenance: 8 },
    { name: "Mar", assets: 55, assigned: 35, maintenance: 10 },
    { name: "Apr", assets: 70, assigned: 50, maintenance: 12 },
  ];

  const recentActivity = [
    { date: "2025-03-07", action: "Laptop assigned to John Doe" },
    { date: "2025-03-06", action: "Printer sent for maintenance" },
    { date: "2025-03-05", action: "New router added to inventory" },
    { date: "2025-03-04", action: "Desktop assigned to Jane Smith" },
  ];

  return (
    <div className="flex flex-col p-6 mt-16 bg-white min-h-screen">
      <h1 className="text-2xl font-semibold text-[#F88379]">Welcome, Admin!</h1>
      <h2 className="text-xl font-semibold text-[#F88379] mt-2">Admin Dashboard</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        {[
          { icon: FiDatabase, label: "Total Assets", value: 120, color: "#673AB7" },
          { icon: FaBoxes, label: "Assigned Assets", value: 80, color: "#F88379" },
          { icon: FaClipboardList, label: "Pending Requests", value: 25, color: "#00B4D8" },
          { icon: FaTools, label: "Under Maintenance", value: 15, color: "#FFC107" },
        ].map((card, index) => (
          <div key={index} className="bg-white shadow-lg p-6 rounded-lg flex items-center space-x-4 border-l-4" style={{ borderColor: card.color }}>
            {React.createElement(card.icon, { className: "text-3xl", style: { color: card.color } })}
            <div>
              <h3 className="text-lg font-semibold">{card.label}</h3>
              <p className="text-xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-[#673AB7]">Asset Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={assetData} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={70} outerRadius={100} label>
                {assetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-[#00B4D8]">Asset Trends & Maintenance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="assets" stroke="#673AB7" />
              <Line type="monotone" dataKey="assigned" stroke="#F88379" />
              <Line type="monotone" dataKey="maintenance" stroke="#FFC107" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow-lg p-6 rounded-lg mt-6">
        <h2 className="text-lg font-semibold mb-4 text-[#F88379]">Recent Activity</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white">
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{item.date}</td>
                <td className="p-3">{item.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
