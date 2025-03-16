import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
	LineChart,
	Line,
	Legend,
	XAxis,
	YAxis,
	CartesianGrid,
	BarChart,
	Bar,
} from "recharts";
import { FiDatabase } from "react-icons/fi";
import { FaTools, FaClipboardList, FaBoxes } from "react-icons/fa";
import React from "react";
import Card from "../components/Card";
import Table from "../components/Table";

const AdminDashboard = () => {
	// Data matching summary cards
	const assetData = [
		{ category: "Total Assets", value: 120, color: "#673AB7" },
		{ category: "Assigned Assets", value: 80, color: "#F88379" },
		{ category: "Pending Requests", value: 25, color: "#00B4D8" },
		{ category: "Under Maintenance", value: 15, color: "#FFC107" },
	];

	// Monthly Asset Summary for Bar Chart
	const barChartData = [
		{ name: "Jan", assets: 100 },
		{ name: "Feb", assets: 110 },
		{ name: "Mar", assets: 120 },
		{ name: "Apr", assets: 130 },
	];

	// Line Chart Data (Trends)
	const lineChartData = [
		{ name: "Jan", total: 100, assigned: 70, pending: 20, maintenance: 10 },
		{ name: "Feb", total: 110, assigned: 75, pending: 22, maintenance: 12 },
		{ name: "Mar", total: 120, assigned: 80, pending: 25, maintenance: 15 },
		{ name: "Apr", total: 130, assigned: 85, pending: 28, maintenance: 18 },
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
		<div className="flex flex-col mt-14 min-h-screen">
			<h1 className="text-4xl font-bold text-center text-gray-900">Admin Dashboard</h1>
			<h2 className="text-2xl text-center text-gray-600 mt-2">
				Monitor asset management, track usage, and oversee system activities efficiently
			</h2>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
				{[
					{ icon: FiDatabase, label: "Total Assets", value: 120, color: "#673AB7" },
					{ icon: FaBoxes, label: "Assigned Assets", value: 80, color: "#F88379" },
					{ icon: FaClipboardList, label: "Pending Requests", value: 25, color: "#00B4D8" },
					{ icon: FaTools, label: "Under Maintenance", value: 15, color: "#FFC107" },
				].map((card, index) => (
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

			{/* Donut Chart and Bar Chart SIDE BY SIDE */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
				{/* Donut Chart (Pie Chart) */}
				<div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
					<h3 className="text-xl font-semibold text-gray-800 mb-4">Asset Distribution</h3>
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

				{/* Bar Chart (Updated for Monthly Summary) */}
				<div className="bg-white p-6 rounded-xl shadow-lg">
					<h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Asset Summary</h3>
					<ResponsiveContainer width="100%" height={350}>
						<BarChart data={barChartData}>
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Bar dataKey="assets">
								{barChartData.map((entry, index) => (
									<Cell key={`bar-${index}`} fill={["#673AB7", "#F88379", "#00B4D8", "#FFC107"][index]} />
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Line Chart Below */}
			<div className="bg-white shadow-xl p-6 rounded-xl border border-gray-200 mt-6">
				<h3 className="text-xl font-semibold text-gray-800 mb-4">Asset Trends & Maintenance</h3>
				<ResponsiveContainer width="100%" height={350}>
					<LineChart data={lineChartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
						<CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
						<XAxis dataKey="name" tick={{ fill: "#888" }} />
						<YAxis tick={{ fill: "#888" }} />
						<Tooltip />
						<Legend />
						<Line type="monotone" dataKey="total" stroke="#673AB7" strokeWidth={2} dot={{ r: 4 }} />
						<Line type="monotone" dataKey="assigned" stroke="#F88379" strokeWidth={2} dot={{ r: 4 }} />
						<Line type="monotone" dataKey="pending" stroke="#00B4D8" strokeWidth={2} dot={{ r: 4 }} />
						<Line type="monotone" dataKey="maintenance" stroke="#FFC107" strokeWidth={2} dot={{ r: 4 }} />
					</LineChart>
				</ResponsiveContainer>
			</div>

			{/* Recent Activity Table */}
			<Card title="Recent Activity" className="bg-white p-6 rounded-xl shadow-lg mt-6">
				<Table columns={tableColumns} data={recentActivity} />
			</Card>
		</div>
	);
};

export default AdminDashboard;
