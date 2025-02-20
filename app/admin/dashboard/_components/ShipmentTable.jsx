import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Clock4,
  Eye,
  Loader2,
  Package,
  ReceiptText,
  Plus,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ShipmentTable = ({
  shipments,
  loading,
  setSelectedShipments,
  selectedShipments,
  setViewTracking,
  setViewDetails,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    from: new Date(2022, 0, 1),
    to: new Date(),
  });
  const [orderType, setOrderType] = useState("");
  const [partnerType, setPartnerType] = useState("");
  const [shipmentStatus, setShipmentStatus] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const filteredShippings = shipments.filter((shipment) => {
    const matchesSearchQuery = searchQuery
      ? shipment.consignee?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.awbNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.orderId?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesDateRange =
      new Date(shipment.createdAt) >= new Date(dateRange.from) &&
      new Date(shipment.createdAt) <= new Date(dateRange.to);

    const matchesOrderType =
      orderType === "All" || orderType === ""
        ? true
        : shipment.orderType === orderType ||
          ((shipment.orderType === "prepaid" || shipment.orderType === "PPD") &&
            orderType === prepaid)
        ? true
        : false;

    const matchesPartnerType =
      partnerType === "" || partnerType === "All"
        ? true
        : shipment.PARTNER_Name.includes(partnerType);
    const matchesShipmentStatus =
      shipmentStatus === "" ? true : shipment.status === shipmentStatus;

    return (
      matchesSearchQuery &&
      matchesDateRange &&
      matchesOrderType &&
      matchesPartnerType &&
      matchesShipmentStatus
    );
  });

  const toggleSelectShipment = (shipment) => {
    setSelectedShipments(
      (prev) =>
        prev.includes(shipment._id)
          ? prev.filter((id) => id !== shipment._id) // Remove shipment by _id
          : [...prev, shipment._id] // Add shipment by _id
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedShipments([]); // Deselect all
    } else {
      setSelectedShipments(filteredShippings.map((shipment) => shipment._id)); // Select all
    }
    setSelectAll(!selectAll);
  };

  const viewDetails = (shipment, tracking = false) => {
    setSelectedShipments([shipment]);
    tracking ? setViewTracking(true) : setViewDetails(true);
  };

  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Shipments");
    const headings = [
      "shipmentId",
      "awbNumber",
      "date",
      "consignee",
      "pincode",
      "courierName",
      "orderId",
      "status",
    ];
    worksheet.addRow(headings);
    filteredShippings.forEach((shipment) => {
      worksheet.addRow([
        shipment.SHIPMENT_ID,
        shipment.awbNumber,
        new Date(shipment.createdAt).toLocaleDateString(),
        shipment.consignee,
        shipment.pincode,
        shipment.PARTNER_Name,
        shipment.orderId,
        shipment.status,
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "shipments.xlsx");
  };
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "Shipment ID",
      "AWB Number",
      "Date",
      "Consignee",
      "Pincode",
      "Courier Name",
      "Order ID",
      "Status",
    ];
    const tableRows = [];

    filteredShippings.forEach((shipment) => {
      const shipmentData = [
        shipment.SHIPMENT_ID,
        shipment.awbNumber,
        new Date(shipment.createdAt).toLocaleDateString(),
        shipment.consignee,
        shipment.pincode,
        shipment.PARTNER_Name,
        shipment.orderId,
        shipment.status,
      ];
      tableRows.push(shipmentData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("shipments.pdf");
  };

  const handleGenerateInvoice = () => {};

  return (
    <>
      <Dialog open={isExporting} onOpenChange={setIsExporting}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Export </DialogTitle>
            <DialogDescription>Download excel.</DialogDescription>
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
            {/* <Button
                    variant="outline"
                    onClick={handleDownloadPDF}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Pickup list
                  </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className="w-full">
      <CardHeader className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-2xl font-bold">Shipments</CardTitle>
            <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by order ID or phone number"
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="export"
              size="lg"
              onClick={() => setIsExporting((prev) => !prev)}
            >
              <span className="text-md">+ Export </span>
            </Button>
          </div>
 {/* Filters Section */}
 <div className="space-y-4">
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <DatePickerWithRange 
                date={dateRange} 
                setDate={setDateRange}
                className="w-full"
              />

             
                <Select
                  value={orderType}
                  onValueChange={(value) => setOrderType(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Order type" />
                  </SelectTrigger>
                  <SelectContent>
                    {["All", "PREPAID", "COD"].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              
             
                <Select
                  value={partnerType}
                  onValueChange={(value) => setPartnerType(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose courier partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "All",
                      "Surface Xpressbees 0.5 K.G",
                      "Air Xpressbees 0.5 K.G",
                      "Xpressbees 2 K.G",
                      "Ecom",
                      "Delhivery",
                    ].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setShipmentStatus("")}>
                <span className=""> All </span>
              </Button>
              <Button onClick={() => setShipmentStatus("pending")}>
                <span className=""> Pending </span>
              </Button>
              <Button onClick={() => setShipmentStatus("delivered")}>
                <span className="">Delivered </span>
              </Button>
              <Button onClick={() => setShipmentStatus("in-transit")}>
                <span className="">In-Transit </span>
              </Button>
              {/* <div className="w-[120px]">
                <Select>
                  <SelectTrigger className="">
                    <SelectValue placeholder="More ..." />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="flex flex-col gap-2">
                      {["RTO", "Lost"].map((type) => (
                        <Button
                          size="sm"
                          variant="outline"
                          key={type}
                          value={type}
                        >
                          <span className="text-sm">{type}</span>
                        </Button>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div> */}
            </div>
          </div>
         
          {selectedShipments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <Button variant="outline" className="gap-2">
                <Package className="h-4 w-4" />
                Generate bulk label
              </Button>
              <Button variant="outline" onClick={handleDownloadPDF} className="gap-2">
                <Download className="h-4 w-4" />
                Download Pickup list
              </Button>
              <Button variant="outline" onClick={handleGenerateInvoice} className="gap-2">
                <ReceiptText className="h-4 w-4" />
                Generate Invoice
              </Button>
            </div>
          )}
        
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left flex flex-row justify-center items-center gap-x-2">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                    />
                    <span>Select</span>
                  </TableHead>
                  <TableHead className="hidden md:table-cell text-left ">
                    Shipment ID
                  </TableHead>
                  <TableHead className="text-left">AWB Number</TableHead>
                  <TableHead className="text-left">Date</TableHead>
                  <TableHead className="text-left">Name</TableHead>
                  <TableHead className="text-left">Consignee</TableHead>
                  <TableHead className="text-left">Pincode</TableHead>
                  <TableHead className="text-left">Courier Name</TableHead>
                  <TableHead className="text-left">Order ID</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShippings.map((shipment, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-left">
                      <input
                        type="checkbox"
                        checked={selectedShipments.includes(shipment._id)} 
                        onChange={() => toggleSelectShipment(shipment)}
                      />
                    </TableCell>
                    <TableCell className="text-left font-bold">
                      {shipment.SHIPMENT_ID}
                    </TableCell>
                    <TableCell
                      className="text-left text-blue-400 cursor-pointer"
                      onClick={() => viewDetails(shipment, true)}
                    >
                      {shipment.awbNumber}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-left">
                      {new Date(shipment.createdAt).toISOString().split("T")[0]}
                    </TableCell>
                    <TableCell>{shipment.userName}</TableCell>
                    <TableCell className="text-left font-medium">
                      {shipment.consignee ? shipment.consignee : "Ram"}
                    </TableCell>
                    <TableCell className="text-left">
                      {shipment.pincode || "201301"}
                    </TableCell>
                    <TableCell className="text-left">
                      {shipment.PARTNER_Name}
                    </TableCell>
                    <TableCell
                      className="text-left font-medium text-blue-400 cursor-pointer"
                      onClick={() => viewDetails(shipment)}
                    >
                      {shipment.orderId}
                    </TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button
                        type="primary"
                        size="large"
                        icon={<Clock4 />}
                        className="relative text-white overflow-hidden rounded-lg px-4 py-2 font-semibold bg-gradient-to-tr from-blue-800 to-orange-800 hover:opacity-75 transition-all duration-300"
                      >
                        {shipment.status || "Pickup Pending"}
                        <span className="absolute inset-0 bg-gradient-to-tr from-indigo-600 via-blue-400 to-cyan-400 opacity-50 transition-all duration-300 transform scale-110"></span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ShipmentTable;
