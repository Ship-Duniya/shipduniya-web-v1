"use client";
import { useEffect, useState } from "react";
import {
  Ticket,
  Users,
  Ship,
  LayoutDashboard,
  User,
  MenuIcon,
  Minus,
} from "lucide-react";
import Tickets from "./_components/Tickets";
import Sidebar from "@/components/custom/Sidebar";
import Dashboard from "./_components/Dashboard";
import Ndr from "./_components/Ndr";
import { Button } from "@/components/ui/button";
import Profile from "./_components/Profile";
import axiosInstance from "@/utils/axios";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Tickets", icon: Ticket },
    { name: "NDR", icon: Ship },
  ];

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning!";
    } else if (hour < 18) {
      return "Good afternoon!";
    } else {
      return "Good evening!";
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Tickets":
        return <Tickets />;
      case "Profile":
        return <Profile setActiveTab={setActiveTab}/>;
      case "NDR":
        return <Ndr />;
      default:
        return <Dashboard />;
    }
  };
  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get("/users/profile");
      console.log("user response : ", response.data);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        navItems={navItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold flex gap-2">
              {getGreeting()}
              {console.log(userData?.name)}
              <span>{userData?.name}</span>
            </h2>
            <span className="flex text-base text-primary gap-2">
              <Minus className="text-primary" /> Welcome to Ship Duniya
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="h-10 bg-gray-100 hover:bg-gray-300"
              onClick={() => setActiveTab("Profile")}
            >
              <User profile={profile} className="h-6 w-6" />
            </Button>
            <button onClick={toggleSidebar} className="block lg:hidden">
              <MenuIcon size={24} />
            </button>
          </div>
        </header>
        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
