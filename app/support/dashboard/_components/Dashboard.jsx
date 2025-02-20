import axiosInstance from "@/utils/axios";
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DashboardCard from "@/components/custom/DashboardCard";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState(null);
  const [ndrs, setNdrs] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/support/matrics");
      console.log("Dashboard res : ", response.data);
      setTickets(response.data.tickets);
      setNdrs(response.data.ndrs);
    } catch (err) {
      setError("Failed to load dashboard!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboard();
  }, []);

  const filteredData = () => {
    const filterByDate = (data) => {
      return data?.filter((item) => {
        const [day, month, year] = item.date.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return (
          dateRange?.from &&
          dateRange?.to &&
          date >= dateRange.from &&
          date <= dateRange.to
        );
      });
    };

    const sumValues = (data) =>
      data?.reduce((sum, item) => sum + item.value, 0) || 0;

    return {
      openTickets: sumValues(filterByDate(tickets?.openTickets)),
      inProgressTickets: sumValues(filterByDate(tickets?.inProgressTickets)),
      resolvedTickets: sumValues(filterByDate(tickets?.resolvedTickets)),
      openNdrs: sumValues(filterByDate(ndrs?.openNdrs)),
      rtoNdrs: sumValues(filterByDate(ndrs?.rtoNdrs)),
      deliveredNdrs: sumValues(filterByDate(ndrs?.deliveredNdrs)),
    };
  };

  const counts = filteredData();

  const ticketsData = [
    { name: "Open Tickets", value: counts.openTickets, color: "#0088FE" },
    {
      name: "In Progress Tickets",
      value: counts.inProgressTickets,
      color: "#00C49F",
    },
    {
      name: "Resolved Tickets",
      value: counts.resolvedTickets,
      color: "#FFBB28",
    },
  ];

  const ndrsData = [
    { name: "Open NDR", value: counts.openNdrs, color: "#00CED1" },
    { name: "Delivered NDR", value: counts.deliveredNdrs, color: "#800080" },
    { name: "RTO NDR", value: counts.rtoNdrs, color: "#FFA500" },
  ];

  const COLORS = ["#28A745", "#FF6347", "#FFD700", "#007BFF", "#DC3545"];

  return (
    <Card className="w-full h-full overflow-hidden">
      <div className="p-4 h-full overflow-auto">
        <CardContent className="mt-4">
          <div className="flex flex-wrap align-center justify-between mb-3">
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-3">Ticket Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DashboardCard title="Pending" value={counts.openTickets} />
              <DashboardCard
                title="In Progress"
                value={counts.inProgressTickets}
              />

              <DashboardCard title="Resolved" value={counts.resolvedTickets} />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">NDR Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DashboardCard title="Open NDR" value={counts.openNdrs} />
              <DashboardCard
                title="Delivered NDR"
                value={counts.deliveredNdrs}
              />
              <DashboardCard title="RTO NDR" value={counts.rtoNdrs} />
            </div>
          </div>

          <div className="h-[400px] flex flex-wrap justify-around items-center mt-8 border-t-2 pt-4 pb-4 ">
            <div className="w-[40%] h-full">
              <h2 className="text-xl font-semibold text-center mb-4">
                Ticket Chart
              </h2>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ticketsData} dataKey="value" /* other props */>
                    {ticketsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-[40%] h-full">
              <h2 className="text-xl font-semibold text-center mb-4">
                NDR Chart
              </h2>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ndrsData} dataKey="value" /* other props */>
                    {ndrsData.map((entry, index) => (
                      <Cell
                        key={`cell2-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default Dashboard;
