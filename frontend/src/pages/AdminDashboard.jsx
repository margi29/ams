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
	Legend,
	LineChart,
	Line
} from "recharts";
import { FiDatabase } from "react-icons/fi";
import { FaTools, FaClipboardList, FaBoxes } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import Table from "../components/Table";

const AdminDashboard = () => {
	const [assetStats, setAssetStats] = useState({
		total: 0,
		assigned: 0,
		maintenance: 0,
	});
	const [pendingRequests, setPendingRequests] = useState(0);
	const [recentActivity, setRecentActivity] = useState([]);
	const [assetDistribution, setAssetDistribution] = useState([]);
	const [requestTrends, setRequestTrends] = useState([]);

	// Improved action sentence generation
	const generateActionSentence = (entry) => {
		const { actionType, userName, userRole, assetName, assetIdNumber, assignedTo } = entry;
		
		// Ensure we have basic required information
		if (!actionType || !userName) {
			return "An action was performed.";
		}

		// Standardize some key variables
		const user = userName || "Unknown User";
		const role = userRole || "Unknown Role";
		const asset = assetName || "Unknown Asset";
		const assetId = assetIdNumber ? `(${assetIdNumber})` : "";
		const assignee = assignedTo || "No One";

		// Comprehensive action sentences
		switch (actionType) {
			case "Assigned":
				return role === "Admin"
					? `${user} (${role}) assigned ${asset} ${assetId} to ${assignee}.`
					: `${user} (${role}) was assigned ${asset} ${assetId}.`;
			
			case "Created":
				return `${user} (${role}) created the asset ${asset} ${assetId}.`;
			
			case "Updated":
				return `${user} (${role}) updated the details of asset ${asset} ${assetId}.`;
			
			case "Deleted":
				return `${user} (${role}) deleted the asset ${asset} ${assetId}.`;
			
			case "Scheduled for Maintenance":
				return `${user} (${role}) scheduled maintenance for ${asset} ${assetId}.`;
			
			case "Maintenance Completed":
				return `${user} (${role}) completed maintenance for ${asset} ${assetId}.`;
			
			case "Asset Requested":
				return `${user} (${role}) requested the asset ${asset} ${assetId}.`;
			
			case "Returned":
				return `${user} (${role}) returned the asset ${asset} ${assetId}.`;
			
			case "Maintenance Requested":
				return `${user} (${role}) reported an issue with ${asset} ${assetId}.`;
			
			default:
				return `${user} (${role}) performed action: ${actionType} on ${asset} ${assetId}.`;
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					console.error("No token found. Authentication required.");
					return;
				}
	
				const config = { headers: { Authorization: `Bearer ${token}` } };
	
				// Fetch Assets
				const assetsRes = await axios.get("http://localhost:3000/api/assets", config);
				const assets = Array.isArray(assetsRes.data) ? assetsRes.data : assetsRes.data.assets;
				if (!Array.isArray(assets)) throw new Error("Assets data is not an array!");
	
				// Group by Category
				const categoryCount = assets.reduce((acc, asset) => {
					const category = asset.category || "Unknown"; // Default if missing
					acc[category] = (acc[category] || 0) + 1;
					return acc;
				}, {});
	
				// Convert to array and sort by count
				let sortedCategories = Object.entries(categoryCount)
					.map(([category, count]) => ({ category, count }))
					.sort((a, b) => b.count - a.count); // Descending order
	
				// Get Top 3 + "Others"
				let topCategories = sortedCategories.slice(0, 3);
				let othersCount = sortedCategories.slice(3).reduce((sum, cat) => sum + cat.count, 0);
	
				if (othersCount > 0) {
					topCategories.push({ category: "Others", count: othersCount });
				}
	
				setAssetDistribution(topCategories);
	
				// Asset Summary
				const totalAssets = assets.length;
				const assignedAssets = assets.filter((asset) => asset.status === "Assigned").length;
				const maintenanceAssets = assets.filter((asset) => asset.status === "Under Maintenance").length;
	
				setAssetStats({ total: totalAssets, assigned: assignedAssets, maintenance: maintenanceAssets });

				// Fetch Asset History
				const historyRes = await axios.get("http://localhost:3000/api/history", config);
				const history = Array.isArray(historyRes.data) ? historyRes.data : historyRes.data.history;
				if (!Array.isArray(history)) throw new Error("History data is not an array!");
	
				// Sort by latest timestamp & get the most recent 5
				const sortedHistory = history
					.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort descending
					.slice(0, 5); // Get the latest 5 entries
	
				// Format for the table with sentence-based descriptions
				const formattedHistory = sortedHistory.map(entry => ({
					date: new Date(entry.timestamp).toLocaleString(),
					action: generateActionSentence(entry),
				}));
	
				setRecentActivity(formattedHistory);
	
				// Fetch Pending Requests
				const requestRes = await axios.get("http://localhost:3000/api/asset-requests", config);
				const requests = Array.isArray(requestRes.data) ? requestRes.data : requestRes.data.requests;
				if (!Array.isArray(requests)) throw new Error("Requests data is not an array!");
	
				const pendingCount = requests.filter(req => req.status === "Pending").length;
				setPendingRequests(pendingCount);

				// Generate Request Trends (Simulated Data for Line Graph)
				const currentDate = new Date();
				const requestTrendsData = [
					{ 
						date: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(), 
						assetRequests: Math.floor(Math.random() * 10), 
						maintenanceRequests: Math.floor(Math.random() * 5) 
					},
					{ 
						date: new Date(currentDate.getTime() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString(), 
						assetRequests: Math.floor(Math.random() * 10), 
						maintenanceRequests: Math.floor(Math.random() * 5) 
					},
					{ 
						date: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(), 
						assetRequests: Math.floor(Math.random() * 10), 
						maintenanceRequests: Math.floor(Math.random() * 5) 
					},
					{ 
						date: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(), 
						assetRequests: Math.floor(Math.random() * 10), 
						maintenanceRequests: Math.floor(Math.random() * 5) 
					},
					{ 
						date: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(), 
						assetRequests: Math.floor(Math.random() * 10), 
						maintenanceRequests: Math.floor(Math.random() * 5) 
					},
					{ 
						date: currentDate.toLocaleDateString(), 
						assetRequests: Math.floor(Math.random() * 10), 
						maintenanceRequests: Math.floor(Math.random() * 5) 
					}
				];
				setRequestTrends(requestTrendsData);
	
			} catch (error) {
				console.error("Error fetching dashboard data:", error.response?.data || error.message);
			}
		};
	
		fetchData();
	}, []);
	
	
	const tableColumns = [
		{ header: "Date", accessor: "date" },
		{ header: "Action", accessor: "action" },
	];

	// Pie Chart Data
	const pieData = [
		{ category: "Total Assets", value: assetStats.total, color: "#673AB7" },
		{ category: "Assigned Assets", value: assetStats.assigned, color: "#F88379" },
		{ category: "Pending Requests", value: pendingRequests, color: "#00B4D8" },
		{ category: "Under Maintenance", value: assetStats.maintenance, color: "#FFC107" },
	];

	return (
		<div className="flex flex-col mt-14 min-h-screen">
			<h1 className="text-4xl font-bold text-center text-gray-900">Admin Dashboard</h1>
			<h2 className="text-2xl text-center text-gray-600 mt-2">
				Monitor asset management, track usage, and oversee system activities efficiently
			</h2>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
				{pieData.map((card, index) => (
					<div
						key={index}
						className="bg-white shadow-xl p-6 rounded-xl flex items-center space-x-5 transition-all duration-200 hover:border-l-[6px]"
						style={{ borderColor: card.color }}
					>
						<div className="w-16 h-16 flex items-center justify-center rounded-full" style={{ backgroundColor: `${card.color}20` }}>
							{index === 0 ? <FiDatabase className="text-4xl" style={{ color: card.color }} /> :
								index === 1 ? <FaBoxes className="text-4xl" style={{ color: card.color }} /> :
								index === 2 ? <FaClipboardList className="text-4xl" style={{ color: card.color }} /> :
								<FaTools className="text-4xl" style={{ color: card.color }} />}
						</div>
						<div>
							<h3 className="text-lg font-semibold text-gray-800">{card.category}</h3>
							<p className="text-2xl font-bold text-gray-900">{card.value}</p>
						</div>
					</div>
				))}
			</div>

			{/* Donut Chart and Bar Chart Side by Side */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
				{/* Donut Chart */}
				<div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
					<h3 className="text-xl font-semibold text-gray-800 mb-4">Asset Summary</h3>
					<ResponsiveContainer width="100%" height={350}>
						<PieChart>
							<Pie
								data={pieData}
								dataKey="value"
								nameKey="category"
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={90}
								label
							>
								{pieData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</div>

				{/* Bar Chart - Asset Distribution by Category */}
				<div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
					<h3 className="text-xl font-semibold text-gray-800 mb-4">Asset Distribution by Category</h3>
					<ResponsiveContainer width="100%" height={350}>
						<BarChart data={assetDistribution}>
							<XAxis dataKey="category" />
							<YAxis />
							<CartesianGrid strokeDasharray="3 3" />
							<Tooltip />
							<Legend />
							<Bar dataKey="count">
								{assetDistribution.map((_, index) => (
									<Cell key={`bar-${index}`} fill={["#673AB7", "#F88379", "#00B4D8", "#FFC107"][index % 4]} />
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Full-Width Line Chart */}
			<div className="w-full bg-white p-6 rounded-xl shadow-xl border border-gray-200 mt-6">
				<h3 className="text-xl font-semibold text-gray-800 mb-4">Request Trends</h3>
				<ResponsiveContainer width="100%" height={350}>
					<LineChart data={requestTrends}>
						<XAxis dataKey="date" />
						<YAxis />
						<CartesianGrid strokeDasharray="3 3" />
						<Tooltip />
						<Legend />
						<Line type="monotone" dataKey="assetRequests" stroke="#8884d8" name="Asset Requests" />
						<Line type="monotone" dataKey="maintenanceRequests" stroke="#82ca9d" name="Maintenance Requests" />
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