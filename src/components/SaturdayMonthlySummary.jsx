import React from "react";

const SaturdayMonthlySummary = ({ summary }) => {
  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Monthly Saturday Off Summary
      </h3>

      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 border-b text-gray-600">
          <tr>
            <th className="py-2 px-3">Month</th>
            <th className="py-2 px-3">Rule</th>
            <th className="py-2 px-3">Saturday Off Dates</th>
          </tr>
        </thead>

        <tbody className="text-gray-800">
          {summary.map((item) => (
            <tr
              key={item.month}
              className="border-b last:border-0 hover:bg-gray-50 transition"
            >
              <td className="py-2 px-3 font-medium">{item.month}</td>

              <td className="py-2 px-3">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    item.rule === "Custom Rule"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.rule}
                </span>
              </td>

              <td className="py-2 px-3">
                {item.dates.length > 0
                  ? item.dates.join(", ")
                  : "No Saturdays Off"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SaturdayMonthlySummary;
