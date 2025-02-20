import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Eye, Loader2, Package } from "lucide-react";
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
import AccordianButton from "@/components/ui/accordianButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
const RtoTable = ({
  shipments,
  deliveredOrders,
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
  const [isExporting, setIsExporting] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  // const [loading, setLoading] = useState(true);
  console.log("shipments", shipments);

  const [rtoShipments, setRtoShipments] = useState(deliveredOrders); // RTO Shipments
  const [rtcShipments, setRtcShipments] = useState([]); // RTC Shipments

  const handleMoveToRtc = (shipmentId) => {
    // Find the shipment in the RTO table by its ID
    const shipmentToMove = rtoShipments.find(
      (shipment) => shipment._id === shipmentId
    );

    // Remove the shipment from RTO
    const updatedRtoShipments = rtoShipments.filter(
      (shipment) => shipment._id !== shipmentId
    );

    // Add the shipment to RTC
    setRtoShipments(updatedRtoShipments);
    setRtcShipments((prevRtcShipments) => [
      ...prevRtcShipments,
      shipmentToMove,
    ]);
  };

  console.log("deliveredOrders", deliveredOrders);

 const filteredDeliveries = deliveredOrders.filter((shipment) => {
   const matchesSearchQuery =
     searchQuery.trim() === "" ||
     shipment.consignee?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     shipment.awbNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     shipment.orderId?.toLowerCase().includes(searchQuery.toLowerCase());

   const shipmentDate = new Date(shipment.createdAt);
   const matchesDateRange =
     shipmentDate >= new Date(dateRange.from) &&
     shipmentDate <= new Date(dateRange.to);

   const matchesOrderType =
     orderType === "All" ||
     orderType === "" ||
     shipment.orderType === orderType;

   const matchesPartnerType =
     partnerType === "All" ||
     partnerType === "" ||
     shipment.partnerName === partnerType;

   return (
     matchesSearchQuery &&
     matchesDateRange &&
     matchesOrderType &&
     matchesPartnerType
   );
 });

  const toggleSelectShipment = (shipment) => {
    setSelectedShipments((prev) =>
      prev.includes(shipment)
        ? prev.filter((s) => s !== shipment)
        : [...prev, shipment]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedShipments([]);
    } else {
      setSelectedShipments(deliveredOrders.map((order) => order));
    }
    setSelectAll(!selectAll);
  };

  const viewDetails = (shipment) => {
    setSelectedShipments([shipment]);
    setViewDetails(true);
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
    filteredDeliveries.forEach((shipment) => {
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

    filteredDeliveries.forEach((shipment) => {
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

  return (
    <>
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
              Download Pickup list
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
       
      <CardHeader className="space-y-6">
      <div className="flex items-center justify-between">
        <CardTitle className="text-2xl font-bold">
              Delivered Orders
            </CardTitle> 
            <Button
              variant="export"
              size="lg"
              onClick={() => setIsExporting((prev) => !prev)}
            >
              <span className="text-md">+ Export </span>
            </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> 
            <Input
              type="text"
              placeholder="Search by order Id or Consignee Name"
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              {/* <Select
                  value={orderType}
                  onValueChange={(value) => setOrderType(value)}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Order type" />
                  </SelectTrigger>
                  <SelectContent>
                    {["All", "PREPAID", "COD"].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
                <Select
                  value={partnerType}
                  onValueChange={(value) => setPartnerType(value)}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Choose courier partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {["All", "xpressbees", "ecom", "delhivery"].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
          </div>

          {selectedShipments.length > 0 && (
            <div className="flex gap-2">
              <Button variant="export">
                <span>Generate bulk label</span>
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="">
        <Tabs defaultValue="rto" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="rto">RTO ({rtoShipments.length})</TabsTrigger>
              <TabsTrigger value="rtc">RTC ({rtcShipments.length})</TabsTrigger>
            </TabsList>

            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
              </div>
            ) : (
              <>
                <TabsContent value="rto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {/* <TableHead className="">Shipment ID</TableHead> */}
                        <TableHead className="">Order ID</TableHead>
                        <TableHead className="">Consignee</TableHead>
                        <TableHead className="">Partner</TableHead>
                        <TableHead className="">Exception Info</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeliveries.map((shipment) => (
                        <TableRow key={shipment._id}>
                          <TableCell className="font-medium">
                            {shipment.orderId || "Order ID"}
                          </TableCell>
                          <TableCell className="font-medium">
                            {shipment.consignee}
                          </TableCell>
                          <TableCell className="font-medium">
                            {shipment.partner}
                          </TableCell>
                          <TableCell className="font-medium text-blue-400">
                            {shipment.exceptionInfo || "Exception Info"}
                          </TableCell>
                          <TableCell className="font-medium text-center">
                            <Button  onClick={() => handleMoveToRtc(shipment)}>Move to RTC</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="rtc">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="">Order ID</TableHead>
                        <TableHead className="">Consignee</TableHead>
                        <TableHead className="">Partner</TableHead>
                        <TableHead className="">Exception Info</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rtcShipments.map((shipment) => (
                        <TableRow key={shipment._id}>
                          <TableCell className="font-medium">
                            {shipment.orderId}
                          </TableCell>
                          <TableCell className="font-medium">
                            {shipment.consignee}
                          </TableCell>
                          <TableCell className="font-medium">
                            {shipment.partner}
                          </TableCell>
                          <TableCell className="font-medium text-blue-400">
                            {shipment.exceptionInfo || "Exception Info"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
export default RtoTable;