import React from 'react'

const ImportDataModal = ({setShowModal, uploadStage, handleFileChange, fileName, handleImportClick}) => {
  return (
     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 sm:px-0">
        <div className="bg-white rounded-xl shadow-lg w-full sm:w-[90%] max-w-md p-4 sm:p-6 relative">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>

          <h2 className="text-xl font-semibold mb-4">Upload file</h2>

          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
            {uploadStage === "upload" && (
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
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              disabled={uploadStage === "upload"}
              onClick={handleImportClick}
              className={`px-4 py-2 rounded-lg text-white ${
                uploadStage === "success"
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
