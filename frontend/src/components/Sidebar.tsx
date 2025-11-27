import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  faChalkboardUser,
  faFileArrowUp,
  faGlasses,
  faHouse,
  faRankingStar,
  faChevronLeft,
  faChevronRight,
  type IconDefinition,
  faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SidebarItemProps {
  icon: IconDefinition;
  label: string;
  to: string;
  collapsed: boolean;
}

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => setCollapsed((c) => !c);
  
  const role = localStorage.getItem('role')

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    window.location.href = "/login";  // full reset
  };


  return (
    <div className="relative">
      {/* OUTSIDE FLOATING TOGGLE BUTTON */}
      <button
        onClick={toggleCollapse}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={`
          absolute top-6 -right-4 z-20
          bg-lavender-gray-100 border border-lavender-gray-400 
          rounded-full w-8 h-8 shadow
          flex items-center justify-center
          transition-all
          hover:bg-lavender-gray-200
        `}
      >
        <FontAwesomeIcon
          icon={collapsed ? faChevronRight : faChevronLeft}
          className="text-md"
        />
      </button>

      {/* SIDEBAR */}
      <aside
        className={`
          h-screen bg-lavender-gray-100 border-r border-lavender-gray-300 
          p-4 transition-all flex flex-col
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center mb-6 ${collapsed ? "justify-center" : "justify-start space-x-2"}`}>
          <FontAwesomeIcon icon={faChalkboardUser} className="text-2xl text-lavender-gray-700" />
          {!collapsed && (
            <h1 className="text-2xl font-bold text-lavender-gray-900">
              courselane
            </h1>
          )}
        </div>

        {/* Nav Links */}
        <nav className="space-y-3 mt-4">
          <SidebarItem icon={faHouse} label="Dashboard" to="/dashboard" collapsed={collapsed} />
          <SidebarItem icon={faGlasses} label="View Courses" to="/courses" collapsed={collapsed} />
          {role === 'student' && (
            <SidebarItem icon={faRankingStar} label="Previous Grades" to="/grades" collapsed={collapsed} />
          )}
          {role === 'faculty' && (
            <SidebarItem icon={faFileArrowUp} label="Upload Grades" to="/upload-grades" collapsed={collapsed} />
          )}
          
        </nav>

        <div className={`mt-auto pt-6 border-t border-lavender-gray-300 self-baseline w-full`}>
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center transition
              ${collapsed ? "justify-center" : "space-x-3"}
              text-red-600 hover:bg-red-100
              rounded-lg p-2
            `}
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="text-lg" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </div>
  );
}

/* -------------------------------------
   Sidebar Item
-------------------------------------- */
function SidebarItem({ icon, label, to, collapsed }: SidebarItemProps) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      className={`
        flex items-center transition
        ${collapsed ? "justify-center" : "space-x-3"}
        ${active
          ? "bg-lavender-gray-300 text-lavender-gray-950 font-semibold"
          : "text-lavender-gray-950 hover:bg-lavender-gray-200"}
        rounded-lg p-2
      `}
      aria-current={active ? "page" : undefined}
    >
      <FontAwesomeIcon icon={icon} className="text-lg" />
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
}
export default Sidebar;