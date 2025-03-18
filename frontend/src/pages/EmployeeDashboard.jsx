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
import Card from "../components/Card";
import Table from "../components/Table";

const EmployeeDashboard = () => {
  const assetData = [
    { category: "Laptops", value: 10, color: "#673AB7" },
    { category: "Desktops", value: 5, color: "#F88379" },
    { category: "Printers", value: 3, color: "#00B4D8" },
    { category: "Routers", value: 2, color: "#FFC107" },
  ];

  const employeeAssetData = [
    { month: "Jan", assigned: 3 },
    { month: "Feb", assigned: 5 },
    { month: "Mar", assigned: 7 },
    { month: "Apr", assigned: 8 },
    { month: "May", assigned: 6 },
    { month: "Jun", assigned: 9 },
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

  return (
    <div className="flex flex-col mt-14 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-900">Employee Dashboard</h1>
      <h2 className="text-2xl text-center text-gray-600 mt-2">
        Track your asset requests, assignments, and history
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="bg-white shadow-xl p-6 rounded-xl flex items-center space-x-5 transition-all duration-200 hover:border-l-[6px]"
            style={{ borderColor: card.color }}
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full" style={{ backgroundColor: `${card.color}20` }}>
              <card.icon className="text-4xl" style={{ color: card.color }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{card.label}</h3>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Donut Chart (Pie Chart) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Assigned Asset Category</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie data={assetData} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={90} label>
                {assetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Employee Asset Assignment Over Time</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={employeeAssetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: "#888" }} />
              <YAxis tick={{ fill: "#888" }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="assigned" stroke="#673AB7" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table */}
      <Card title="Recent Activity" className="bg-white p-6 rounded-xl shadow-lg mt-6">
        <Table columns={tableColumns} data={recentActivity} />
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
