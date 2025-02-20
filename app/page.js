"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Download, Menu, Package } from "lucide-react";
import HomePage from "@/components/home/HomePage";
import AboutPage from "@/components/home/AboutPage";
import ContactPage from "@/components/home/ContactPage";
import RaiseTicketPage from "@/components/home/RaiseTicketPage";
import FAQPage from "@/components/home/FAQPage";
import TermsPage from "@/components/home/TermsPage";
import PrivacyPage from "@/components/home/PrivacyPage";
import Link from "next/link";
import logo from "../public/shipDuniya.png";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/utils/axios"; // Assuming axiosInstance is defined in utils
import Footer from "@/components/home/Footer";

export default function LandingPage() {
  const [currentPage, setCurrentPage] = useState("home");
  const [track, setTrack] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isParcelDetailsOpen, setIsParcelDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shippingPartner, setShippingPartner] = useState("");

  const trackParcel = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/shipping/track-without-login",
        { courier: shippingPartner, awb: trackingNumber }
      );
      console.log("API Response:", response.data);
      console.log("after api call..");
      setTrack(response.data);
    } catch (error) {
      console.error("Error tracking parcel:", error);
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTrackParcel = () => {
    trackParcel();
    setIsTracking(false);
    setIsParcelDetailsOpen(true);
  };

  const ParcelDetailsDialog = () => (
    <Dialog open={isParcelDetailsOpen} onOpenChange={setIsParcelDetailsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            Parcel Details
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p>
            <strong>Tracking Number:</strong> {trackingNumber}
          </p>
          {track && (
            <div>
              <p>
                <strong>Status:</strong> {track.status}
              </p>
              <p>
                <strong>Estimated Delivery:</strong> {track.estimatedDelivery}
              </p>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-around">
          <Button
            onClick={() => setIsParcelDetailsOpen(false)}
            className="w-full bg-red-600 text-white"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage setCurrentPage={setCurrentPage} />;
      case "about":
        return <AboutPage />;
      case "contact":
        return <ContactPage />;
      case "terms":
        return <TermsPage />;
      case "privacy":
        return <PrivacyPage />;
      default:
        return <HomePage />;
    }
  };

  const NavItems = ({ currentPage, setPage, closeSheet }) => (
    <ul className="flex gap-14 max-md:flex-col flex-row gap-4 max-md:space-y-4">
      {[
        { label: "Home", page: "home" },
        { label: "About", page: "about" },
        { label: "Contact", page: "contact" },
      ].map((item) => (
        <li key={item.page}>
          <button
            onClick={() => {
              setPage(item.page);
              closeSheet();
            }}
            className={
              currentPage === item.page
                ? "relative bg-black/80 text-white  rounded-lg py-1 px-3 after:content-[''] after:block after:w-0 after:h-[2px]"
                : "relative text-black/80 hover:bg-black/80 hover:text-white transition duration-300 rounded-lg py-1 px-3 "
            }
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-secondary py-4 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto flex justify-between items-center relative">
          <button
            onClick={() => setCurrentPage("home")}
            className="text-3xl font-bold flex gap-2"
          >
            Ship Duniya
          </button>
          <nav className="hidden md:block">
            <NavItems
              currentPage={currentPage}
              setPage={setCurrentPage}
              closeSheet={() => document.body.click()}
            />
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" color="black" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col h-full py-6">
                <NavItems
                  setPage={setCurrentPage}
                  closeSheet={() => document.body.click()}
                />
                <div className="mt-4 flex flex-col items-center gap-3">
                  <Link href="/track">
                    <Button className="flex items-center gap-2 w-60 bg-blue-600 hover:bg-blue-700 transition">
                      <Package />
                      <span>Track</span>
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button className="w-60 bg-primary text-white border hover:bg-primary-dark transition">
                      Sign In
                    </Button>
                  </Link>
                    <Button className="w-60 bg-primary text-white border border-black hover:bg-primary-dark transition">
                  <Link href="/signup">
                      Sign Up
                  </Link>
                    </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="hidden md:flex space-x-2">
            <Button
              className="flex gap-2 bg-primary text-white"
              onClick={() => setIsTracking(true)}
            >
              <Package className=" h-4 w-4" />
              Track
            </Button>

            {/* First Dialog: Track Parcel */}
            <Dialog open={isTracking} onOpenChange={setIsTracking}>
              <DialogContent className="sm:max-w-[425px] h-[300px]">
                <DialogHeader>
                  <DialogTitle className="font-bold text-2xl">
                    Track Parcel
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <Select
                    value={shippingPartner}
                    onValueChange={(value) => setShippingPartner(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select shipping partner" />
                    </SelectTrigger>
                    <SelectContent>
                      {["xpressbees", "ecom", "delhivery"].map((partner) => (
                        <SelectItem key={partner} value={partner}>
                          {partner}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    label="Enter AWB Number"
                    type="text"
                    placeholder="Enter AWB Number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value.trim())}
                    className="w-full outline-none focus:ring-2 focus:ring-offset-2"
                  />
                </div>
                <DialogFooter className="flex justify-around">
                  <Button
                    onClick={handleTrackParcel}
                    className="bg-primary text-white mx-auto"
                    size="lg"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Track Parcel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Second Dialog: Parcel Details */}
            {isParcelDetailsOpen && <ParcelDetailsDialog />}

            <Link href="/login">
              <Button variant="secondary">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button variant="secondary">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className=" flex flex-col">{renderPage()}</main>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
