import { useState } from "react";
import { motion } from "framer-motion";

const AssignAsset = () => {
  const [asset, setAsset] = useState("");
  const [user, setUser] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Asset: ${asset}\nAssigned to: ${user}\nDate: ${date}\nNote: ${note}`);
    setAsset("");
    setUser("");
    setDate("");
    setNote("");
  };

  return (
    <motion.div 
      className="p-6 mt-16 bg-white"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Assign Asset</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Select Asset</label>
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="">-- Choose an Asset --</option>
            <option value="Laptop">Laptop</option>
            <option value="Projector">Projector</option>
            <option value="Office Chair">Office Chair</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Assign To</label>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Enter employee name"
            className="w-full p-3 border rounded-lg"
            required
          />
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
