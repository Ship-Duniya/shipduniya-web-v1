import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/utils/axios";
import { Input } from "@/components/ui/input";

const ShipOrders = ({
  setIsShipping,
  selectedOrder,
  setSelectedOrder,
  userType,
}) => {
  const [pickupMiniWareHouse, setPickupMiniWareHouse] = useState("");
  const [pickupMasterWareHouse, setPickupMasterWareHouse] = useState("");
  const [rtoMiniWareHouse, setRtoMiniWareHouse] = useState("");
  const [rtoMasterWareHouse, setRtoMasterWareHouse] = useState("");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shippingPartners, setShippingPartners] = useState([]);
  const [wareHouses, setWareHouses] = useState([]);
  const { toast } = useToast();

  const masterWarehouses = [
    {
      name: "Ship Duniya",
      address: "C 45 sec 10 Noida 201301",
    },
  ];

  const fetchPartners = async () => {
    // Validate fields based on userType
    if (userType === "wp" && (!pickupMiniWareHouse || !pickupMasterWareHouse)) {
      toast({
        title: "Please fill all required fields for WP user!",
        variant: "destructive",
      });
      return;
    }

    if (userType === "dp" && !pickupMiniWareHouse) {
      toast({
        title: "Please fill all required fields for DP user!",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const warehouseId =
        userType === "dp" ? pickupMiniWareHouse : pickupMasterWareHouse;
      const response = await axiosInstance.post(
        "/calculate/calculate-shipping-charges",
        { orderIds: selectedOrder, warehouseId }
      );
      console.log(response.data.charges);
      setShippingPartners(response.data.charges);
    } catch (error) {
      toast({
        title: "Failed to fetch shipping partners data! Please reload!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/warehouse");
      console.log(response.data.warehouses);
      setWareHouses(response.data.warehouses);
    } catch (error) {
      toast({
        title: "Failed to fetch shipping partners data! Please reload!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  // Fetch partners when all required fields are filled
  useEffect(() => {
    if (
      (userType === "wp" && pickupMiniWareHouse && pickupMasterWareHouse) ||
      (userType === "dp" && pickupMiniWareHouse)
    ) {
      console.log(pickupMiniWareHouse)
      console.log(pickupMasterWareHouse)
      fetchPartners();
    }
  }, [pickupMiniWareHouse, pickupMasterWareHouse, userType]);

  const handleBookShipment = async () => {
    console.log({
      orderIds: selectedOrder,
      pickupMiniWareHouse,
      rtoMiniWareHouse,
      selectedPartner: selectedPartner,
    });
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/shipping/create-forward-shipping",
        {
          orderIds: selectedOrder,
          pickupMiniWareHouse,
          rtoMiniWareHouse,
          selectedPartner: selectedPartner,
        }
      );

      if (response.status === 200) {
        toast({ title: "Shipment booked successfully!", variant: "success" });
      }
    } catch (error) {
      toast({ title: "Failed to book shipment", variant: "destructive" });
    } finally {
      setLoading(false);
      goBack();
    }
  };

  const goBack = () => {
    setSelectedOrder([]);
    setIsShipping(false);
  };

  const isWpUser = userType === "wp";
  const isShipmentDisabled =
    loading ||
    !pickupMiniWareHouse ||
    !rtoMiniWareHouse ||
    (isWpUser && (!pickupMasterWareHouse || !rtoMasterWareHouse)) ||
    !selectedPartner;

  return (
    <Card className="p-4 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Book Shipment</CardTitle>
          <Button
            variant="outline"
            onClick={goBack}
            className="flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          {/* Mini Warehouses */}
          <div>
            <p className="text-sm font-semibold mb-1">Mini Warehouses</p>
            <Select
              value={pickupMiniWareHouse}
              onValueChange={setPickupMiniWareHouse}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Pickup Warehouse" />
              </SelectTrigger>
              <SelectContent>
                {wareHouses.map((w) => (
                  <SelectItem key={w._id} value={w._id}>
                    {w.name} - {w.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={rtoMiniWareHouse}
              onValueChange={setRtoMiniWareHouse}
              className="mt-3"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Return Warehouse" />
              </SelectTrigger>
              <SelectContent>
                {wareHouses.map((w) => (
                  <SelectItem key={w._id} value={w._id}>
                    {w.name} - {w.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Master Warehouses - Conditional */}
          {isWpUser && (
            <div>
              <p className="text-sm font-semibold mb-1">Master Warehouses</p>
              <Select
                value={pickupMasterWareHouse}
                onValueChange={setPickupMasterWareHouse}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Pickup Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {masterWarehouses.map((w) => (
                    <SelectItem key={w.name} value={w.name}>
                      {w.name} - {w.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={rtoMasterWareHouse}
                onValueChange={setRtoMasterWareHouse}
                className="mt-3"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Return Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {masterWarehouses.map((w) => (
                    <SelectItem key={w.name} value={w.name}>
                      {w.name} - {w.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Shipping Partners Selection */}
        <div className="grid grid-cols-3 gap-4">
          {shippingPartners.map((partner) => (
            <Card
              key={partner.carrierName}
              className={`p-4 cursor-pointer transition-all ${
                selectedPartner?.carrierName === partner.carrierName
                  ? "border-2 border-blue-500 shadow-md"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedPartner(partner)}
            >
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="partner"
                  checked={selectedPartner?.carrierName === partner.carrierName}
                  onChange={() => setSelectedPartner(partner)}
                />
                <div>
                  <p className="font-semibold">{partner.carrierName}</p>
                  <p className="text-gray-500">₹{partner.totalPrice}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Book Shipment Button */}
        <Button
          onClick={handleBookShipment}
          disabled={isShipmentDisabled}
          className="w-full"
        >
          {loading ? "Processing..." : "Book Shipment"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShipOrders;
