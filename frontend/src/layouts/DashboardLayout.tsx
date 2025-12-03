import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar (fixed left) */}
      <Sidebar />

      {/* Page content */}
      <div className="flex-1 p-6 bg-gray-50 max-h-screen overflow-y-auto">
        <Outlet /> 
      </div>
    </div>
  );
}