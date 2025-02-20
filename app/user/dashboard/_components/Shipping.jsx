import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axios';
import ShipmentTable from './ShipmentTable';
import ShipmentDetails from './ShipmentDetails';
import Pagination from '../../../../components/custom/Pagination';

const Shipping = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [viewDetails, setViewDetails] = useState(false);
  const [viewTracking, setViewTracking] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/shipping/userShipments');
      setShipments(response.data);
    } catch (error) {
      console.error('Error fetching shipments:', error);
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

  const paginatedShipments = shipments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
      <div className="flex flex-col">
        <div className="flex-grow">
          <ShipmentTable 
            shipments={paginatedShipments}
            loading={loading} 
            selectedShipments={selectedShipments} 
            setSelectedShipments={setSelectedShipments}
            setViewTracking={setViewTracking} 
            setViewDetails={setViewDetails}
          />
        </div>
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalItems={shipments.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    );
  };

  return <>{renderView()}</>;
};

export default Shipping;