import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Table from "../../components/Table";

const AssetCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error(" Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return alert("Category name is required.");
    try {
      const response = await axios.post("http://localhost:3000/api/categories", { name: newCategory });
      alert(" Category added successfully!");
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      console.error(" Error adding category:", error);
      alert(error?.response?.data?.error || "Failed to add category.");
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/categories/${id}`);
      alert("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Search Logic
  const filteredCategories = categories
    .filter((category) => category.name.toLowerCase().includes(search.toLowerCase()))
    .map((category) => ({
      categoryName: category.name,
      actions: (
        <button
          onClick={() => handleDeleteCategory(category._id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      ),
    }));

  const columns = [
    { header: "Category Name", accessor: "categoryName" },
    { header: "Actions", accessor: "actions" },
  ];

  return (
    <motion.div
      className="p-6 mt-16 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Asset Category Management</h2>

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="flex mb-8">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter new category name"
          className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#673AB7]"
        />
        <button
          type="submit"
          className="ml-4 px-6 py-3 bg-[#673AB7] text-white rounded-lg hover:bg-[#5E35B1] transition-all"
        >
          Add Category
        </button>
      </form>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#673AB7]"
        />
      </div>

      {/* Table Display */}
      {loading ? (
        <p className="text-center text-gray-500 mt-4">Loading categories...</p>
      ) : (
        <Table columns={columns} data={filteredCategories} />
      )}
    </motion.div>
  );
};

export default AssetCategory;
