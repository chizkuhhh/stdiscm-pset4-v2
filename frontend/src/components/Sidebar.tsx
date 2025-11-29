import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  faChalkboardUser,
  faGlasses,
  faHouse,
  faRankingStar,
  faChevronLeft,
  faChevronRight,
  faRightFromBracket,
  faUser,
  type IconDefinition,
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
  const navigate = useNavigate();
  
  const role = localStorage.getItem('role');
  const email = localStorage.getItem('email');

  const toggleCollapse = () => setCollapsed((c) => !c);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("email");
      navigate("/login");
    }
  };

  return (
    <div className="relative">
      {/* FLOATING TOGGLE BUTTON */}
      <button
        onClick={toggleCollapse}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={`
          absolute top-6 -right-4 z-20
          bg-white border border-lavender-gray-300 
          rounded-full w-8 h-8 shadow-md
          flex items-center justify-center
          transition-all duration-200
          hover:bg-lavender-gray-50 hover:shadow-lg
        `}
      >
        <FontAwesomeIcon
          icon={collapsed ? faChevronRight : faChevronLeft}
          className="text-sm text-lavender-gray-700"
        />
      </button>

      {/* SIDEBAR */}
      <aside
        className={`
          h-screen bg-lavender-gray-100 border-r border-lavender-gray-300 
          p-4 transition-all duration-300 flex flex-col
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Logo/Brand */}
        <div className={`flex items-center mt-2 mb-8 ${collapsed ? "justify-center" : "justify-start space-x-3"}`}>
          <div>
            <FontAwesomeIcon icon={faChalkboardUser} className="text-2xl text-lavender-gray-700" />
          </div>
          {!collapsed && (
            <h1 className="text-xl font-bold text-lavender-gray-900">
              courselane
            </h1>
          )}
        </div>

        {/* User Info */}
        {!collapsed && (
          <div className="mb-6 p-3 bg-white rounded-lg border border-lavender-gray-300">
            <div className="flex items-center space-x-2 mb-1">
              <FontAwesomeIcon icon={faUser} className="text-lavender-gray-600 text-sm" />
              <p className="text-xs font-semibold text-lavender-gray-900 uppercase tracking-wide">
                {role}
              </p>
            </div>
            <p className="text-xs text-lavender-gray-600 truncate" title={email || ''}>
              {email}
            </p>
          </div>
        )}

        {collapsed && (
          <div className="mb-6 flex justify-center">
            <div className="w-10 h-10 bg-lavender-gray-700 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="space-y-2 flex-1">
          <SidebarItem 
            icon={faHouse} 
            label="Dashboard" 
            to="/dashboard" 
            collapsed={collapsed} 
          />
          <SidebarItem 
            icon={faGlasses} 
            label="View Available Courses" 
            to="/courses" 
            collapsed={collapsed} 
          />
          <SidebarItem 
            icon={faChalkboardUser} 
            label="My Courses" 
            to="/my-courses" 
            collapsed={collapsed} 
          />
          
          {role === 'student' && (
            <SidebarItem 
              icon={faRankingStar} 
              label="My Grades" 
              to="/grades" 
              collapsed={collapsed} 
            />
          )}
        </nav>

        {/* Logout Button */}
        <div className="pt-4 border-t border-lavender-gray-300">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center transition-colors
              ${collapsed ? "justify-center" : "space-x-3"}
              text-red-600 hover:bg-red-50
              rounded-lg p-3
              font-medium
            `}
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="text-lg" />
            {!collapsed && <span className="text-sm">Logout</span>}
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
        flex items-center transition-all duration-200
        ${collapsed ? "justify-center" : "space-x-3"}
        ${active
          ? "bg-lavender-gray-700 text-white font-semibold shadow-sm"
          : "text-lavender-gray-900 hover:bg-lavender-gray-200"}
        rounded-lg p-3
      `}
      aria-current={active ? "page" : undefined}
    >
      <FontAwesomeIcon icon={icon} className="text-base" />
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
}

export default Sidebar;