import EmployeeList from "@/components/EmployeeList";
import ExportDataModal from "@/components/ExportDataModal";
import ImportDataModal from "@/components/ImportDataModal";
import { Upload } from "lucide-react";
import React, { useState } from "react";

const EmployeeManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [uploadStage, setUploadStage] = useState("upload"); // upload | importing | success
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setUploadStage("importing");

      // Simulate import delay
      setTimeout(() => {
        setUploadStage("success");
      }, 2000);
    }
  };

  const handleImportClick = () => {
    if (uploadStage === "success") {
      setShowModal(false);
      setUploadStage("upload");
      setFileName("");
    }
  };

  return (
    <div className="px-6 xl:px-8 2xl:px-10 py-6 w-full">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <h1 className="text-2xl font-semibold mb-6">Employee Management</h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          <Upload size={16} /> Upload Employee Data
        </button>
      </div>

      <EmployeeList />

      {/* Upload Modal */}
      {showModal && (
        <ImportDataModal setShowModal={setShowModal} uploadStage={uploadStage} handleFileChange={handleFileChange} fileName={fileName} handleImportClick={handleImportClick} />
      )}
    </div>
  );
};

export default EmployeeManagement;
