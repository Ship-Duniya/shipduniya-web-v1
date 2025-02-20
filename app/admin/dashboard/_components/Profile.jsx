'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { capitalizeFirstLetter } from '@/utils/helpers';
import axios from 'axios';
import axiosInstance from '@/utils/axios';
import { User } from 'lucide-react';
// import { toast } from "@/components/ui/use-toast"

export default function Profile({ type, onClose }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    // Fetch user data
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get('/users/profile');
        setProfile(response.data);
        setValue('_id', response.data._id);
        setValue('id', response.data.userId);
        setValue('name', response.data.name);
        setValue('email', response.data.email);
        setValue('phone', response.data.phone);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const updatedData = {
        name: data.name,
        phone: data.phone,
      };
      const response = await axiosInstance.put(
        `/users/profile/${data._id}`,
        updatedData
      );
      console.log('Updated Profile Data:', response.data);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>; 

  return (
    // <Dialog>
    //   <DialogContent className="bg-white rounded-3xl shadow px-4">
    //     <DialogHeader>
    //       <DialogTitle>Edit {capitalizeFirstLetter(type)} Details</DialogTitle>
    //     </DialogHeader>
    //     {isLoading ? (
    //       <div>Loading...</div>
    //     ) : (
    //       <Card className="w-full p-0 max-w-2xl mx-auto border-none shadow-none">
    //         <CardHeader>
    //           <CardTitle>{capitalizeFirstLetter(type)} Profile</CardTitle>
    //         </CardHeader>
    //         <CardContent>
    //           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //               <div className="space-y-2">
    //                 <Label htmlFor="id">{capitalizeFirstLetter(type)} ID</Label>
    //                 <Input id="id" {...register("id")} disabled />
    //               </div>
    //               <div className="space-y-2">
    //                 <Label htmlFor="name">Name</Label>
    //                 <Input
    //                   id="name"
    //                   {...register("name", { required: "Name is required" })}
    //                 />
    //                 {errors.name && (
    //                   <p className="text-red-500">{errors.name.message}</p>
    //                 )}
    //               </div>
    //               <div className="space-y-2">
    //                 <Label htmlFor="email">Email</Label>
    //                 <Input
    //                   id="email"
    //                   type="email"
    //                   {...register("email", {
    //                     required: "Email is required",
    //                     pattern: {
    //                       value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
    //                       message: "Email is not valid",
    //                     },
    //                   })}
    //                   disabled
    //                 />
    //                 {errors.email && (
    //                   <p className="text-red-500">{errors.email.message}</p>
    //                 )}
    //               </div>
    //               <div className="space-y-2">
    //                 <Label htmlFor="phone">Phone</Label>
    //                 <Input
    //                   id="phone"
    //                   type="tel"
    //                   {...register("phone", {
    //                     minLength: {
    //                       value: 10,
    //                       message: "Phone number must be 10 digits",
    //                     },
    //                     maxLength: {
    //                       value: 10,
    //                       message: "Phone number must be 10 digits",
    //                     },
    //                   })}
    //                 />
    //                 {errors.phone && (
    //                   <p className="text-red-500">{errors.phone.message}</p>
    //                 )}
    //               </div>
    //             </div>
    //             <div className="flex justify-end gap-2 mt-8 -mb-6">
    //               <Button className="border-none" variant="outline">
    //                 Cancel
    //               </Button>
    //               <Button
    //                 type="submit"
    //                 className="bg-green-500 hover:bg-green-600 text-white rounded-[10px]"
    //               >
    //                 Save Details
    //               </Button>
    //             </div>
    //           </form>
    //         </CardContent>
    //       </Card>
    //     )}
    //   </DialogContent>
    // </Dialog>
    <>
    {/* Profile Button */}
      {/* <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsProfileOpen(true)}
      >
        <User className="h-6 w-6" />
      </Button> */}

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="bg-white rounded-3xl shadow px-4">
          <DialogHeader>
            <DialogTitle>Edit Profile Details</DialogTitle>
          </DialogHeader>
          <div>Profile content goes here...</div>
          <div className="flex justify-end gap-2 mt-8 -mb-6">
            <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white rounded-[10px]">
              Save Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
