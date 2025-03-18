import React, { useState } from "react";
import { motion } from "framer-motion";

const ContactAdmin = () => {
  const [formData, setFormData] = useState({
    asset_name: "",
    asset_category: "",
    request_type: "Request New Asset",
    request_details: "",
    status: "Pending",
  });

  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Sending request to admin...");
      const response = await fetch("http://localhost:3000/api/contact-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      console.log("Server response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Error submitting request");
      }

      setSubmittedRequest(responseData.request);
      alert("Request submitted successfully!");
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-[#DBDAE4] min-h-screen flex justify-center items-center">
      <motion.div
        className="w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8">
          <h2 className="text-3xl font-semibold text-[#302757] mb-6 text-center">
            Contact Admin for Asset Request or Query
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <motion.div
              className="form-group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-[#302757] font-medium">Asset Name *</label>
              <input
                type="text"
                name="asset_name"
                value={formData.asset_name}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 border border-[#66708F] rounded-md focus:ring-[#F7BF10] focus:outline-none"
              />
            </motion.div>

            <motion.div
              className="form-group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-[#302757] font-medium">Asset Category *</label>
              <input
                type="text"
                name="asset_category"
                value={formData.asset_category}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 border border-[#66708F] rounded-md focus:ring-[#F7BF10] focus:outline-none"
              />
            </motion.div>

            <motion.div
              className="form-group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-[#302757] font-medium">Request Type *</label>
              <select
                name="request_type"
                value={formData.request_type}
                onChange={handleChange}
                className="w-full mt-1 p-3 border border-[#66708F] rounded-md focus:ring-[#F7BF10] focus:outline-none"
              >
                <option value="Request New Asset">Request New Asset</option>
                <option value="Denied Asset Query">Denied Asset Query</option>
                <option value="Other Queries">Other Queries</option>
              </select>
            </motion.div>

            <motion.div
              className="col-span-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-[#302757] font-medium">Request Details *</label>
              <textarea
                name="request_details"
                value={formData.request_details}
                onChange={handleChange}
                required
                className="w-full mt-1 p-3 border border-[#66708F] rounded-md focus:ring-[#F7BF10] focus:outline-none h-32"
              />
            </motion.div>

            <motion.div
              className="flex justify-center mt-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-[#673AB7] text-white text-lg rounded-lg shadow-md hover:bg-[#5E35B1] transition-all"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </motion.div>
          </form>

          {submittedRequest && (
            <motion.div
              className="mt-6 p-6 bg-[#DBDAE4] rounded-xl text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-[#302757] mb-4">
                Request Submitted Successfully!
              </h3>
              <p className="text-[#302757] mb-2">
                Your request for <strong>{submittedRequest.asset_name}</strong> has been submitted.
              </p>
              <p className="text-[#302757] mb-2">
                Request Type: <strong>{submittedRequest.request_type}</strong>
              </p>
              <p className="text-[#302757]">
                Status: <strong>{submittedRequest.status}</strong>
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ContactAdmin;
