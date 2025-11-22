// DashboardSidebar.jsx
import { useEffect, useState, useRef, useContext } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { dashboardSidebar } from "@/assets/dashboardItems";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { LayoutContext } from "@/context/LayoutContext";

const TooltipPortal = ({ visible, text, x, y }) => {
  if (!visible) return null;
  return createPortal(
    <div
      role="tooltip"
      style={{
        position: "fixed",
        left: x,
        top: y,
        transform: "translateY(-50%)",
        background: "rgba(31, 41, 55, 0.95)", // gray-800
        color: "#fff",
        padding: "6px 10px",
        borderRadius: 6,
        fontSize: 12,
        zIndex: 9999,
        whiteSpace: "nowrap",
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        pointerEvents: "none"
      }}
    >
      {text}
    </div>,
    document.body
  );
};

const DashboardSidebar = () => {
  const location = useLocation();
  const {collapsed, setCollapsed} = useContext(LayoutContext);
  const wrapperRef = useRef(null);
  const [openMenus, setOpenMenus] = useState({});

  // Tooltip state (portal)
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0
  });

  useEffect(() => {
    const handleResize = () => setCollapsed(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // show tooltip (portal) for collapsed state
  const handleShowTooltip = (event, text) => {
    if (!collapsed) return;
    const rect = event.currentTarget.getBoundingClientRect();
    // place tooltip to the right of the item (8px gap)
    const x = rect.right + 8;
    // vertically center against the item
    const y = rect.top + rect.height / 2;
    setTooltip({ visible: true, text, x, y });
  };

  const handleHideTooltip = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const toggleMenu = (key) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    dashboardSidebar.forEach(item => {
      if (item.children) {
        const isChildActive = item.children.some(c => location.pathname === c.path);
        if (isChildActive) {
          setOpenMenus(prev => ({ ...prev, [item.main]: true }));
        }
      }
    });
  }, [location.pathname]);

  return (
    <div className="relative"> {/* wrapper for layout - no overflow hack here */}
      {/* IMPORTANT: keep aside overflow hidden to avoid horizontal scroll caused by inner paddings */}
      <aside
        style={{ paddingLeft: "2px" }}
        className={`h-screen flex-shrink-0 bg-white flex flex-col shadow-sm transition-all duration-300 
          ${collapsed ? "w-20" : "w-60"} overflow-x-hidden`}
        ref={wrapperRef}
      >
        {/* Header */}
        <div
          style={{
            paddingLeft: collapsed ? 0 : "10px",
            paddingRight: collapsed ? 0 : "10px",
          }}
          className={`h-16 ${
            collapsed
              ? "flex flex-col items-center justify-center"
              : "flex items-center justify-between"
          }`}
        >
          {collapsed ? (
            <h1 className="text-xl text-center font-bold text-indigo-600">C</h1>
          ) : (
            <h1 className="text-lg font-semibold text-gray-800">Company HRMS</h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-gray-800 transition cursor-pointer"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto" style={{ paddingTop: "14px" }}>
          <ul className="flex flex-col gap-5">
            {dashboardSidebar.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = openMenus[item.main];

              return (
               <li key={item.main} className="relative group">
                  {/* IF HAS NO CHILDREN → NORMAL NAV */}
                  {!hasChildren && (
                    <Link
                      to={item.path}
                      onMouseEnter={(e) => handleShowTooltip(e, item.main)}
                      onMouseLeave={handleHideTooltip}
                      className={`flex items-center rounded-sm text-sm font-medium transition-all
                        ${isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}
                        ${collapsed ? "justify-center" : "gap-4 px-3 py-2"}
                      `}
                    >
                      <Icon size={21} />
                      {!collapsed && <span>{item.main}</span>}
                    </Link>
                  )}

                  {/* IF HAS CHILDREN → EXPANDABLE MENU */}
                  {hasChildren && (
                    <div
                      onClick={() => toggleMenu(item.main)}
                      onMouseEnter={(e) => handleShowTooltip(e, item.main)}
                      onMouseLeave={handleHideTooltip}
                      className={`flex items-center cursor-pointer rounded-sm text-sm font-medium transition-all
                        ${isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-gray-100"}
                        ${collapsed ? "justify-center" : "gap-4 px-3 py-2"}
                      `}
                    >
                      <Icon size={21} />
                      {!collapsed && <span>{item.main}</span>}
                      <ChevronRight
                        size={16}
                        className={`ml-auto transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                    </div>
                  )}

                  {/* CHILDREN */}
                  {hasChildren && (
                    <ul
                      className={`
                        overflow-hidden transition-all duration-300 ml-10
                        ${collapsed ? "hidden" : ""}
                        ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                      `}
                    >
                      {item.children.map((child) => {
                        const childActive = location.pathname === child.path;
                        return (
                          <li key={child.path}>
                            <Link
                              to={child.path}
                              className={`block text-sm rounded-sm py-2 pl-4 pr-2 transition
                                ${childActive
                                  ? "text-indigo-600 font-medium"
                                  : "text-gray-500 hover:text-indigo-600"
                                }
                              `}
                            >
                              {child.main}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                </li>

              );
            })}

          </ul>
        </nav>
      </aside>

      {/* Tooltip portal (renders to body) */}
      <TooltipPortal
        visible={tooltip.visible}
        text={tooltip.text}
        x={tooltip.x}
        y={tooltip.y}
      />
    </div>
  );
};

export default DashboardSidebar;
