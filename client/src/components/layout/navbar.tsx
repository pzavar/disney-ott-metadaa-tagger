import React from "react";
import { Menu, Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
      <button
        type="button"
        className="md:hidden px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0063e5]"
        onClick={onToggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>

      {/* Search */}
      <div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-2xl">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5" />
              </div>
              <Input
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#0063e5] focus:border-[#0063e5] sm:text-sm"
                placeholder="Search by title, genre, or tag"
                type="search"
                value={props.searchQuery}
                onChange={(e) => props.onSearchChange?.(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="ml-4 flex items-center md:ml-6 space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0063e5]"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
          </Button>

          <Button 
            className="bg-[#0063e5] hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0063e5]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
