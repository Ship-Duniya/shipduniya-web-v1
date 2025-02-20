import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import axiosInstance from '@/utils/axios';
import WarehouseFormView from './WarehouseFormView';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Settings = () => {
  const [miniWareHouses, setMiniWareHouses] = useState([]);
  const [masterWareHouses, setMasterWareHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWareHouses = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/warehouse');
      setMiniWareHouses(response.data.warehouses);  
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWareHouses();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Manage Warehouses</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading...</p>
          </div>
        ) : (
          <Tabs defaultValue="mini">
            <TabsList className="p-4 gap-6 bg-green-300">
              <TabsTrigger value="mini">Mini Warehouses</TabsTrigger>
              <TabsTrigger value="master">Master Warehouses</TabsTrigger>
            </TabsList>
            <TabsContent value="mini">
              <ScrollArea>
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-2/5 p-4">
                    <WarehouseFormView />
                  </div>
                  <div className="md:w-3/5 p-4">
                    <h2 className="text-xl font-semibold mb-4">Mini Warehouses</h2>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Capacity</TableHead>
                          <TableHead>Pincode</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {miniWareHouses?.map((warehouse) => (
                          <TableRow key={warehouse._id}>
                            <TableCell>{warehouse.name}</TableCell>
                            <TableCell>{warehouse.address}</TableCell>
                            <TableCell>{warehouse.capacity}</TableCell>
                            <TableCell>{warehouse.pincode}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="master">
              <ScrollArea>
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-2/5 p-4">
                    <WarehouseFormView />
                  </div>
                  <div className="md:w-3/5 p-4">
                    <h2 className="text-xl font-semibold mb-4">Master Warehouses</h2>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Capacity</TableHead>
                          <TableHead>Pincode</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {masterWareHouses?.map((warehouse) => (
                          <TableRow key={warehouse._id}>
                            <TableCell>{warehouse.name}</TableCell>
                            <TableCell>{warehouse.address}</TableCell>
                            <TableCell>{warehouse.capacity}</TableCell>
                            <TableCell>{warehouse.pincode}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default Settings;
