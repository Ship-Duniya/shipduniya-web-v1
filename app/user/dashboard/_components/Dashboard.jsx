import axiosInstance from '@/utils/axios';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function DashboardCard({ title, value }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-700">{value}</p>
    </div>
  );
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState("");
  const [dateRange, setDateRange] = useState({ from: new Date(2023, 0, 1), to: new Date() });
  const [shippingPartner, setShippingPartner] = useState('All');

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/users/matrics");
      setDashboard(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(()=>{
    fetchDashboardData();
  }, [])

  const filteredData = () => {
    const filterByDate = (data) => {
      return data?.filter(item => {
        const [day, month, year] = item.date.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return dateRange?.from && dateRange?.to && date >= dateRange.from && date <= dateRange.to;
      });
    };
    
    

    const filterByPartner = (data) => {
      if (shippingPartner === 'All') {
        return data;
      }
      return data.filter(item => item.partner === shippingPartner.toLowerCase());
    };

    const filterAndCount = (data) => {
      let filtered = filterByDate(data);
      filtered = filterByPartner(filtered);
      return filtered?.length;
    };

    const totalDeliveredCount = filterAndCount(dashboard?.totaldelivered);
    const totalInTransitCount = filterAndCount(dashboard?.totalIntransit);
    const totalLostCount = filterAndCount(dashboard?.totallost);
    const totalParcelsCount = filterAndCount(dashboard?.totalparcels);
    const totalPendingPickupCount = filterAndCount(dashboard?.totalpendingpickup);
    const totalRTOCount = filterAndCount(dashboard?.totalrto);

    return {
      totalDeliveredCount,
      totalInTransitCount,
      totalLostCount,
      totalParcelsCount,
      totalPendingPickupCount,
      totalRTOCount,
    };
  };

  const counts = filteredData();

  const data = [
    { name: 'Delivered', value: counts.totalDeliveredCount },
    { name: 'RTO', value: counts.totalRTOCount },
    { name: 'Pending-Pickup', value: counts.totalPendingPickupCount },
    { name: 'In-Transit', value: counts.totalInTransitCount },
    { name: 'Lost', value: counts.totalLostCount },
  ];

  const COLORS = ['#28A745', '#FF6347', '#FFD700', '#007BFF', '#DC3545'];

  return (
    <Card className="w-full">
      <CardContent className="mt-4">
        <div className="flex flex-wrap align-center justify-between mb-3">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <div className="w-[228px]">
            <Select value={shippingPartner} onValueChange={setShippingPartner}>
              <SelectTrigger >
                <SelectValue placeholder="Select shipping partner" />
              </SelectTrigger>
              <SelectContent>
                {["All", "Xpressbees", "Ecom", "Delhivery"].map((partner) => (
                  <SelectItem key={partner} value={partner}>
                    {partner}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard title="Total Parcels" value={counts.totalParcelsCount} />
          <DashboardCard title="Total Delivered" value={counts.totalDeliveredCount} />
          <DashboardCard title="Total RTO" value={counts.totalRTOCount} />
          <DashboardCard title="Total Pending Pickup" value={counts.totalPendingPickupCount} />
          <DashboardCard title="Total In-Transit" value={counts.totalInTransitCount} />
          <DashboardCard title="Total Lost" value={counts.totalLostCount} />
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default Dashboard;
