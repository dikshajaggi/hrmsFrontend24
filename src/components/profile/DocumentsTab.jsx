import { Upload, FileText, Eye, RefreshCcw } from "lucide-react";

const DocumentCard = ({
  doc,
  canEdit,
  onUpload,
  onReplace,
}) => {
  const hasFile = Boolean(doc.doc_path);

  return (
    <div className="border rounded-xl p-4 bg-white flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <FileText size={18} className="text-blue-600" />
        <h4 className="text-sm font-semibold text-gray-800">
          {doc.doc_type}
        </h4>
      </div>

      {/* Status */}
      <div className="text-xs text-gray-500 mb-4">
        {hasFile
          ? `Uploaded on ${new Date(doc.created_at).toLocaleDateString()}`
          : "No document uploaded"}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        {hasFile && (
          <a
            href={doc.doc_path}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Eye size={14} />
            View
          </a>
        )}

        {canEdit && (
          <label className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
            {hasFile ? (
              <>
                <RefreshCcw size={14} />
                Replace
              </>
            ) : (
              <>
                <Upload size={14} />
                Upload
              </>
            )}
            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                hasFile
                  ? onReplace(doc.document_id, e.target.files[0])
                  : onUpload(doc.doc_type, e.target.files[0])
              }
            />
          </label>
        )}
      </div>
    </div>
  );
};

export const DocumentsTab = ({
  documents,
  role,
  onUpload,
  onReplace,
}) => {
  const canEdit = role === "EMPLOYEE" || role === "HR";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.document_id}
          doc={doc}
          canEdit={canEdit}
          onUpload={onUpload}
          onReplace={onReplace}
        />
      ))}
    </div>
  );
};
