"use client";

import { useState } from "react";
import { Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/utils/axios";

// Separate component for Parcel Details Dialog
const ParcelDetailsDialog = ({
  isOpen,
  setIsOpen,
  trackingNumber,
  trackingDetails,
}) => (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="font-bold text-2xl">Parcel Details</DialogTitle>
      </DialogHeader>
      <div className="p-4">
        <p>
          <strong>Tracking Number:</strong> {trackingNumber}
        </p>
        {trackingDetails && (
          <div>
            <p>
              <strong>Status:</strong> {trackingDetails.status}
            </p>
            <p>
              <strong>Estimated Delivery:</strong>{" "}
              {trackingDetails.estimatedDelivery}
            </p>
            {/* Add any other details you get from the response */}
          </div>
        )}
      </div>
      <DialogFooter className="flex justify-around">
        <Button
          onClick={() => setIsOpen(false)}
          className="w-full bg-red-600 text-white"
        >
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default function TrackParcelDialog() {
  // States for the first dialog
  const [isOpen, setIsOpen] = useState(false);
  const [awbNumber, setAwbNumber] = useState("");
  const [shippingPartner, setShippingPartner] = useState("");
  const [loading, setLoading] = useState(false);
  const [isParcelDetailsOpen, setIsParcelDetailsOpen] = useState(false);
  const [trackingDetails, setTrackingDetails] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/shipping/track-without-login",
        { courier: shippingPartner, awb: awbNumber }
      );
      setTrackingDetails(response.data);
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="flex h-10 gap-2 bg-primary text-white"
          >
            <Package className=" h-4 w-4" />
            Track
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] h-[300px]">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Track Parcel
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Select value={shippingPartner} onValueChange={setShippingPartner}>
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
              type="text"
              value={awbNumber}
              onChange={(e) => setAwbNumber(e.target.value.trim())}
              className="w-full outline-none focus:ring-2 focus:ring-offset-2"
              placeholder="Enter AWB Number"
            />
          </div>

          <DialogFooter className="flex justify-around">
            <Button
              onClick={handleSubmit}
              className="bg-primary text-white mx-auto"
              disabled={loading || !awbNumber.trim() || !shippingPartner}
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : (
                <>
                  <Package className="mr-2 h-4 w-4" />
                  Track Parcel
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ParcelDetailsDialog
        isOpen={isParcelDetailsOpen}
        setIsOpen={setIsParcelDetailsOpen}
        trackingNumber={awbNumber}
        trackingDetails={trackingDetails}
      />
    </>
  );
}
