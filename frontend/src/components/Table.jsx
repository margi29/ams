import { motion } from "framer-motion";

const Table = ({ columns, data }) => {
  return (
    <motion.div className="overflow-hidden rounded-xl border border-gray-300 bg-white">
      <motion.table
        className="w-full border-collapse text-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <thead>
          <tr className="bg-[#673AB7] text-white">
            {columns.map((col, index) => (
              <th key={index} className="p-4 border-b border-gray-300 border-r last:border-r-0 text-center font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <motion.tr
              key={row.id || rowIndex}
              className="text-center even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition border-b border-gray-300"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="p-4 border-b border-gray-300 border-r last:border-r-0">
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
    </motion.div>
  );
};

export default Table;
