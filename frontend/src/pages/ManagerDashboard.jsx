import { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Legend,
  LineChart, Line, AreaChart, Area
} from "recharts";

const data = [
  { name: "Total Assigned Assets", value: 85, color: "#3A6D8C" },
  { name: "Pending Approvals", value: 10, color: "#6A9AB0" },
  { name: "Returned Assets", value: 12, color: "#5C7D8A" },
  { name: "Under Review", value: 5, color: "#001F3F" },
];

const ManagerDashboard = () => {
  return (
    <div className="h-screen w-90vh overflow-y-auto bg-gray-100 pt-24 px-6">
      {/* Dashboard Container */}
      <div className="max-w-[1200px] mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-300">
        
        {/* Welcome Message */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Welcome to the Manager Dashboard</h1>
          <p className="text-lg mt-2 text-gray-600">
            Monitor assigned assets, approvals, and system usage for better oversight.
          </p>
        </div>

        {/* Dashboard Header */}
        <h2 className="text-2xl font-medium mb-6 text-gray-800 text-center">Manager Dashboard</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg shadow text-white text-center"
              style={{ backgroundColor: item.color }}
            >
              <h3 className="text-lg font-medium">{item.name}</h3>
              <p className="text-2xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-2 gap-6">
          {/* Asset Distribution */}
          <div>
            <h3 className="text-xl font-medium mb-3 text-gray-800">Assigned Assets Overview</h3>
            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} dataKey="value" outerRadius={80} label>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Asset Requests Breakdown */}
          <div>
            <h3 className="text-xl font-medium mb-3 text-gray-800">Asset Requests Breakdown</h3>
            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value">
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* More Charts */}
        <div className="mt-8 grid grid-cols-2 gap-6">
          {/* Asset Growth */}
          <div>
            <h3 className="text-xl font-medium mb-3 text-gray-800">Asset Utilization Over Time</h3>
            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3A6D8C" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Asset Requests Over Time */}
          <div>
            <h3 className="text-xl font-medium mb-3 text-gray-800">Asset Requests Over Time</h3>
            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#6A9AB0" fill="#6A9AB0" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Approvals Table */}
        <div className="mt-8">
          <h3 className="text-xl font-medium mb-3 text-gray-800">Recent Asset Approvals</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#3A6D8C] text-white">
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Time</th>
                  <th className="p-3 border">Approval Status</th>
                  <th className="p-3 border">Employee</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="p-3 border">2025-02-24</td>
                  <td className="p-3 border">11:00 AM</td>
                  <td className="p-3 border">Approved</td>
                  <td className="p-3 border">Jane Smith</td>
                </tr>
                <tr className="text-center">
                  <td className="p-3 border">2025-02-25</td>
                  <td className="p-3 border">09:30 AM</td>
                  <td className="p-3 border">Pending</td>
                  <td className="p-3 border">Michael Johnson</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManagerDashboard;
