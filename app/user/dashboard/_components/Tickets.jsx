  import React, { useState, useEffect } from "react";
  import { useForm } from "react-hook-form";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import axiosInstance from "@/utils/axios";
  import { Badge } from "@/components/ui/badge";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from "@/components/ui/dialog";
  import { getIssueTypeLabel } from "@/utils/helpers";

  const Tickets = () => {
    const {
      register,
      handleSubmit,
      formState: { errors, isValid },
      reset,
      getValues,
    } = useForm({ mode: "onChange" });
    const [loading, setLoading] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [ticketLoading, setTicketLoading] = useState(true);
    const [ticketError, setTicketError] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [issueType, setIssueType] = useState("");
    const [newReply, setNewReply] = useState("");
    const [awbResponse, setAwbResponse] = useState(null);

    const fetchTickets = async () => {
      setTicketLoading(true);
      try {
        const response = await axiosInstance.get("/ticket/view");
        console.log(response.data);
        setTickets(response.data.tickets);
      } catch (error) {
        setTicketError("Error fetching tickets. Please try again later.");
      } finally {
        setTicketLoading(false);
      }
    };

    const onSubmit = async (data) => {
      if (!issueType) {
        alert("Please select an issue type.");
        return;
      }

      setLoading(true);
      try {
        const response = await axiosInstance.post("/ticket/raise", {
          subject: data.subject,
          description: data.description,
          issueType: issueType,
          awbNumber: data.awb? data.awb: null
          
        });
        console.log("Ticket raise :", response.data);

        alert("Ticket submitted successfully");
        fetchTickets();
        reset();
        setIssueType("");
      } catch (error) {
        alert("Failed to submit the ticket. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchTickets();
    }, []);
    console.log("Selected Ticket :", selectedTicket);

    const handleSendReply = async () => {
      if (!newReply) {
        alert("Please enter a reply message.");
        return;
      }

      try {
        await axiosInstance.post(`/ticket/${selectedTicket._id}/chat`, {
          message: newReply,
        });
        alert("Reply sent successfully");
        fetchTickets();
        setNewReply("");
        setSelectedTicket(null);
      } catch (error) {
        alert("Failed to send reply. Please try again.");
      }
    };

    const varifyAWB = async () => {
      const awbNumber = getValues("awb"); // Get AWB number from the form
      if (!awbNumber) {
        alert("Please enter an AWB number.");
        return;
      }

      try {
        const response = await axiosInstance.post("/shipping/verify-awb", {
          awbNumber: awbNumber,
        });
        console.log("AWB Verification Response:", response.data);
        setAwbResponse(response.data.success);
      } catch (error) {
        console.error("AWB Verification Error:", error);
      }
    }
    const MessageBubble = ({ message, isSupport }) => (
      <div className={`flex ${isSupport ? 'justify-start' : 'justify-end'} mb-4`}>
        <div className={`max-w-[70%] rounded-lg p-3 ${
          isSupport 
            ? 'bg-blue-100 text-blue-900' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <Badge className={`${
              isSupport ? 'bg-blue-500' : 'bg-gray-500'
            }`}>
              {isSupport ? 'Support' : 'You'}
            </Badge>
            <span className="text-xs text-gray-500">
              {new Date(message.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="text-sm">{message.message}</p>
        </div>
      </div>
    );
    
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Raise a Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="w-[300px]">
                  <Label htmlFor="issueType">Issue Type</Label>
                  <Select
                    onValueChange={(value) => setIssueType(value)}
                    value={issueType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shipment">
                        Shipment related issue (AWB mandatory)
                      </SelectItem>
                      <SelectItem value="tech">Tech related issue</SelectItem>
                      <SelectItem value="account">
                        Account or billing related issue
                      </SelectItem>
                      <SelectItem value="other">Other issues</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-[300px]">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Enter ticket subject"
                    {...register("subject", { required: "Subject is required" })}
                  />
                  {errors.subject && (
                    <p className="text-red-500">{errors.subject.message}</p>
                  )}
                </div>

                {issueType === "shipment" && (
                  <div className="flex flex-wrap items-center gap-2 my-auto">
                    <div className="w-[300px]">
                      <Label htmlFor="awb">Verify AWB
                        
                      {
                        awbResponse !== null && (
                          <Badge className={awbResponse === true ? "bg-green-500 ml-4" : "bg-red-500 ml-4"}>
                            {awbResponse ? "AWB Verified" : "AWB Not Found"}
                          </Badge>
                        )
                      }
                      </Label>
                      <Input
                        id="awb"
                        placeholder="Enter AWB number"
                        {...register("awb", {
                          required: "AWB number is required",
                        })}
                      />
                      
                      {errors.awb && (
                        <p className="text-red-500">{errors.awb.message}</p>
                      )}
                    </div>
                    <Button type="button" className="mt-5" onClick={varifyAWB}>Verify</Button>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="Describe your issue"
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Description must be at least 10 characters long",
                    },
                  })}
                ></textarea>
                {errors.description && (
                  <p className="text-red-500">{errors.description.message}</p>
                )}
              </div>

              <Button type="submit" disabled={!isValid || loading}>
                {loading ? "Submitting..." : "Submit Ticket"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket History</CardTitle>
          </CardHeader>
          <CardContent>
            {ticketLoading ? (
              <p>Loading tickets...</p>
            ) : ticketError ? (
              <p className="text-red-500">{ticketError}</p>
            ) : tickets.length > 0 ? (
              tickets.map((ticket) => (
                <TicketCard
                  key={ticket._id}
                  ticket={ticket}
                  onClick={() => setSelectedTicket(ticket)}
                />
              ))
            ) : (
              <p>No tickets found.</p>
            )}
          </CardContent>
        </Card>
        <Dialog
    open={!!selectedTicket}
    onOpenChange={() => setSelectedTicket(null)}
  >
    <DialogContent>
      {selectedTicket && (
        <>
          <DialogHeader>
            <DialogTitle>
              {getIssueTypeLabel(selectedTicket.issueType)}
            </DialogTitle>
            <DialogDescription>{selectedTicket.subject}</DialogDescription>
            <DialogDescription>
              {selectedTicket.description}
            </DialogDescription>
          </DialogHeader>
                <p className="text-xs text-gray-400">
                  Created on:{" "}
                  {new Date(selectedTicket.createdAt).toLocaleString()}
                </p>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Replies</h3>
                  {selectedTicket?.messages.length > 0 ? (
                    <ul className="space-y-2 mt-2">
                    {selectedTicket?.messages.map((reply, index) => (
                      <li
                        key={index}
                        className={`p-3 rounded-md ${
                          reply.sender === "Admin" ? "bg-blue-100" : "bg-gray-100"
                        }`}
                      >
                        <p className="font-semibold">
                          {reply.sender === "Admin" ? "👑 Admin" : "You"}
                        </p>
                        <p className="text-sm">{reply.message}</p>
                        <p className="text-xs text-gray-400">
                          Sent on: {new Date(reply.createdAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                  ) : (
                    <p className="text-xs text-gray-400">No replies yet.</p>
                  )}
                </div>

                <div className="mt-6">
                  <textarea
                    placeholder="Type your reply..."
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                  />
                  <Button onClick={handleSendReply}>Send</Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  const TicketCard = ({ ticket, onClick }) => {
    const statusColor = {
      open: "bg-yellow-500",
      "in-progress": "bg-blue-500",
      closed: "bg-green-500",
    };

    return (
      <Card className="mb-4 cursor-pointer" onClick={onClick}>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col ">
              <h2 className="text-lg font-semibold">
                {getIssueTypeLabel(ticket.issueType)}
              </h2>
              <h4 className="text-base font-semibold">{ticket.subject}</h4>
            </div>
            <Badge className={`${statusColor[ticket.status]} text-white`}>
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </Badge>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
              <p className="text-xs text-gray-400">
                Created on: {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>
            <Badge className='bg-blue-500 rounded-full hover:text-black'>Replies: {ticket.messages.length}</Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  export default Tickets;
