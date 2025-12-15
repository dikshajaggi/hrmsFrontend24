export const WarningModal = ({
  isOpen,
  onClose,
  onConfirm,
  employeeName,
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border">
        
        {/* Header */}
        <div className="flex items-start gap-3 p-5 border-b">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
            ⚠️
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Employee
            </h2>
            <p className="text-sm text-gray-500">
              This action cannot be undone
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 text-sm text-gray-700 space-y-3">
          <p>
            You are about to permanently delete{" "}
            <span className="font-semibold text-gray-900">
              {employeeName}
            </span>'s record.
          </p>

          <p className="text-red-600">
            All associated data (attendance, payroll, leaves, history) will be permanently removed.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-100 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Deleting…" : "Delete Employee"}
          </button>
        </div>

      </div>
    </div>
  );
};
