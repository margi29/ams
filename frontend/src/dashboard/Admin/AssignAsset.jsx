import { useState } from "react";
import { motion } from "framer-motion";

const AssignAsset = () => {
  const [category, setCategory] = useState("");
  const [asset, setAsset] = useState("");
  const [user, setUser] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
  const [note, setNote] = useState("");

  // Categories and Assets Mapping
  const categories = ["Electronics", "Furniture", "Office Supplies"];
  const categoryAssets = {
    Electronics: ["Laptop", "Projector", "Monitor"],
    Furniture: ["Office Chair", "Desk", "Cabinet"],
    "Office Supplies": ["Printer", "Whiteboard", "Stationery Kit"],
  };

  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState(["John Doe", "Jane Smith", "Alice Brown"]);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setAssets(categoryAssets[selectedCategory] || []);
    setAsset(""); // Reset asset when category changes
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Category: ${category}\nAsset: ${asset}\nAssigned to: ${user}\nDate: ${date}\nNote: ${note}`);
    setCategory("");
    setAsset("");
    setUser("");
    setDate(new Date().toISOString().split("T")[0]); // Reset to today's date
    setNote("");
  };

  return (
    <motion.div 
      className="p-6 mt-16 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Assign Asset</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Select Category</label>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="">-- Choose a Category --</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Select or Enter Asset</label>
          <input
            list="asset-options"
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            placeholder="Select or enter a new asset"
            className="w-full p-3 border rounded-lg"
            disabled={!category}
            required
          />
          <datalist id="asset-options">
            {assets.map((item, index) => (
              <option key={index} value={item} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block font-medium">Assign To</label>
          <input
            list="user-options"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Select or enter a user"
            className="w-full p-3 border rounded-lg"
            required
          />
          <datalist id="user-options">
            {users.map((item, index) => (
              <option key={index} value={item} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block font-medium">Assignment Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Additional Notes</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional notes..."
            className="w-full p-3 border rounded-lg"
          ></textarea>
        </div>

        <div className="flex justify-center">
          <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-lg">
            Assign Asset
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AssignAsset;