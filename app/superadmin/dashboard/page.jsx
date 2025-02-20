'use client';
import { useState } from 'react';
import {
  ArrowRightLeft,
  BarChart2,
  Bell,
  ChevronDown,
  FileText,
  LayoutDashboard,
  Menu,
  MenuIcon,
  MessageSquare,
  Minus,
  Package,
  Shield,
  Ticket,
  TicketSlash,
  User,
  Users,
  X,
} from 'lucide-react';

import Sidebar from '@/components/custom/Sidebar';
import Header from '@/components/custom/Header';
import UserDetails from '@/app/admin/dashboard/_components/UserDetails';
import Tickets from '@/app/admin/dashboard/_components/Tickets';
import Staffs from '@/components/custom/Staffs';
import Dashboard from './_components/Dashboard';
import Ndr from './_components/Ndr';
import Analytics from '@/app/admin/dashboard/_components/Analytics';
import Orders from './_components/Orders';
import Transactions from './_components/Transactions';
import RtoRtc from './_components/RtoRtc';
import Remetance from './_components/Remetance';
import Shipment from './_components/Shipment';
import { Button } from '@/components/ui/button';

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

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Users", icon: Users },
    { name: "Staff", icon: Shield },
    { name: "NDR", icon: TicketSlash },
    { name: "Shipment", icon: Package },
    { name: "Analytics", icon: BarChart2 },
    { name: "Transactions", icon: ArrowRightLeft },
    { name: "Remittance", icon: FileText },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'NDR':
        return <Ndr />;
      case 'Users':
        return <UserDetails />;
      case 'Shipment':
        return <Shipment />;
      case 'Analytics':
        return <Analytics />;
      case 'Transactions':
        return <Transactions />;
      case 'Remittance':
        return <Remetance />;
      default:
        return <Staffs />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        title={'SuperAdmin Dashboard'}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        navItems={navItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold flex gap-2">
              {getGreeting()}
              <span>Super Admin</span>
            </h2>
            <span className="flex text-base text-primary gap-2">
              <Minus className="text-primary" /> Welcome to Ship Duniya
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="h-10 bg-gray-100 hover:bg-gray-300"
            >
              <User className="h-6 w-6" />
            </Button>
            <button
          
              className="block lg:hidden"
              onClick={toggleSidebar}
            >
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