import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaBox,
  FaTag,
  FaMapMarkerAlt,
  FaUser,
  FaClock,
  FaPlus,
  FaExchangeAlt,
  FaUndo,
  FaCheckCircle,
  FaWrench,
  FaTrash
} from "react-icons/fa";

const actionIcons = {
  "Created": <FaPlus className="text-green-500" />,
  "Updated": <FaExchangeAlt className="text-blue-500" />,
  "Deleted": <FaTrash className="text-red-500" />,
  "Assigned": <FaUser className="text-purple-500" />,
  "Scheduled for Maintenance": <FaWrench className="text-orange-500" />,
  "Maintenance Completed": <FaCheckCircle className="text-green-500" />,
  "Asset Requested": <FaTag className="text-yellow-500" />,
  "Returned": <FaUndo className="text-blue-500" />,
  "Maintenance Requested": <FaWrench className="text-orange-600" />,
};

const getColor = (action) => {
  switch (action) {
    case "Created":
      return "bg-green-50 text-green-700 border-green-200";
    case "Updated":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Deleted":
      return "bg-red-50 text-red-700 border-red-200";
    case "Assigned":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Scheduled for Maintenance":
    case "Maintenance Requested":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "Maintenance Completed":
      return "bg-green-50 text-green-700 border-green-200";
    case "Asset Requested":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "Returned":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const QRCode = () => {
  // Get the id parameter from the URL
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssetDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
  
        const assetRes = await fetch(`/api/assets/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!assetRes.ok) {
          throw new Error(`Asset not found (Status: ${assetRes.status})`);
        }
  
        const assetData = await assetRes.json();
  
        const historyRes = await fetch(`/api/history/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!historyRes.ok) {
          console.warn(`Could not fetch history (Status: ${historyRes.status})`);
          setHistory([]);
        } else {
          const historyData = await historyRes.json();
          setHistory(historyData);
  
          // Update assigned_to based on the history (if there is an "Assigned" action)
          const assignedAction = historyData.find(entry => entry.actionType === "Assigned");
          if (assignedAction) {
            // Set the assigned user from history
            assetData.assigned_to = assignedAction.assetId.assigned_to;
          }
        }
  
        setAsset(assetData);
        setError(null);
      } catch (error) {
        console.error("Error fetching asset details:", error);
        setError(error.message || "Failed to load asset details");
        setAsset(null);
      } finally {
        setLoading(false);
      }
    };
  
    if (id) {
      fetchAssetDetails();
    } else {
      setError("No asset ID provided");
      setLoading(false);
    }
  }, [id]);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 bg-red-50 rounded-xl shadow-xl border border-red-200 mt-4 sm:mt-10 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-red-700">Error</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 bg-yellow-50 rounded-xl shadow-xl border border-yellow-200 mt-4 sm:mt-10 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-yellow-700">Asset Not Found</h2>
        <p className="text-yellow-600">The requested asset could not be found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-xl border border-gray-200 my-4">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 text-center border-b pb-3">
        Asset Details
      </h2>
      
      {/* Asset details */}
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        {/* Responsive image layout */}
        <div className="flex flex-col sm:flex-row w-full items-center sm:items-start gap-4 sm:gap-6">
          {asset.image && (
            <img
              src={asset.image}
              alt={asset.name}
              className="w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-lg shadow-md border border-gray-300"
            />
          )}
          
          {/* Asset details with responsive spacing and font sizes */}
          <div className="flex-1 space-y-2 sm:space-y-3 text-gray-700 w-full">
            <p className="text-base sm:text-lg font-semibold flex flex-wrap items-center gap-2">
              <FaBox className="text-pink-400 min-w-5" /> 
              <span className="font-semibold min-w-16">Name:</span> 
              <span className="font-normal">{asset.name}</span>
            </p>
            <p className="text-base sm:text-lg font-semibold flex flex-wrap items-center gap-2">
              <FaTag className="text-blue-400 min-w-5" /> 
              <span className="font-semibold min-w-16">Category:</span> 
              <span className="font-normal">{asset.category}</span>
            </p>
            <p className="text-base sm:text-lg font-semibold flex flex-wrap items-center gap-2">
              <FaClock className="text-yellow-500 min-w-5" /> 
              <span className="font-semibold min-w-16">Status:</span> 
              <span className="font-normal">{asset.status}</span>
            </p>
            <p className="text-base sm:text-lg font-semibold flex flex-wrap items-center gap-2">
              <FaMapMarkerAlt className="text-green-400 min-w-5" /> 
              <span className="font-semibold min-w-16">Location:</span> 
              <span className="font-normal">{asset.location || "Inventory"}</span>
            </p>
            <p className="text-base sm:text-lg font-semibold flex flex-wrap items-center gap-2">
              <FaUser className="text-purple-400 min-w-5" /> 
              <span className="font-semibold min-w-16">Assigned To:</span> 
              <span className="font-normal">{asset.assigned_to?.name || "Unassigned"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* History section - Only show if we have history */}
      {history.length > 0 && (
        <div className="mt-6">
          {/* Responsive history timeline */}
          <div className="mt-4 space-y-3 sm:space-y-4">
            {history.map((entry) => (
              <div
                key={entry._id}
                className={`flex items-start sm:items-center gap-3 p-3 rounded-lg border-l-4 ${getColor(entry.actionType)}`}
              >
                <div className="mt-1 sm:mt-0">
                  {actionIcons[entry.actionType]}
                </div>
                <div className="flex-1">
                  <p className="text-sm sm:text-md font-semibold">{entry.actionType}</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Date: {new Date(entry.timestamp).toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Performed By: {entry.userName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCode;