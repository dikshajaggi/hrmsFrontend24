import EmployeeList from "@/components/EmployeeList";
import ImportDataModal from "@/components/common/ImportDataModal";
import { Plus, Upload } from "lucide-react";
import React, { useState } from "react";

const EmployeeManagement = () => {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div className="px-6 xl:px-8 2xl:px-10 py-6 w-full">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <h1 className="text-2xl font-semibold mb-6">Employee Management</h1>

       <div className="flex flex-wrap gap-2">
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition cursor-pointer"
        >
          <Plus size={16} /> Add Employee
        </button>
         <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition cursor-pointer"
        >
          <Upload size={16} /> Upload Employee Data
        </button>
       </div>
      </div>

      <EmployeeList />

      {/* Upload Modal */}
      {showModal && (
        <ImportDataModal setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default EmployeeManagement;
