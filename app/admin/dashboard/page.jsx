"use client";
import { useState, useEffect } from "react";
import {
  BarChart2,
  Bell,
  ChevronDown,
  FileText,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Package,
  Ticket,
  User,
  Users,
  X,
  MenuIcon,
  Minus,
  ClockArrowDown,
} from "lucide-react";

import { capitalizeFirstLetter } from "@/utils/helpers";
import UserDetails from "./_components/UserDetails";
import Orders from "./_components/Orders";
import Tickets from "./_components/Tickets";
import Content from "./_components/Content";
import Dashboard from "./_components/Dashboard";
import Sidebar from "@/components/custom/Sidebar";
import Header from "@/components/custom/Header";
import Analytics from "./_components/Analytics";
import Profile from "./_components/Profile";
import { Button } from "@/components/ui/button";
import Remetance from "./_components/Remetance";
import Staff from "./_components/Staff";
import Transactions from "./_components/Transactions";
import RtoRtc from "./_components/RtoRtc";
import axiosInstance from "@/utils/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PendingPickups from "./_components/PendingPickups";

export default function AdminDashboard({type}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm();

  useEffect(() => {
    // Fetch user data
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        // console.log("Profile Data:", response.data);
        setUserData(response.data);
        setValue("_id", response.data._id);
        setValue("id", response.data.userId);
        setValue("name", response.data.name);
        setValue("email", response.data.email);
        setValue("phone", response.data.phone);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [setValue]);
  console.log("Profile Data:", userData);

  const onSubmit = async (data) => {
    // console.log("data :",data);
    try {
      const updatedData = {
        name: data.name,
        phone: data.phone,
      };
      const response = await axiosInstance.put(
        `/users/profile`,
        updatedData
      );
      console.log("Updated Profile Data:", response.data);
      alert("Profile updated successfully!");

      // Close the dialog
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Users", icon: Users },
    { name: "Staff", icon: Users },
    { name: "Shipments", icon: Package },
    { name: "Pending Pickups", icon: ClockArrowDown },
    { name: "RTO/RTC", icon: Package },
    { name: "Analytics", icon: BarChart2 },
    { name: "Remittance", icon: FileText },
    { name: "Transactions", icon: Ticket },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Users":
        return <UserDetails />;
      case "Staff":
        return <Staff />;
      case "Shipments":
        return <Orders />;
      case "Pending Pickups":
        return <PendingPickups userDetails={userData}/>;

      case "Analytics":
        return <Analytics />;
      case "RTO/RTC":
        return <RtoRtc />;
      case "Profile":
        return <Profile />;
      case "Remittance":
        return <Remetance userDetails={userData}/>;
      case "Transactions":
        return <Transactions userDetails={userData}/>;
      default:
        return <Dashboard />;
    }
  };

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        title={"Ship Duniya"}
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
              <span className="text-blue-500">{userData?.name}</span>
            </h2>
            <span className="flex text-base text-primary gap-2">
               Welcome to Ship Duniya
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="h-10 bg-gray-100 hover:bg-gray-300"
              onClick={() => setIsProfileOpen(true)}
            >
              {/* <Profile /> */}
              <User className="h-6 w-6" />
            </Button>
            {/* Profile Dialog */}
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <DialogContent className="bg-white rounded-3xl shadow px-4">
                <DialogHeader>
                  <DialogTitle>
                    Edit {capitalizeFirstLetter(type)} Details
                  </DialogTitle>
                </DialogHeader>
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  <Card className="w-full p-0 max-w-2xl mx-auto border-none shadow-none">
                    <CardHeader>
                      <CardTitle>
                        {capitalizeFirstLetter(type)} Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="id">
                              {capitalizeFirstLetter(type)} ID
                            </Label>
                            <Input id="id" {...register("id")} disabled />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              {...register("name", {
                                required: "Name is required",
                              })}
                            />
                            {errors.name && (
                              <p className="text-red-500">
                                {errors.name.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              {...register("email", {
                                required: "Email is required",
                                pattern: {
                                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                  message: "Email is not valid",
                                },
                              })}
                              disabled
                            />
                            {errors.email && (
                              <p className="text-red-500">
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              type="tel"
                              {...register("phone", {
                                minLength: {
                                  value: 10,
                                  message: "Phone number must be 10 digits",
                                },
                                maxLength: {
                                  value: 10,
                                  message: "Phone number must be 10 digits",
                                },
                              })}
                            />
                            {errors.phone && (
                              <p className="text-red-500">
                                {errors.phone.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-8 -mb-6">
                          <Button className="border-none" variant="outline" onClick={() => setIsProfileOpen(false)} >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white rounded-[10px]"
                          >
                           {loading ? "Updating..." : "Update"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </DialogContent>
            </Dialog>
            <button onClick={toggleSidebar} className="block lg:hidden">
              <MenuIcon size={24} />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
