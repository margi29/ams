import { motion } from "framer-motion";

const Table = ({
  columns,
  data,
  onSelectRow,
  selectedRows,
  onDelete,
  onEdit,
}) => {
  return (
    <motion.table
      className="w-full border-collapse border border-gray-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <thead>
        <tr className="bg-[#3A6D8C] text-white">
          {columns.map((col, index) => (
            <th key={index} className="p-3 border text-left">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <motion.tr
            key={row.id || rowIndex}
            className="text-center bg-gray-100 hover:bg-gray-200 transition"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            {columns.map((col, colIndex) => (
             <td key={colIndex} className="border p-3 ">
             {col.render ? (
               col.render(row)
             ) : (
               <span className={col.className ? col.className(row[col.accessor]) : ""}>
                 {row[col.accessor]}
               </span>
             )}
           </td>
           
            ))}
          </motion.tr>
        ))}
      </tbody>
    </motion.table>
  );
};

export default Table;
