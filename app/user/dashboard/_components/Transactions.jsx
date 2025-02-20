"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Eye,
  Loader2,
  Download,
  X,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/utils/axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import jsPDF from "jspdf";

// Utility function to get badge color based on status
const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const invoices = [
  { id: "INV001", month: "January", year: 2023, amount: 1500, status: "Paid" },
  { id: "INV002", month: "February", year: 2023, amount: 1200, status: "Paid" },
  { id: "INV003", month: "March", year: 2023, amount: 1800, status: "Pending" },
  { id: "INV004", month: "April", year: 2023, amount: 2000, status: "Overdue" },
  { id: "INV005", month: "May", year: 2023, amount: 1700, status: "Paid" },
  { id: "INV006", month: "December", year: 2022, amount: 1900, status: "Paid" },
  { id: "INV007", month: "November", year: 2022, amount: 1600, status: "Paid" },
];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedYear, setSelectedYear] = useState("all");
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  const filteredInvoices = invoices.filter(
    (invoice) =>
      (invoice.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedYear === "all" || invoice.year.toString() === selectedYear)
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid":
        return <CheckCircle2 className="h-4 w-4 mr-2 text-green-800" />;
      case "Pending":
        return <Clock className="h-4 w-4 mr-2 text-yellow-800" />;
      case "Overdue":
        return <XCircle className="h-4 w-4 mr-2 text-red-800" />;
      default:
        return <CheckCircle2 className="h-4 w-4 mr-2 text-gray-800" />;
    }
  };

 const handleDownloadInvoice = () => {
   const doc = new jsPDF();

   const tableColumn = ["Invoice Items"];
   const tableRows = [["Date" ,"Basic Salary", "Project Bonus", "Total Amount"]];

   // Ensure selectedInvoice is always an array
   const invoiceIds = Array.isArray(selectedInvoice)
     ? selectedInvoice
     : [selectedInvoice];

   console.log("Selected Invoice IDs:", invoiceIds);

   // Loop through the selected invoices
   invoiceIds.forEach((selectedId) => {
     console.log("Searching for invoice ID:", selectedId);

     const invoice = invoices.find(
       (invoice) => invoice._id === selectedId // Match by unique ID
     );

     console.log("Found invoice:", invoice);

     if (invoice) {
       const invoiceData = [
         invoice.date,
         invoice.basicSalary,
         invoice.projectBonus,
         invoice.totalAmount,
       ];
       tableRows.push(invoiceData);
     } else {
       console.warn(`Invoice with ID ${selectedId} not found.`);
     }
   });

   // Log the rows before PDF generation
   console.log("Table Rows:", tableRows);

   // Generate PDF only if there are rows (excluding the header row)
   if (tableRows.length > 1) {
     doc.autoTable({
       head: [tableColumn],
       body: tableRows,
     });
     doc.save("selected_invoice.pdf");
   } else {
     alert("Please select at least one invoice to download.");
   }
 };

  useEffect(() => {
    if (selectedInvoice) {
      const invoiceDetail = invoices.find((inv) => inv.id === selectedInvoice);
      if (invoiceDetail) {
        setInvoiceDetails({
          ...invoiceDetail,
          dueDate: "2023-05-31",
          items: [
            { description: "Basic Salary", amount: 1200 },
            { description: "Overtime", amount: 200 },
            { description: "Bonus", amount: 100 },
          ],
        });
      }
    } else {
      setInvoiceDetails(null);
    }
  }, [selectedInvoice]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/transactions");
        if (response.status === 200) {
          console.log(response.data);
          setTransactions(response.data.transactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  return (
    <Card className="w-full">
      <CardContent className="">
        <Tabs defaultValue="wallet" className="mx-auto my-3">
          <TabsList className="p-4 gap-6 flex justify-center mx-auto max-w-max">
            <TabsTrigger value="wallet">Wallet Transactions</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Transactions</TabsTrigger>
            <TabsTrigger value="weight">Weight Reconciliation</TabsTrigger>
            <TabsTrigger value="invoice">Monthly Invoice</TabsTrigger>
          </TabsList>
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
            </div>
          ) : (
            <>
              <TabsContent value="wallet">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="">Transection ID</TableHead>
                      <TableHead className="">Amount</TableHead>
                      <TableHead className="">Date</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">
                        Current balance
                      </TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell className="font-medium">
                          {transaction.transactionId}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {transaction.currency} {transaction.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {format(
                            new Date(transaction.updatedAt),
                            "dd MMM yyyy"
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={`${getStatusColor(
                              transaction.status
                            )} font-medium`}
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {transaction.balance}
                        </TableCell>
                        <TableCell className="text-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(transaction)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">View</span>
                                <span className="sm:hidden">Details</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Transaction Details</DialogTitle>
                                <DialogDescription>
                                  Full details of the transaction
                                </DialogDescription>
                              </DialogHeader>
                              {selectedTransaction && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">Order ID:</span>
                                    <span className="col-span-3">
                                      {selectedTransaction.orderId}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">Amount:</span>
                                    <span className="col-span-3">
                                      {selectedTransaction.currency}{" "}
                                      {selectedTransaction.amount.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">Status:</span>
                                    <span className="col-span-3">
                                      <Badge
                                        className={`${getStatusColor(
                                          selectedTransaction.status
                                        )} font-medium`}
                                      >
                                        {selectedTransaction.status}
                                      </Badge>
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">
                                      Requested:
                                    </span>
                                    <span className="col-span-3">
                                      {format(
                                        new Date(
                                          selectedTransaction.requested_at
                                        ),
                                        "PPp"
                                      )}
                                    </span>
                                  </div>
                                  {selectedTransaction.confirmed_at && (
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <span className="font-bold">
                                        Confirmed:
                                      </span>
                                      <span className="col-span-3">
                                        {format(
                                          new Date(
                                            selectedTransaction.confirmed_at
                                          ),
                                          "PPp"
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">
                                      Payment ID:
                                    </span>
                                    <span className="col-span-3">
                                      {selectedTransaction.paymentId}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <span className="font-bold">User ID:</span>
                                    <span className="col-span-3">
                                      {selectedTransaction.userId}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="invoice">
                <div className="container mx-auto py-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h1 className="text-3xl font-bold tracking-tight">
                        Monthly Invoices
                      </h1>
                      <button className="flex justify-center items-center p-2 rounded-lg bg-blue-500 text-white">
                        <Download className="h-4 w-4 mr-2" /> Download All
                      </button>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <input
                        type="text"
                        placeholder="Search invoices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input max-w-sm border-2 border-gray-400 rounded-lg px-3 py-1"
                      />
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="select w-[180px] border-2 border-gray-400 rounded-lg px-2"
                      >
                        <option value="all">All Time</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredInvoices.map((invoice) => (
                        <div
                          key={invoice.id}
                          className="card cursor-pointer hover:shadow-md transition-shadow bg-gray-100 rounded-xl px-4 py-3"
                          onClick={() => setSelectedInvoice(invoice.id)}
                        >
                          <div className="card-body ">
                            <h3 className="text-lg font-semibold mb-2">
                              {invoice.month} {invoice.year}
                            </h3>
                            <p className="text-2xl font-bold mb-2">
                              ${invoice.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 mb-2">
                              Invoice ID: {invoice.id}
                            </p>
                            <span
                              className={`badge px-3 py-1 rounded-full ${
                                invoice.status === "Paid"
                                  ? "bg-green-200 text-green-800"
                                  : invoice.status === "Pending"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : invoice.status === "Overdue"
                                  ? "bg-red-200 text-red-800"
                                  : invoice.status === "Complete"
                                  ? "bg-blue-200 text-blue-800"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              {invoice.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Invoice Dialog */}
                    {invoiceDetails && (
                      <Dialog
                        open={!!invoiceDetails}
                        onOpenChange={() => setInvoiceDetails(null)}
                      >
                        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl shadow-xl">
                          {/* Header with status bar */}
                          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <DialogTitle className="text-2xl font-bold text-white">
                                  {`Invoice ${invoiceDetails.id}`}
                                </DialogTitle>
                                <DialogDescription className="text-blue-100 mt-1">
                                  {`${invoiceDetails.month} ${invoiceDetails.year}`}
                                </DialogDescription>
                              </div>
                            </div>
                            <div
                              className={`badge mt-4 inline-flex items-center px-3 py-1 rounded-full ${
                                invoiceDetails.status === "Paid"
                                  ? "bg-green-200 text-green-800"
                                  : invoiceDetails.status === "Pending"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : invoiceDetails.status === "Overdue"
                                  ? "bg-red-200 text-red-800"
                                  : invoiceDetails.status === "Complete"
                                  ? "bg-blue-200 text-blue-800"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              {getStatusIcon(invoiceDetails.status)}
                              {invoiceDetails.status}
                            </div>
                          </div>

                          {/* Invoice content */}
                          <div className="p-6">
                            <div className="space-y-6">
                              {/* Due date */}
                              <div>
                                <p className="text-sm font-medium text-gray-500">
                                  Due Date
                                </p>
                                <p className="mt-1 text-gray-900">
                                  {invoiceDetails.dueDate}
                                </p>
                              </div>

                              {/* Invoice items */}
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                  Invoice Items
                                </h3>
                                <div className="space-y-3">
                                  {invoiceDetails.items.map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between items-center py-3 border-b border-gray-100"
                                    >
                                      <p className="font-medium text-gray-900">
                                        {item.description}
                                      </p>
                                      <p className="text-gray-900">
                                        ${item.amount.toFixed(2)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Total */}
                              <div className="bg-gray-50 -mx-6 px-6 py-4">
                                <div className="flex justify-between items-center">
                                  <p className="text-lg font-semibold text-gray-900">
                                    Total Amount
                                  </p>
                                  <p className="text-xl font-bold text-blue-600">
                                    ${invoiceDetails.amount.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Footer with download button */}
                          <div className="px-6 pb-6">
                            <Button
                              onClick={handleDownloadInvoice}
                              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
                            >
                              <Download className="h-5 w-5 mr-2" />
                              Download Invoice
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
