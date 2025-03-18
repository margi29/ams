import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  MdRequestPage,
  MdAccessTime,
  MdAssignmentReturn,
  MdBuild,
  MdCheckCircle,
} from "react-icons/md";
import Card from "../../components/Card";

const guidelinesData = [
  {
    title: "Asset Request Process",
    description:
      "Employees can request assets through the Asset Management System. Provide detailed information about the required asset.",
    icon: <MdRequestPage className="text-blue-500 text-2xl" />,
  },
  {
    title: "Approval Timeline",
    description:
      "Asset requests are typically approved within 2-3 business days. Urgent requests may be prioritized.",
    icon: <MdAccessTime className="text-yellow-500 text-2xl" />,
  },
  {
    title: "Usage Responsibility",
    description:
      "Employees are responsible for the appropriate use and maintenance of assigned assets.",
    icon: <MdCheckCircle className="text-green-500 text-2xl" />,
  },
  {
    title: "Return Policy",
    description:
      "Assets must be returned in good condition upon request or upon completion of the assignment.",
    icon: <MdAssignmentReturn className="text-red-500 text-2xl" />,
  },
  {
    title: "Maintenance Requests",
    description:
      "If an asset requires maintenance, raise a maintenance request through the system immediately.",
    icon: <MdBuild className="text-purple-500 text-2xl" />,
  },
];

const Guidelines = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <motion.div
      className="p-6 min-h-screen mt-16 overflow-auto bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Title Section */}
      <h1 className="text-3xl font-semibold text-center text-gray-800">
         Company Guidelines
      </h1>
      <h2 className="text-lg text-center mt-2 text-gray-600">
        Understand our policies for using and requesting company assets
      </h2>

      {/* Guidelines Section */}
      <Card title="General Asset Management Guidelines" className="mt-6">
        {guidelinesData.map((item, index) => (
          <motion.div
            key={index}
            className="mb-4 border-b pb-4 last:border-b-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Header Section with Icons and Toggle */}
            <div
              onClick={() => toggleAccordion(index)}
              className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <h3 className="text-xl font-medium text-gray-800">{item.title}</h3>
              </div>
              {openIndex === index ? (
                <FaChevronUp className="text-gray-500 text-lg" />
              ) : (
                <FaChevronDown className="text-gray-500 text-lg" />
              )}
            </div>

            {/* Collapsible Description Section */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: openIndex === index ? "auto" : 0,
                opacity: openIndex === index ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-gray-600 p-3 text-base leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </Card>
    </motion.div>
  );
};

export default Guidelines;
