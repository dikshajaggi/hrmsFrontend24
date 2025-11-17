import { importData } from '@/apis';
import { X } from 'lucide-react';
import React, { useState } from 'react'
import { useMutation } from 'react-query';

const ImportDataModal = ({setShowModal, importType, onSuccess}) => {

  const [uploadStage, setUploadStage] = useState("upload"); // upload | importing | success
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);

  console.log(importType, fileName, file, summary, "filefilefile")

  const mutation = useMutation({
    mutationFn: (formData) => importData(importType, formData),

    onMutate: () => {
      setUploadStage("importing");
    },

    onSuccess: (data) => {
      setSummary(data.data.summary); 
      setUploadStage("result");

      // Refetch parent list (employees or attendance)
      if (onSuccess) onSuccess();

      // Auto close modal after 1 sec
      // setTimeout(() => {
      //   setShowModal(false);
      //   setUploadStage("upload");
      //   setFileName("");
      //   setFile(null);
      // }, 1000);
    },

    onError: () => {
      setUploadStage("error");
    },
  });


  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setFileName(selected.name);
    setUploadStage("file-selected")
  };

  const handleImportClick = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    mutation.mutate(formData);
  };


  return (
     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 sm:px-0">
        <div className="bg-white rounded-xl shadow-lg w-full sm:w-[90%] max-w-md p-4 sm:p-6 relative">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={() => {
              setShowModal(false);
              setUploadStage("upload");
              setFileName("");
              setFile(null);
            }}
            >
            <X size={18} />
          </button>

          <h2 className="text-xl font-semibold mb-4">Upload file</h2>

          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
            {(uploadStage === "upload")  && (
              <>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
                  alt="Excel icon"
                  className="w-12 h-12 mb-3"
                />
                <p className="text-gray-600">
                  Drag & Drop file here or{" "}
                  <label className="text-blue-600 cursor-pointer font-medium">
                    Choose file
                    <input
                      type="file"
                      accept=".xls,.xlsx,.csv"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: XLS, XLSX, CSV (Max size: 25MB)
                </p>
              </>
            )}

            {uploadStage === "file-selected" && (
              <p className="text-gray-700 mt-2">
                Selected file: <span className="font-medium">{fileName}</span>
              </p>
            )}

            {uploadStage === "importing" && (
              <>
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-400 border-t-transparent mb-3"></div>
                <p className="text-gray-700">
                  Please keep the window open while we import your data...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Chosen file: <span className="font-medium">{fileName}</span>
                </p>
              </>
            )}

            {uploadStage === "success" && (
              <>
                <div className="text-green-500 text-4xl mb-3">✔</div>
                <p className="text-gray-800 font-medium">
                  File has been imported!
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Chosen file: <span className="font-medium">{fileName}</span>
                </p>
              </>
            )}

            {uploadStage === "result" && (
              <div className="w-full text-left">
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  Import Summary
                </p>

                <p className="text-sm text-gray-700">
                  <b>Successful:</b> {summary?.successCount}
                </p>

                <p className="text-sm text-red-600 mt-1">
                  <b>Failed:</b> {summary?.failedCount}
                </p>

                {summary?.failedCount > 0 && (
                  <div className="mt-3 bg-red-50 border border-red-200 p-3 rounded-lg max-h-40 overflow-y-auto">
                    <p className="font-medium text-red-700 mb-2">Errors:</p>

                    {summary.errors.map((err, idx) => (
                      <div key={idx} className="mb-2">
                        <p className="text-sm text-gray-800">
                          <b>Row {err.rowNumber}:</b>
                        </p>
                        <p className="text-xs text-gray-600 whitespace-pre-wrap pl-2">
                          {err.error}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Template Download */}
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center gap-3">
              <img
                src="https://cdn-icons-png.flaticon.com/512/732/732220.png"
                alt="Excel icon"
                className="w-6 h-6"
              />
              <div>
                <p className="font-medium text-gray-800">Template</p>
                <p className="text-sm text-gray-500">
                  Download template as a starting point for your own file.
                </p>
              </div>
            </div>
            <button className="mt-3 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition cursor-pointer">
              Download
            </button>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              className="flex items-center gap-2 border border-gray-400 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition cursor-pointer"
               onClick={() => {
                  setShowModal(false);
                  setSummary(null);
                  setUploadStage("upload");
                  setFileName("");
                  setFile(null);
                }}
              >
              Close
            </button>
            <button
              disabled={uploadStage !== "file-selected"}
              onClick={handleImportClick}
              className={`px-4 py-2 rounded-lg text-white ${
                uploadStage === "file-selected"
                  ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  : "bg-blue-400 cursor-not-allowed"
              }`}
            >
              Upload
            </button>
          </div>
          </div>
        </div>
  )
}

export default ImportDataModal
