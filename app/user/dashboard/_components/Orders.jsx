"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderBalance from "./OrderBalance";
import axiosInstance from "@/utils/axios";
import ShipOrders from "./ShipOrders";
import { useToast } from "@/hooks/use-toast";
import { CopyMinusIcon, CopyPlusIcon, Download, Loader2 } from "lucide-react";
import BulkOrder from "./BulkOrder";
import AccordianButton from "@/components/ui/accordianButton";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import OrdersTable from "./OrdersTable";
import OrderView from "./OrderView";
import OrderForm from "./OrderForm";
import { Button } from "@/components/ui/button";

import Pagination from "../../../../components/custom/Pagination";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Orders({userType}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [isShipping, setIsShipping] = useState(false);
  const [viewDetails, setViewDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    from: new Date(2022, 0, 1),
    to: new Date(),
  });
  const [orderType, setOrderType] = useState("");
  const [viewShipped, setViewShipped] = useState(false);
  const [viewNotShipped, setViewNotShipped] = useState(false);
  const [createForwardSingleOrder, setCreateForwardSingleOrder] =
    useState(false);
  const [createReverseSingleOrder, setCreateReverseSingleOrder] =
    useState(false);
  const [createForwardBulkOrder, setCreateForwardBulkOrder] = useState(false);
  const [createReverseBulkOrder, setCreateReverseBulkOrder] = useState(false);
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // First memoized value for filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const matchesDateRange =
        (!dateRange.from || orderDate >= dateRange.from) &&
        (!dateRange.to || orderDate <= dateRange.to);
      const matchesOrderType =
        orderType && orderType !== "All"
          ? order.orderType?.toLowerCase() === orderType.toLowerCase()
          : true;
      const matchesShippedStatus =
        (viewShipped && order.shipped) ||
        (viewNotShipped && !order.shipped) ||
        (!viewShipped && !viewNotShipped);
      const matchesSearchQuery =
        searchQuery === "" ||
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.telephone.includes(searchQuery.toLowerCase()) ||
        order.mobile.includes(searchQuery.toLowerCase());

      return (
        matchesDateRange &&
        matchesOrderType &&
        matchesShippedStatus &&
        matchesSearchQuery
      );
    });
  }, [orders, dateRange, orderType, viewShipped, viewNotShipped, searchQuery]);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage, pageSize]);

  // Memoized filtered orders

  const handleBackToList = () => {
    setSelectedOrder([]);
    setViewDetails(false);
  };
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/orders");
      setOrders(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders");
    const headings = [
      "Order ID",
      "Date",
      "Method",
      "Consignee",
      "Pincode",
      "Description",
      "Phone",
      "Weight",
      "Quantity",
    ];
    worksheet.addRow(headings);
    filteredOrders.forEach((order) => {
      worksheet.addRow([
        order.orderId,
        new Date(order.createdAt).toLocaleDateString(),
        order.orderType || order.PRODUCT,
        order.consignee,
        order.pincode,
        order.itemDescription || order.ITEM_DESCRIPTION,
        order.mobile || order.MOBILE,
        Math.max(order.actualWeight || 0, order.volumetricWeight || 0),
        order.quantity,
      ]);
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "orders.xlsx");
  };
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Order ID",
      "Date",
      "Method",
      "Consignee",
      "Pincode",
      "Description",
      "Phone",
      "Weight",
      "Quantity",
    ];
    const tableRows = [];
    filteredOrders.forEach((order) => {
      worksheet.addRow([
        order.orderId,
        new Date(order.createdAt).toLocaleDateString(),
        order.orderType || order.PRODUCT,
        order.consignee,
        order.pincode,
        order.itemDescription || order.ITEM_DESCRIPTION,
        order.mobile || order.MOBILE,
        Math.max(order.actualWeight || 0, order.volumetricWeight || 0),
        order.quantity,
      ]);
    });
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });
    doc.save("orders.pdf");
  };
  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const createForwardOrder = async (values) => {
    try {
      const response = await axiosInstance.post(
        "/orders/create-forward-order",
        { order: values }
      );
      if (response.data.success) {
        setCreateForwardSingleOrder(false);
        fetchOrders();
        // toast.success('Order added successfully!');
      }
    } catch (e) {
      console.log(e);
      // toast.error('Unable to create order, try again.');
    }
  };

  const createReverseOrder = async (values) => {
    try {
      const response = await axiosInstance.post(
        "/orders/create-reverse-order",
        { order: values }
      );
      if (response.data.success) {
        setCreateReverseSingleOrder(false);
        fetchOrders();
        toast.success("Order added successfully!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Unable to create order, try again.");
    }
  };

  const handleForwardBulkOrder = async (file) => {
    console.log(file);
    try {
      const response = await axiosInstance.post(
        "/shipping/create-forward-shipping",
        { file }
      );
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const handleReverseBulkOrder = (file) => {
    console.log(file);
  };

  const renderOrderList = () => (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Orders</CardTitle>
            <input
              type="text"
              placeholder="Search by order Id or consignee name"
              className="border rounded-lg px-4 py-2 text-sm w-[50%] focus:outline-none focus:ring focus:ring-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="export"
              size="lg"
              className='h-10'
              onClick={() => setIsExporting((prev) => !prev)}
            >
              <span className="text-lg">+ Export </span>
            </Button>
            <Dialog open={isExporting} onOpenChange={setIsExporting}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Export </DialogTitle>
                  <DialogDescription>
                    Download excel or pickup list.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-around ">
                  <Button
                    variant="outline"
                    onClick={handleDownloadExcel}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Excel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDownloadPDF}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <DatePickerWithRange
                    date={dateRange}
                    setDate={setDateRange}
                  />

                  <div className="w-[120px]">
                    <Select
                      value={orderType}
                      onValueChange={(value) => setOrderType(value)}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="Order type" />
                      </SelectTrigger>
                      <SelectContent>
                        {["All", "prepaid", "COD"].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    className={`text-sm font-semibold px-4 py-2 rounded-lg ${
                      viewShipped ? "bg-primary shadow-lg" : "bg-primary"
                    } text-primary-foreground `}
                    onClick={() => {
                      setViewShipped(!viewShipped);
                      setViewNotShipped(false);
                    }}
                  >
                    View Shipped
                  </button>

                  <button
                    className={`text-sm font-semibold px-4 py-2 rounded-lg ${
                      viewNotShipped ? "bg-primary shadow-lg" : "bg-primary"
                    } text-primary-foreground `}
                    onClick={() => {
                      setViewNotShipped(!viewNotShipped);
                      setViewShipped(false);
                    }}
                  >
                    View Not Shipped
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    variant="export"
                    className='h-8'
                    onClick={() => setCreateForwardSingleOrder(true)}
                  >
                    <span>+ Create Order </span>
                  </Button>

                  <Button
                    variant="export"
                    className='h-8' 
                    onClick={() => setCreateForwardBulkOrder(true)}
                  >
                    <span>+ Bulk Upload </span>
                  </Button>
                </div>
              </div>
              <OrdersTable
                orders={paginatedOrders}
                loading={loading}
                setLoading={setLoading}
                setViewDetails={setViewDetails}
                selectedOrder={selectedOrder}
                setSelectedOrder={setSelectedOrder}
                setIsShipping={setIsShipping}
                fetchOrders={fetchOrders}
              />

              <Pagination
                currentPage={currentPage}
                totalItems={filteredOrders.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </>
  );

  const renderView = () => {
    if (createForwardSingleOrder) {
      return (
        <OrderForm
          onSubmit={createForwardOrder}
          setIsAddingOrder={setCreateForwardSingleOrder}
        />
      );
    }
    if (createReverseSingleOrder) {
      return (
        <OrderForm
          onSubmit={createReverseOrder}
          setIsAddingOrder={setCreateReverseSingleOrder}
        />
      );
    }
    if (viewDetails) {
      return (
        <OrderView order={selectedOrder} handleBackToList={handleBackToList} />
      );
    }
    if (isShipping) {
      return (
        <ShipOrders
          setIsShipping={setIsShipping}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          userType={userType}
        />
      );
    }
    return renderOrderList();
  };

  return (
    <div className="space-y-6">
      {renderView()}
      <BulkOrder
        isOpen={createForwardBulkOrder}
        setIsOpen={setCreateForwardBulkOrder}
        onUpload={handleForwardBulkOrder}
      />
      <BulkOrder
        isOpen={createReverseBulkOrder}
        setIsOpen={setCreateReverseBulkOrder}
        onUpload={handleReverseBulkOrder}
      />
    </div>
  );
}
