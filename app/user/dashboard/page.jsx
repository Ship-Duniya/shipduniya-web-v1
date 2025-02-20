"use client";

import { useEffect, useState } from "react";
import {
  MenuIcon,
  Package,
  Ticket,
  User,
  Ship,
  Settings,
  ArrowLeftRight,
  CalculatorIcon,
  Plus,
  ArrowRight,
  Cross,
  LayoutDashboard,
  Minus,
  LocateFixed,
} from "lucide-react";
import Sidebar from "@/components/custom/Sidebar";
import Tickets from "./_components/Tickets";
import Profile from "./_components/Profile";
import RateCalculator from "./_components/RateCalculator";
import Transactions from "./_components/Transactions";
import CreateOrder from "./_components/CreateOrder";
import Orders from "./_components/Orders";
import Shipping from "./_components/Shipping";
import Ndr from "./_components/Ndr";
import Remetences from "./_components/Remetences";
import DashboardView from "./_components/Dashboard";
import UserSettings from "./_components/Settings";
import { Button } from "@/components/ui/button";
import OrderBalance from "./_components/OrderBalance";
import axiosInstance from "@/utils/axios";
import TrackOrder from "./_components/TrackOder";

export default function Dashboard() {
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState(null);

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        console.log("user response : ", response.data);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // console.log("user data : ", userData);

  const toggleSidenav = () => setIsSidenavOpen(!isSidenavOpen);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Orders", icon: Package },
    { name: "Shipments", icon: Ship },
    { name: "NDR", icon: Cross },
    { name: "Tickets", icon: Ticket },
    { name: "Transactions", icon: ArrowLeftRight },
    { name: "Remittance", icon: ArrowRight },
    { name: "Calculate", icon: CalculatorIcon },
    { name: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return <DashboardView />;
      case "Orders":
        return <Orders userType={userData.userType} />;
      case "Shipments":
        return <Shipping />;
      case "NDR":
        return <Ndr />;
      case "Settings":
        return <UserSettings />;
      case "Tickets":
        return <Tickets />;
      case "Remittance":
        return <Remetences />;
      case "Profile":
        return <Profile />;
      case "Calculate":
        return <RateCalculator customerType={userData.customerType} />;
      case "Transactions":
        return <Transactions />;

      default:
        return null;
    }
  };

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
      return " Good morning!";
    } else if (hour < 18) {
      return "Good afternoon!";
    } else {
      return "Good evening!";
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        sidebarOpen={isSidenavOpen}
        toggleSidebar={toggleSidenav}
        navItems={navItems}
        activeTab={activeSection}
        setActiveTab={setActiveSection}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold flex gap-2">
              {getGreeting()}
              <span>{userData?.name}</span>
            </h2>
            <span className="flex text-base text-primary gap-2">
              <Minus className="text-primary" /> Welcome to Ship Duniya
            </span>
          </div>
          <div className="flex items-center gap-3">
            <TrackOrder />
            <OrderBalance />

            <Button
              variant="ghost"
              className="h-10 bg-gray-100 hover:bg-gray-300"
              onClick={() => setActiveSection("Profile")}
            >
              <User profile={profile} className="h-6 w-6" />
            </Button>
            <button onClick={toggleSidenav} className="block lg:hidden">
              <MenuIcon size={24} />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 px-6 py-2">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
