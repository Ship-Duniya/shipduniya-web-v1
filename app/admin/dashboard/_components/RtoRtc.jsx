import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axios";
import ShipmentTable from "./ShipmentTable";
import ShipmentDetails from "./ShipmentDetails";
import RtoTable from "./RtoTable";

const RtoRtc = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [viewDetails, setViewDetails] = useState(false);
  const [viewTracking, setViewTracking] = useState(false);
  const [deliveredOrders, setDeliveredOrders] = useState([]);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("admin/rtcorders");
      console.log("pending res : ", response.data);
      setShipments(response.data);
      const delivered = response.data.flatMap((user) => user.deliveredOrders);
      console.log("delivered order :", delivered);
      setDeliveredOrders(delivered);
    } catch (error) {
      console.error("Error fetching shipments:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchShipments();
  }, []);

  const handleBackToList = () => {
    setSelectedShipments([]);
    setViewDetails(false);
    setViewTracking(false);
  };
  const renderView = () => {
    if (viewDetails) {
      return (
        <ShipmentDetails
          details={selectedShipments}
          handleBackToList={handleBackToList}
        />
      );
    }
    if (viewTracking) {
      return (
        <ShipmentDetails
          details={selectedShipments}
          isTracking={true}
          handleBackToList={handleBackToList}
        />
      );
    }
    return (
      <RtoTable
        shipments={shipments}
        loading={loading}
        deliveredOrders={deliveredOrders}
        selectedShipments={selectedShipments}
        setSelectedShipments={setSelectedShipments}
        setViewTracking={setViewTracking}
        setViewDetails={setViewDetails}
      />
    );
  };

  return <>{renderView()}</>;
};

export default RtoRtc;
