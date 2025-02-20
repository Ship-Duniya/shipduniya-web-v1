import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/utils/axios";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import Pagination from "@/components/custom/Pagination";

const Ndr = ({ loading }) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: new Date(2022, 0, 1),
    to: new Date(),
  });

  const pageSize = 10;

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await axiosInstance.get("/ndr/fetchall");
      if (response.data?.groupedOrders) {
        const allOrders = Object.values(response.data.groupedOrders).flat();
        setOrders(allOrders.map(order => ({
          ...order,
          derivedStatus: order.isCancelled ? 'Cancelled' : 
                        order.failureReason ? 'Failed' : 'Pending'
        })));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = React.useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = searchQuery ?
        Object.values({
          orderId: order.orderId,
          awb: order.awb,
          consignee: order.consignee,
          mobile: order.mobile,
          city: order.city
        }).some(value => value?.toLowerCase().includes(searchQuery.toLowerCase())) : true;

      const orderDate = new Date(order.createdAt);
      const matchesDate = orderDate >= new Date(dateRange.from) && 
                         orderDate <= new Date(dateRange.to);

      const matchesStatus = statusFilter === 'all' ? true : 
                          order.derivedStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [orders, searchQuery, dateRange, statusFilter]);

  const totalItems = filteredOrders.length;
  const lastPageIndex = currentPage * pageSize;
  const firstPageIndex = lastPageIndex - pageSize;
  const currentOrders = filteredOrders.slice(firstPageIndex, lastPageIndex);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-500 text-white';
      case 'failed': return 'bg-red-500 text-white';
      case 'cancelled': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleDownloadExcel = async () => {
    // Implement Excel export logic using order data
  };

  const handleDownloadPDF = () => {
    // Implement PDF export logic using order data
  };

  if (selectedOrder) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => setSelectedOrder(null)} className="mr-2">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Order Details - {selectedOrder.orderId}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Consignee Information</h3>
              <p>Name: {selectedOrder.consignee}</p>
              <p>Address: {selectedOrder.consigneeAddress1}, {selectedOrder.consigneeAddress2}</p>
              <p>City: {selectedOrder.city}</p>
              <p>State: {selectedOrder.state}</p>
              <p>Pincode: {selectedOrder.pincode}</p>
              <p>Mobile: {selectedOrder.mobile}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Shipment Details</h3>
              <p>Courier: {selectedOrder.courier}</p>
              <p>AWB: {selectedOrder.awb}</p>
              <p>Status: <Badge className={getStatusColor(selectedOrder.derivedStatus)}>
                {selectedOrder.derivedStatus}
              </Badge></p>
              {selectedOrder.failureReason && <p>Reason: {selectedOrder.failureReason}</p>}
              <p>Weight: {selectedOrder.actualWeight} kg</p>
              <p>Dimensions: {selectedOrder.length}x{selectedOrder.breadth}x{selectedOrder.height}</p>
              <p>Invoice: {selectedOrder.invoiceNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">NDR Orders</CardTitle>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search orders..."
              className="border rounded-lg px-4 py-2 text-sm w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="export" onClick={() => setIsExporting(true)}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center gap-4 py-4">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <div className="flex gap-2">
            <Button variant={statusFilter === 'all' ? 'default' : 'outline'} onClick={() => setStatusFilter('all')}>
              All
            </Button>
            <Button variant={statusFilter === 'pending' ? 'default' : 'outline'} onClick={() => setStatusFilter('pending')}>
              Pending
            </Button>
            <Button variant={statusFilter === 'failed' ? 'default' : 'outline'} onClick={() => setStatusFilter('failed')}>
              Failed
            </Button>
            <Button variant={statusFilter === 'cancelled' ? 'default' : 'outline'} onClick={() => setStatusFilter('cancelled')}>
              Cancelled
            </Button>
          </div>
        </div>
      </CardHeader>

      <Dialog open={isExporting} onOpenChange={setIsExporting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Orders</DialogTitle>
            <DialogDescription>Choose export format</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleDownloadExcel}>
              <Download className="mr-2 h-4 w-4" /> Excel
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" /> PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CardContent>
        {loadingOrders ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>AWB</TableHead>
                  <TableHead>Courier</TableHead>
                  <TableHead>Consignee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrders.map(order => (
                  <TableRow key={order._id} onClick={() => setSelectedOrder(order)} className="cursor-pointer">
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.awb}</TableCell>
                    <TableCell>{order.courier}</TableCell>
                    <TableCell>{order.consignee}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.derivedStatus)}>
                        {order.derivedStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">Actions</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Ndr;