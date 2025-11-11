import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Bell, Sun, Moon } from "lucide-react"
import ExpandableSearch from './common/ExpandableSearch'

const DashboardHeader = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const username = "Test Admin"; // Replace with dynamic username if needed
  const [greeting, setGreeting] = useState("");

  // Update date & time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update greeting every minute
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) setGreeting(`Good Morning, ${username}`);
      else if (hour >= 12 && hour < 16) setGreeting(`Good Afternoon, ${username}`);
      else setGreeting(`Good Evening, ${username}`);
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60 * 1000);
    return () => clearInterval(interval);
  }, [username]);

  const formattedDate = dateTime.toLocaleDateString("en-GB"); // DD/MM/YYYY
  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Toggle light/dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode); // Tailwind dark mode
  }

  return (
    <div className="w-full">
      <header className="w-full h-auto py-2 flex items-center justify-between px-4 md:px-8 bg-white">
        <div className="w-[120px] sm:w-[200px] md:hidden"></div> {/* placeholder to balance layout */}
        
        <div className="hidden sm:block text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-200">
          {greeting}
        </div>

        {/* Center: Date & Time */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600">
          <span>{formattedDate}</span>
          <span>|</span>
          <span>{formattedTime}</span>
        </div>

        {/* Right: Icons + User */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <ExpandableSearch />

          {/* Light/Dark Mode Toggle */}
          <button
            className='relative text-gray-600 hover:text-gray-800 cursor-pointer'
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Moon /> : <Sun />}
          </button>

          {/* Notifications */}
          <button className="relative text-gray-600 hover:text-gray-800 cursor-pointer">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>
          </button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
              <Avatar>
                <AvatarImage src="/user.jpg" />
                <AvatarFallback>TA</AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-medium">Test Admin</span>
                <span className="text-xs text-gray-400">HR/Admin</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  )
}

export default DashboardHeader;
