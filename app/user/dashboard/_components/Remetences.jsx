import React from 'react'
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Loader2, Package  } from 'lucide-react';
import axiosInstance from '@/utils/axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import ShipmentTable from './ShipmentTable';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RemetanceTable from './RemetanceTable';

function RemetanceCard({ title, value }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-700">{value}</p>
    </div>
  );
}

const Remetences = () => {
    const [dashboard, setDashboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ from: new Date(2024, 0, 1), to: new Date() });
    const [shippingPartner, setShippingPartner] = useState('All');
    const [selectedShipments, setSelectedShipments] = useState([]);

    const fetchDashboard = async () => {
        setLoading(true);
        try {
          const params = {
            from: dateRange.from.toISOString(),
            to: dateRange.to.toISOString(),
            partner: shippingPartner === 'All' ? undefined : shippingPartner
          };
          const response = await axiosInstance.get('/users/codremittance', { params });
          setDashboard(response.data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchDashboard();
      }, [dateRange, shippingPartner]);

      const toggleSelectShipment = (shipment) => {
        setSelectedShipments(prev => 
          prev.includes(shipment._id)
            ? prev.filter(id => id !== shipment._id)
            : [...prev, shipment._id]
        );
      };

      const viewDetails = (shipment) => {
        // Implement view details logic
        console.log('View details:', shipment);
      };

      const pendingRemetance = dashboard.reduce(
        (sum, shipment) => sum + (shipment.collectableValue || 0),
        0
      );
        
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="mb-4">COD Remittance</CardTitle>
          <div className="flex flex-wrap align-center justify-between gap-4">
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            <div className="w-[228px]">
              <Select
                value={shippingPartner}
                onValueChange={setShippingPartner}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping partner" />
                </SelectTrigger>
                <SelectContent>
                  {["All", "Expressbeez", "ECom", "Delhivery"].map((partner) => (
                    <SelectItem key={partner} value={partner}>
                      {partner}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <RemetanceCard
                  title="Total Remittance"
                  value={`₹${pendingRemetance.toLocaleString()}`}
                />
                <RemetanceCard
                  title="Paid Remittance"
                  value="₹0"
                />
                <RemetanceCard
                  title="Next Expected Remittance"
                  value="₹0"
                />
                <RemetanceCard
                  title="Remaining Remittance"
                  value={`₹${pendingRemetance.toLocaleString()}`}
                />
              </div>
              <div>
                <RemetanceTable 
                  shipments={dashboard}
                  selectedShipments={selectedShipments}
                  toggleSelectShipment={toggleSelectShipment}
                  viewDetails={viewDetails}
                  dateRange={dateRange}
                  shippingPartner={shippingPartner}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
}

export default Remetences;