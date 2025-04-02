import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { FaThumbsUp, FaClipboardList, FaTimesCircle, FaBoxes, FaTools } from "react-icons/fa";
import Card from "../components/Card";
import Table from "../components/Table";
import { useAuth } from "../context/AuthContext"; // Adjust the import as needed


 // Ensure userId exists before making the request

const EmployeeDashboard = () => {
  const [assetData, setAssetData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [summary, setSummary] = useState({
    assignedAssets: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  });
  const { user } = useAuth();
    const userId = user?._id;

  useEffect(() => {
    
    const fetchEmployeeData = async () => {
      try {
        
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. User is not authenticated.");
          return;
        }

        const [assetsResponse, requestsResponse, historyResponse] = await Promise.all([
          axios.get("/api/assets/my-assets", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/asset-requests", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/history`, {  // Fetch only the logged-in employee's history
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        

        if (Array.isArray(assetsResponse.data)) {
          setAssetData(aggregateAssetData(assetsResponse.data));
          setSummary((prev) => ({ ...prev, assignedAssets: assetsResponse.data.length }));
          
          // Process asset assignment data for the timeline
          const assetTimelineData = formatAssignmentTimeline(assetsResponse.data);
          
          // If we have history data, create a comprehensive timeline
          if (Array.isArray(historyResponse.data)) {
            setLineChartData(createComprehensiveTimeline(assetTimelineData, historyResponse.data));
          } else {
            // Fallback to just assignment data if history isn't available
            setLineChartData(assetTimelineData);
          }
        }

        if (Array.isArray(requestsResponse.data)) {
          const counts = requestsResponse.data.reduce((acc, req) => {
            acc[req.status.toLowerCase()] = (acc[req.status.toLowerCase()] || 0) + 1;
            return acc;
          }, {});

          setSummary((prev) => ({
            ...prev,
            pendingRequests: counts["pending"] || 0,
            approvedRequests: counts["approved"] || 0,
            rejectedRequests: counts["rejected"] || 0,
          }));
        }

        if (Array.isArray(historyResponse.data)) {
          // Process activity data with formatted sentences and use toLocaleString for dates
          const processedActivity = historyResponse.data.map(entry => ({
            ...entry,
            formattedAction: generateActionSentence(entry),
            date: entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 
                  entry.date ? new Date(entry.date).toLocaleString() : 
                  "Unknown date"
          }));
          
          // Get only the 5 most recent activities
          setRecentActivity(processedActivity.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, []);

  const generateActionSentence = (entry) => {
    // Safely extract values with fallback
    const getNestedValue = (obj, path, defaultValue = '') => {
      return path.split('.').reduce((acc, part) => 
        acc && acc[part] !== undefined ? acc[part] : defaultValue, obj);
    };

    const actionType = entry.actionType || 'Unknown Action';
    const userName = getNestedValue(entry, 'userName', 'Unknown User');
    const userRole = getNestedValue(entry, 'userRole', 'Unknown Role');
    const assetName = getNestedValue(entry, 'assetName', 'Unknown Asset');
    const assetIdNumber = getNestedValue(entry, 'assetIdNumber', '');
    
    // Dynamically get assignedTo, checking multiple possible paths
    const assignedTo = 
      getNestedValue(entry, 'assignedTo.name') || 
      getNestedValue(entry, 'assignedTo') || 
      getNestedValue(entry, 'assetId.assigned_to.name') || 
      'No One';

    // Construct asset ID string
    const assetId = assetIdNumber ? `(${assetIdNumber})` : '';

    // Comprehensive action sentences
    switch (actionType) {
      case "Assigned":
        return userRole === "Admin"
          ? `${userName} (${userRole}) assigned ${assetName} ${assetId} to ${assignedTo}.`
          : `${userName} (${userRole}) was assigned ${assetName} ${assetId}.`;
      
      case "Created":
        return `${userName} (${userRole}) created the asset ${assetName} ${assetId}.`;
      
      case "Updated":
        return `${userName} (${userRole}) updated the details of asset ${assetName} ${assetId}.`;
      
      case "Deleted":
        return `${userName} (${userRole}) deleted the asset ${assetName} ${assetId}.`;
      
      case "Scheduled for Maintenance":
        return `${userName} (${userRole}) scheduled maintenance for ${assetName} ${assetId}.`;
      
      case "Maintenance Completed":
        return `${userName} (${userRole}) completed maintenance for ${assetName} ${assetId}.`;
      
      case "Asset Requested":
        return `${userName} (${userRole}) requested the asset ${assetName} ${assetId}.`;
      
      case "Returned":
        return `${userName} (${userRole}) returned the asset ${assetName} ${assetId}.`;
      
      case "Maintenance Requested":
        return `${userName} (${userRole}) reported an issue with ${assetName} ${assetId}.`;
      
      default:
        return `${userName} (${userRole}) performed action: ${actionType} on ${assetName} ${assetId}.`;
    }
  };

  const aggregateAssetData = (assets) => {
    const categoryMap = {};
    assets.forEach(({ category }) => {
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    const colors = ["#673AB7", "#F88379", "#00B4D8", "#FFC107"];
    return Object.entries(categoryMap).map(([category, value], index) => ({
      category,
      value,
      color: colors[index % colors.length],
    }));
  };

  const formatAssignmentTimeline = (assets) => {
    // Group assets by assigned date
    const dateMap = {};
    
    assets.forEach(asset => {
      if (asset.assigned_date) {
        let dateObj;
        
        // Handle the DD-MM-YYYY format from mongoose getter
        if (typeof asset.assigned_date === 'string' && asset.assigned_date.includes('-')) {
          const dateParts = asset.assigned_date.split('-');
          // Create date from parts (Year, Month (0-based), Day)
          dateObj = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
        } else {
          // Handle if it's already a Date object or other format
          dateObj = new Date(asset.assigned_date);
        }
        
        // Format date for chart display (Month Day)
        const date = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        
        // Count assignments per day
        dateMap[date] = (dateMap[date] || 0) + 1;
      }
    });
    
    // Convert to array format for the chart
    const chartData = Object.entries(dateMap).map(([date, count]) => ({
      date,
      assignments: count
    }));
    
    // Sort by date
    return chartData.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    }).slice(-7); // Get the last 7 days
  };

  const formatLineChartData = (history) => {
    // Sort history by date first
    const sortedHistory = [...history].sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp) : new Date(a.date);
      const dateB = b.timestamp ? new Date(b.timestamp) : new Date(b.date);
      return dateA - dateB;
    });
    
    // Group by date and count actions per date
    const grouped = sortedHistory.reduce((acc, item) => {
      // Use timestamp if available, otherwise use date
      const dateValue = item.timestamp || item.date;
      
      // Format date consistently
      const date = new Date(dateValue).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Create array for chart with last 7 entries if available
    const chartData = Object.entries(grouped).map(([date, count]) => ({
      date,
      actions: count
    }));
    
    // Get the last 7 days of data or however many we have if less
    return chartData.slice(-7);
  };

  const createComprehensiveTimeline = (assignmentData, historyData) => {
    // Process history data with our existing function
    const activityData = formatLineChartData(historyData);
    
    // Combine the datasets
    const allDates = [...new Set([
      ...assignmentData.map(item => item.date),
      ...activityData.map(item => item.date)
    ])].sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });
    
    // Create combined dataset
    return allDates.map(date => {
      const assignment = assignmentData.find(a => a.date === date);
      const activity = activityData.find(a => a.date === date);
      
      return {
        date,
        assignments: assignment ? assignment.assignments : 0,
      };
    });
  };

  const summaryCards = [
    { category: "Assigned Assets", value: summary.assignedAssets, color: "#673AB7", icon: FiDatabase },
    { category: "Pending Requests", value: summary.pendingRequests, color: "#00B4D8", icon: FaBoxes },
    { category: "Approved Requests", value: summary.approvedRequests, color: "#4CAF50", icon: FaClipboardList },
    { category: "Rejected Requests", value: summary.rejectedRequests, color: "#F44336", icon: FaTools },
  ];

  return (
    <div className="flex flex-col mt-14 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-900">Employee Dashboard</h1>
      <h2 className="text-2xl text-center text-gray-600 mt-2">Track your asset requests, assignments, and history</h2>

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
              <h3 className="text-lg font-semibold text-gray-800">{card.category}</h3>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Assigned Asset Category</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie data={assetData} dataKey="value" nameKey="category" cx="50%" cy="50%" innerRadius={60} outerRadius={90} label>
                {assetData.map(({ color }, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Asset Assignment Timeline</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="assignments" 
                name="Assets Assigned" 
                stroke="#673AB7" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Card title="Recent Activity" className="bg-white p-6 rounded-xl shadow-lg mt-6">
        <Table 
          columns={[
            { header: "Date", accessor: "date" }, 
            { header: "Activity", accessor: "formattedAction" }
          ]} 
          data={recentActivity} 
        />
      </Card>
    </div>
  );
};

export default EmployeeDashboard;