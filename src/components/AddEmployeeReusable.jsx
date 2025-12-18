/* ===================== */
/* REUSABLE COMPONENTS */
/* ===================== */

export const Section = ({ title, children, collapsible, expanded, onToggle, badge }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div
        className={`flex items-center justify-between px-6 py-4 ${
          collapsible ? "cursor-pointer" : ""
        }`}
        onClick={collapsible ? onToggle : undefined}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          {badge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {badge}
            </span>
          )}
        </div>
        {collapsible && (
          <span className="text-gray-400 text-sm">
            {expanded ? "▲" : "▼"}
          </span>
        )}
      </div>

      {(!collapsible || expanded) && (
        <div className="px-6 pb-6">{children}</div>
      )}
    </div>
  );
}

export const Grid = ({ children }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {children}
    </div>
  );
}

export const Input = ({ label, required, value, type = "text", placeholder, onChange, min }) => {
  return (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            min={min}
            placeholder={placeholder}
            className="w-full rounded-lg border px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />    
    </div>
  );
}

export const Select = ({ label, required, options, onChange, value, optionLabel, optionValue }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select className="w-full rounded-lg capitalize border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value ?? ""}  onChange={onChange ?? ""}>
        <option value="">Select {label}</option>

        {options.map((item) => (
          <option
            key={item[optionValue] ?? item}
            value={item[optionValue] ?? item}
          >
            {item[optionLabel] ?? item}
          </option>
        ))}
      </select>
    </div>
  );
}

export const RadioGroup = ({ label, options }) => {
  return (
    <div>
      <p className="block text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="flex gap-4">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-sm">
            <input type="radio" name={label} className="accent-blue-600" />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}


export const Card = ({ title, children }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-4">
      {title}
    </h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

export const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-900 mt-1">
      {value || "—"}
    </p>
  </div>
);

export const Badge = ({ children, tone = "gray" }) => {
  const tones = {
    gray: "bg-gray-100 text-gray-600",
    green: "bg-green-100 text-green-700",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${tones[tone]}`}
    >
      {children}
    </span>
  );
};
