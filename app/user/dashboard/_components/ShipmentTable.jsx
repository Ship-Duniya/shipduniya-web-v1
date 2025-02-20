import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock4,
  Download,
  Eye,
  Loader2,
  Package,
  ReceiptText,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import Pagination from "@/components/custom/Pagination";
import axiosInstance from "@/utils/axios";

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
          ((shipment.orderType === "prepaid" ||
            shipment.orderType === "PREPAID") &&
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

  // Function to toggle selection of a single shipment
  const toggleSelectShipment = (shipment) => {
    setSelectedShipments((prev) =>
      prev.includes(shipment._id) // Assuming _id is the unique identifier
        ? prev.filter((o) => o !== shipment._id)
        : [...prev, shipment._id]
    );
  };

  // Function to toggle selection of all shipments
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedShipments([]); // Deselect all
    } else {
      setSelectedShipments(shipments.map((shipment) => shipment._id)); // Select all
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
  // Function to download selected shipments as PDF
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

    // Loop through the selected shipments only
    selectedShipments.forEach((selectedId) => {
      const shipment = shipments.find(
        (shipment) => shipment._id === selectedId // Match by unique ID
      );
      if (shipment) {
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
      }
    });

    // Generate PDF only if there are selected rows
    if (tableRows.length > 0) {
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
      });
      doc.save("selected_shipments.pdf");
    } else {
      // Optional: Show message if no rows are selected
      alert("Please select at least one shipment to download.");
    }
  };

  const handleGenerateInvoice = () => {
    const doc = new jsPDF();

    selectedShipments.forEach((selectedId, index) => {
      const shipment = shipments.find((s) => s._id === selectedId);
      if (shipment) {
        if (index !== 0) doc.addPage();

        const pageWidth = doc.internal.pageSize.width;

        // Centered Heading
        doc.setFontSize(16);
        const heading = "Shipment Invoice - Ship Duniya";
        const headingWidth = doc.getTextWidth(heading);
        doc.text(heading, (pageWidth - headingWidth) / 2, 20);

        // Left Section: Shipment Information
        doc.setFontSize(12);
        doc.text("Shipment Information", 20, 40);
        doc.text(`Shipment ID: ${shipment.SHIPMENT_ID}`, 20, 50);
        doc.text(`AWB Number: ${shipment.awbNumber}`, 20, 60);

        // Right Section: Invoice Details
        doc.text(`Invoice Number: ${shipment.invoiceNumber}`, 130, 40);
        doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 130, 50);

        // Horizontal Line
        doc.line(20, 70, 190, 70);

        // Left Section: Sold By
        doc.text("Sold By:", 20, 80);
        doc.text("Ship Duniya Logistics", 20, 90);
        doc.text("Address: C 45 sec 10 Noida 201301", 20, 100);
        doc.text("GST: 09AFEFS3189K1ZD", 20, 110);

        // Right Section: Billed To
        doc.text("Billed To:", 130, 80);
        doc.text(`${shipment.consignee}`, 130, 90);
        doc.text(`${shipment.pincode}`, 130, 100);

        // **Set Table Below the Details**
        let startY = 120; // Adjusted to start below the "Billed To" section

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

        const tableRows = [
          [
            shipment.SHIPMENT_ID,
            shipment.awbNumber,
            new Date(shipment.createdAt).toLocaleDateString(),
            shipment.consignee,
            shipment.pincode,
            shipment.PARTNER_Name,
            shipment.orderId,
            shipment.status,
          ],
        ];

        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY, // Ensure table starts after details
        });
      }
    });

    doc.save("invoice.pdf");
  };

  const handleLabeling = async () => {
    const selectedAwbNumbers = selectedShipments
      .map((id) => shipments.find((s) => s._id === id)?.awbNumber)
      .filter((awb) => awb !== undefined);
  
    try {
      const response = await axiosInstance.post("/label", { awbNumbers: selectedAwbNumbers });
  
      if (response.data.labels) {
        response.data.labels.forEach(({ labelUrl, awb }) => {
          window.open(labelUrl, '_blank'); // Open each label in a new tab
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  

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
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Shipments</CardTitle>
            <input
              type="text"
              placeholder="Search by consignee name, awb number or orderId"
              className="border rounded-lg px-4 py-2 text-sm w-[50%] focus:outline-none focus:ring focus:ring-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="export"
              size="lg"
              onClick={() => setIsExporting((prev) => !prev)}
            >
              <span className="text-lg">+ Export </span>
            </Button>
          </div>
          <div className="flex justify-between items-center mb-4 pt-2">
            <div className="flex items-center flex-wrap gap-4">
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />

              <div className="w-[130px]">
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
              <div className="w-[180px]">
                <Select
                  value={partnerType}
                  onValueChange={(value) => setPartnerType(value)}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Choose courier partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {["All", "Xpressbees", "Ecom", "Delhivery"].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-between flex-row-reverse pt-2 h-10">
            <div className="flex gap-2">
              <Button onClick={() => setShipmentStatus("")}>
                <span className=""> All </span>
              </Button>
              <Button onClick={() => setShipmentStatus("pending")}>
                <span className=""> Pending Pickup</span>
              </Button>
              <Button onClick={() => setShipmentStatus("delivered")}>
                <span className="">Delivered </span>
              </Button>
              <Button onClick={() => setShipmentStatus("in-transit")}>
                <span className="">In-Transit </span>
              </Button>
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
            </div>
            {selectedShipments.length > 0 && (
              <div className="flex gap-2">
                <Button variant="export" onClick={handleLabeling}>
                  <span>Generate bulk label</span>
                </Button>
                <Button
                  variant="export"
                  onClick={handleDownloadPDF}
                  className="w-40"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Pickup list
                </Button>
                <Button
                  variant="export"
                  onClick={handleGenerateInvoice}
                  className="w-40"
                >
                  <ReceiptText className="mr-2 h-4 w-4" />
                  Generate Invoice
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-1">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <Table className="mt-4 p-0">
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
                        {shipment.status?.trim().toLowerCase() === "pending"
                          ? "Pickup Pending"
                          : shipment.status || "Pending"}
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
