import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { FiDatabase } from "react-icons/fi";
import { FaTools, FaClipboardList, FaBoxes } from "react-icons/fa";
import React from "react";
import Card from "../components/Card";
import Table from "../components/Table"; // Updated Table import

const AdminDashboard = () => {
  const assetData = [
    { category: "Laptops", value: 50, color: "#673AB7" },
    { category: "Desktops", value: 30, color: "#F88379" },
    { category: "Printers", value: 20, color: "#00B4D8" },
    { category: "Routers", value: 15, color: "#FFC107" },
  ];

  const barChartData = [
    { category: "Total Assets", value: 120, color: "#673AB7" },
    { category: "Assigned Assets", value: 80, color: "#F88379" },
    { category: "Pending Requests", value: 25, color: "#00B4D8" },
    { category: "Under Maintenance", value: 15, color: "#FFC107" },
  ];

  const lineChartData = [
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

  const tableColumns = [
    { header: "Date", accessor: "date" },
    { header: "Action", accessor: "action" },
  ];

  return (
    <div className="flex flex-col p-6 mt-25 bg-white min-h-screen">
      <h1 className="text-4xl font-semibold text-center [var(--primary-dark)]">Welcome to the Admin Dashboard</h1>
      <h2 className="text-xl font-semibold text-center text-[var(--primary-dark)] mt-2"> Monitor asset management, track usage, and oversee system activities efficiently</h2>

      {/* 🔹 Summary Cards */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
  {[
    { icon: FiDatabase, label: "Total Assets", value: 120, color: "#673AB7" },
    { icon: FaBoxes, label: "Assigned Assets", value: 80, color: "#F88379" },
    { icon: FaClipboardList, label: "Pending Requests", value: 25, color: "#00B4D8" },
    { icon: FaTools, label: "Under Maintenance", value: 15, color: "#FFC107" },
  ].map((card, index) => (
    <div
      key={index}
      className="bg-white shadow-xl p-6 rounded-lg flex items-center space-x-4 relative transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
    >
      <div className="absolute top-0 left-0 h-full w-1" style={{ backgroundColor: card.color }}></div>
      <card.icon className="text-3xl" style={{ color: card.color }} />
      <div>
        <h3 className="text-lg font-semibold">{card.label}</h3>
        <p className="text-xl font-bold">{card.value}</p>
      </div>
    </div>
  ))}
</div>

      {/* 🔹 Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card title="Asset Distribution" className="text-purple-900">
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
        </Card>

        <Card title="Asset Overview (Bar Chart)" className="text-purple-900">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#673AB7">
                {barChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Asset Trends & Maintenance (Line Chart)" className="mt-6 text-purple-900">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="assets" stroke="#673AB7" strokeWidth={2} />
            <Line type="monotone" dataKey="assigned" stroke="#F88379" strokeWidth={2} />
            <Line type="monotone" dataKey="maintenance" stroke="#FFC107" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* 🔹 Recent Activity Table (Updated with new UI) */}
      <Card title="Recent Activity" className="mt-6 text-[#000000]">
        <Table columns={tableColumns} data={recentActivity} />
      </Card>
    </div>
  );
};

export default AdminDashboard;
