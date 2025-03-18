import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { FiDatabase } from "react-icons/fi";
import { FaThumbsUp, FaClipboardList, FaTimesCircle } from "react-icons/fa";
import Table from "../components/Table";
import Card from "../components/Card";

const EmployeeDashboard = () => {
  const assetData = [
    { category: "Laptops", value: 10, color: "#673AB7" },
    { category: "Desktops", value: 5, color: "#F88379" },
    { category: "Printers", value: 3, color: "#00B4D8" },
    { category: "Routers", value: 2, color: "#FFC107" },
  ];

  const recentActivity = [
    { date: "2025-03-07", action: "Laptop request approved" },
    { date: "2025-03-06", action: "Printer request pending" },
    { date: "2025-03-05", action: "Desktop assigned" },
    { date: "2025-03-04", action: "Router request rejected" },
  ];

  const tableColumns = [
    { header: "Date", accessor: "date" },
    { header: "Action", accessor: "action" },
  ];

  const summaryCards = [
    { icon: FiDatabase, label: "Assigned Assets", value: 10, color: "#673AB7" },
    { icon: FaClipboardList, label: "Pending Requests", value: 5, color: "#00B4D8" },
    { icon: FaThumbsUp, label: "Approved Requests", value: 8, color: "#4CAF50" },
    { icon: FaTimesCircle, label: "Rejected Requests", value: 2, color: "#F44336" },
  ];

  const employeeAssetData = [
    { month: "Jan", assigned: 3 },
    { month: "Feb", assigned: 5 },
    { month: "Mar", assigned: 7 },
    { month: "Apr", assigned: 8 },
    { month: "May", assigned: 6 },
    { month: "Jun", assigned: 9 },
  ];

  return (
    <div className="flex flex-col p-6 mt-25 bg-white min-h-screen">
      <h1 className="text-4xl font-semibold text-center [var(--primary-dark)]">Welcome to the Employee Dashboard</h1>
      <h2 className="text-xl font-semibold text-center text-[var(--primary-dark)] mt-2"> Track your asset requests, assignments, and history</h2>

      {/* 🔹 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        {summaryCards.map((card, index) => (
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

      {/* 🔹 Data Visualization Chart */}
      <Card title="Assigned Asset Category" className="mt-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={assetData} dataKey="value" nameKey="category" outerRadius={120} label>
              {assetData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* 🔹 Employee Asset Assignment Chart */}
      <Card title="Employee Asset Assignment Over Time" className="mt-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={employeeAssetData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="assigned" stroke="#673AB7" name="Assigned Assets" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* 🔹 Recent Activity Table */}
      <Card title="Recent Activity" className="mt-6 text-[#000000]">
        <Table columns={tableColumns} data={recentActivity} />
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
