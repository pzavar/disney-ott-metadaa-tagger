import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import DisneyLogo from "@/components/ui/disney-logo";
import {
  Home,
  Film,
  Settings,
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, children, isActive }) => {
  const linkClass = cn(
    "flex items-center px-4 py-3 text-base font-medium rounded-md",
    isActive
      ? "bg-gray-800 text-white"
      : "text-gray-300 hover:bg-gray-700 hover:text-white"
  );

  return (
    <div className={linkClass} onClick={() => window.location.href = href}>
      <div className="mr-3 h-5 w-5">{icon}</div>
      {children}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const [location] = useLocation();

  return (
    <div className="flex flex-col w-64 bg-[#192133] text-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-700">
        <div className="flex items-center">
          <DisneyLogo />
          <h1 className="ml-2 text-xl font-bold font-['Source_Sans_Pro']">Disney+ Tagger</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide pt-5 pb-4">
        <div className="px-4 space-y-1">
          <NavItem href="/" icon={<Home />} isActive={location === "/"}>
            Dashboard
          </NavItem>
          <NavItem
            href="/content-library"
            icon={<Film />}
            isActive={location === "/content-library"}
          >
            Content Library
          </NavItem>
          <NavItem
            href="/settings"
            icon={<Settings />}
            isActive={location === "/settings"}
          >
            Settings
          </NavItem>
        </div>
      </nav>

      {/* User Profile */}
      <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
        <div className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div>
              <div className="inline-block h-9 w-9 rounded-full bg-gray-600 text-white flex items-center justify-center">
                <span className="font-medium text-sm">AU</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs font-medium text-gray-300">Content Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
