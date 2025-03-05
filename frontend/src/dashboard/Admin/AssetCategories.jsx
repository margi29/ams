import { useState } from "react";
import { FaTrash } from "react-icons/fa";

const AssetCategories = () => {
  const [categories, setCategories] = useState([
    "Electronics",
    "Furniture",
    "Office Equipment",
    "Vehicles",
  ]);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim() !== "" && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (category) => {
    setCategories(categories.filter((cat) => cat !== category));
  };

  return (
    <div className="p-6 mt-16 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Asset Categories</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2 flex-grow rounded-lg"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add
        </button>
      </div>
      <ul className="list-none p-0">
        {categories.map((category, index) => (
          <li key={index} className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded-lg shadow">
            <span className="text-gray-700 font-medium">{category}</span>
            <button
              onClick={() => handleDeleteCategory(category)}
              className="text-red-500 hover:text-red-700 transition"
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetCategories;
