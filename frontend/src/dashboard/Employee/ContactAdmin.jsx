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
    <motion.div
      className="p-6 mt-16 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Contact Admin for Asset Request or Query
      </h1>
      <p className="text-center text-gray-600 mt-2">
        Fill out the form below to submit your request or query.
      </p>

      {/* Asset Request Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Asset Name */}
        <div>
          <label className="block font-medium">
            Asset Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="asset_name"
            value={formData.asset_name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg border-gray-300 mt-1"
          />
        </div>

        {/* Asset Category */}
        <div>
          <label className="block font-medium">
            Asset Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="asset_category"
            value={formData.asset_category}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg border-gray-300 mt-1"
          />
        </div>

        {/* Request Type */}
        <div>
          <label className="block font-medium">
            Request Type <span className="text-red-500">*</span>
          </label>
          <select
            name="request_type"
            value={formData.request_type}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg border-gray-300 mt-1"
          >
            <option value="Request New Asset">Request New Asset</option>
            <option value="Denied Asset Query">Denied Asset Query</option>
            <option value="Other Queries">Other Queries</option>
          </select>
        </div>

        {/* Request Details */}
        <div>
          <label className="block font-medium">
            Request Details <span className="text-red-500">*</span>
          </label>
          <textarea
            name="request_details"
            value={formData.request_details}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg border-gray-300 mt-1 resize-none"
            rows="4"
            placeholder="Provide additional details regarding your request..."
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#673AB7] hover:bg-[#5E35B1] text-white font-bold py-3 rounded-lg transition"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>

      {/* Success Message */}
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
    </motion.div>
  );
};

export default ContactAdmin;
