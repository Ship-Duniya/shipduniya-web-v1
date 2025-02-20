"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axiosInstance from "@/utils/axios";
import { AlertCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";

const chargeSheet = [
  {
    customerType: "bronze",
    deliveryPartners: [
      { carrierName: "Air Xpressbees 0.5 K.G", codCharges: 66, codPercentage: '2.36%',
        fwd:{
          withinCity:78,
          withinState:81,
          Regional:81,
          metroToMetro:150,
          neJkKlAn:180,
          india:165,

        },
        rto:{
          withinCity:69,
          withinState:72,
          Regional:72,
          metroToMetro:114,
          neJkKlAn:150,
          india:135,
        },
        addWt:{
          withinCity:36,
          withinState:42,
          Regional:42,
          metroToMetro:105,
          neJkKlAn:150,
          india:126,
        }
       },
      { carrierName: "Express Reverse", codCharges: 66, codPercentage: '2.36%',
        fwd:{
          withinCity:120,
          withinState:129,
          Regional:129,
          metroToMetro:150,
          neJkKlAn:195,
          india:168,

        },
        rto:{
          withinCity:120,
          withinState:129,
          Regional:129,
          metroToMetro:150,
          neJkKlAn:195,
          india:168,

        },
        addWt:{
          withinCity:84,
          withinState:90,
          Regional:90,
          metroToMetro:108,
          neJkKlAn:114,
          india:99,
        }  },
      {
        carrierName: "Surface Xpressbees 0.5 K.G", codCharges: 66, codPercentage: '2.36%' ,
        fwd:{
          withinCity:78,
          withinState:81,
          Regional:81,
          metroToMetro:114,
          neJkKlAn:150,
          india:126,

        },
        rto:{
          withinCity:69,
          withinState:72,
          Regional:72,
          metroToMetro:99,
          neJkKlAn:135,
          india:111,
        },
        addWt:{
          withinCity:36,
          withinState:42,
          Regional:42,
          metroToMetro:54,
          neJkKlAn:78,
          india:66,
        }
      },
      { carrierName: "Xpressbees 1 K.G",codCharges: 66, codPercentage: '2.36%',
        fwd:{
          withinCity:114,
          withinState:126,
          Regional:126,
          metroToMetro:162,
          neJkKlAn:228,
          india:189,

        },
        rto:{
          withinCity:102,
          withinState:111,
          Regional:111,
          metroToMetro:141,
          neJkKlAn:195,
          india:165,
        },
        addWt:{
          withinCity:70,
          withinState:90,
          Regional:90,
          metroToMetro:99,
          neJkKlAn:120,
          india:108,
        } },
      { carrierName: "Xpressbees 10 K.G", codCharges: 66, codPercentage: '2.36%',
        fwd:{
          withinCity:450,
          withinState:510,
          Regional:510,
          metroToMetro:555,
          neJkKlAn:810,
          india:600,

        },
        rto:{
          withinCity:390,
          withinState:450,
          Regional:450,
          metroToMetro:495,
          neJkKlAn:750,
          india:525,
        },
        addWt:{
          withinCity:36,
          withinState:42,
          Regional:42,
          metroToMetro:45,
          neJkKlAn:63,
          india:48,
        }  },
      { carrierName: "Xpressbees 2 K.G", codCharges: 66, codPercentage: '2.36%',
        fwd:{
          withinCity:192,
          withinState:210,
          Regional:210,
          metroToMetro:228,
          neJkKlAn:300,
          india:252,

        },
        rto:{
          withinCity:165,
          withinState:180,
          Regional:180,
          metroToMetro:204,
          neJkKlAn:270,
          india:225,
        },
        addWt:{
          withinCity:42,
          withinState:48,
          Regional:48,
          metroToMetro:54,
          neJkKlAn:72,
          india:54,
        }  },
      { carrierName: "Xpressbees 5 K.G", codCharges: 66, codPercentage: '2.36%',
        fwd:{
          withinCity:300,
          withinState:330,
          Regional:330,
          metroToMetro:375,
          neJkKlAn:510,
          india:420,

        },
        rto:{
          withinCity:270,
          withinState:297,
          Regional:297,
          metroToMetro:330,
          neJkKlAn:450,
          india:366,
        },
        addWt:{
          withinCity:42,
          withinState:48,
          Regional:48,
          metroToMetro:54,
          neJkKlAn:72,
          india:54,
        }  },
      {
        carrierName: "Xpressbees Next Day Delivery", codCharges: 66, codPercentage: '2.36%' ,
        fwd:{
          withinCity:150,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,

        },
        rto:{
          withinCity:2.4,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        },
        addWt:{
          withinCity:2.4,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        }
      },
      {
        carrierName: "Xpressbees Same Day Delivery", codCharges: 66, codPercentage: '2.36%',
        fwd:{
          withinCity: 168,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,

        },
        rto:{
          withinCity:2.4,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        },
        addWt:{
          withinCity:2.4,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        } },
      { carrierName: "ECOM EXPRESS 0.5KG", codCharges: 66, codPercentage: '2.36%',
        fwd:{
          withinCity:78,
          withinState:81,
          Regional:81,
          metroToMetro:114,
          neJkKlAn:150,
          india:126,

        },
        rto:{
          withinCity:69,
          withinState:72,
          Regional:72,
          metroToMetro:99,
          neJkKlAn:135,
          india:111,
        },
        addWt:{
          withinCity:36,
          withinState:42,
          Regional:42,
          metroToMetro:54,
          neJkKlAn:78,
          india:66,
        } 
        },
      { carrierName: "ECOM EXPRESS 5KG", codCharges: 66, codPercentage: '2.36%',
        fwd:{
          withinCity:300,
          withinState:330,
          Regional:330,
          metroToMetro:375,
          neJkKlAn:510,
          india:420,

        },
        rto:{
          withinCity:270,
          withinState:297,
          Regional:297,
          metroToMetro:330,
          neJkKlAn:450,
          india:366,
        },
        addWt:{
          withinCity:42,
          withinState:48,
          Regional:48,
          metroToMetro:54,
          neJkKlAn:72,
          india:54,
        }  },
    ],
  },
  {
    customerType: "silver",
    deliveryPartners: [
      {
        carrierName: "Air Xpressbees 0.5 K.G", codCharges: 66, codPercentage: "2.12%",
        fwd:{
          withinCity:65,
          withinState:67.5,
          Regional:67.5,
          metroToMetro:125,
          neJkKlAn:150,
          india:137.5,

        },
        rto:{
          withinCity:57.5,
          withinState:60,
          Regional:60,
          metroToMetro:95,
          neJkKlAn:125,
          india:112.5,
        },
        addWt:{
          withinCity:30,
          withinState:35,
          Regional:35,
          metroToMetro:87.5,
          neJkKlAn:125,
          india:105,
        }
      },
      { carrierName: "Express Reverse", codCharges: 66, codPercentage: "2.12%",
        fwd:{
          withinCity:100,
          withinState:107.5,
          Regional:107.5,
          metroToMetro:125,
          neJkKlAn:162.5,
          india:140,

        },
        rto:{
          withinCity:100,
          withinState:107.5,
          Regional:107.5,
          metroToMetro:125,
          neJkKlAn:162.5,
          india:140,
        },
        addWt:{
          withinCity:70,
          withinState:75,
          Regional:75,
          metroToMetro:90,
          neJkKlAn:95,
          india:82.5,
        } },
      {
        carrierName: "Surface Xpressbees 0.5 K.G", codCharges: 66, codPercentage: "2.12%",
        fwd:{
          withinCity:65,
          withinState:67.5,
          Regional:67.5,
          metroToMetro:95,
          neJkKlAn:125,
          india:105,

        },
        rto:{
          withinCity:57.5,
          withinState:60,
          Regional:60,
          metroToMetro:82.5,
          neJkKlAn:112.5,
          india:92.5,
        },
        addWt:{
          withinCity:30,
          withinState:35,
          Regional:35,
          metroToMetro:45,
          neJkKlAn:65,
          india:55,
        } 
      },
      { carrierName: "Xpressbees 1 K.G", codCharges: 66, codPercentage: "2.12%",
        fwd:{
          withinCity:95,
          withinState:105,
          Regional:105,
          metroToMetro:135,
          neJkKlAn:190,
          india:157.5,

        },
        rto:{
          withinCity:85,
          withinState:92.5,
          Regional:92.5,
          metroToMetro:117.5,
          neJkKlAn:162.5,
          india:137.5,
        },
        addWt:{
          withinCity:62.5,
          withinState:75,
          Regional:75,
          metroToMetro:82.5,
          neJkKlAn:100,
          india:90,
        }  },
      { carrierName: "Xpressbees 10 K.G", codCharges: 66, codPercentage: "2.12%",
        fwd:{
          withinCity:375,
          withinState:425,
          Regional:425,
          metroToMetro:462.5,
          neJkKlAn:675,
          india:500,

        },
        rto:{
          withinCity:325,
          withinState:375,
          Regional:375,
          metroToMetro:412.5,
          neJkKlAn:625,
          india:437.5,
        },
        addWt:{
          withinCity:30,
          withinState:35,
          Regional:35,
          metroToMetro:37.5,
          neJkKlAn:52.5,
          india:40,
        }  },
      { carrierName: "Xpressbees 2 K.G", codCharges: 66, codPercentage: "2.12%",
        fwd:{
          withinCity:160,
          withinState:175,
          Regional:175,
          metroToMetro:190,
          neJkKlAn:250,
          india:210,

        },
        rto:{
          withinCity:137.5,
          withinState:150,
          Regional:150,
          metroToMetro:170,
          neJkKlAn:225,
          india:187.5,
        },
        addWt:{
          withinCity:40,
          withinState:45,
          Regional:45,
          metroToMetro:50,
          neJkKlAn:75,
          india:60,
        }  },
      { carrierName: "Xpressbees 5 K.G", codCharges: 66, codPercentage: "2.12%",
        fwd:{
          withinCity:250,
          withinState:275,
          Regional:275,
          metroToMetro:312.5,
          neJkKlAn:425,
          india:350,

        },
        rto:{
          withinCity:35,
          withinState:150,
          Regional:150,
          metroToMetro:170,
          neJkKlAn:225,
          india:187.5,
        },
        addWt:{
          withinCity:35,
          withinState:40,
          Regional:40,
          metroToMetro:45,
          neJkKlAn:60,
          india:45,
        }  },
      {
        carrierName: "Xpressbees Next Day Delivery", codCharges: 66, codPercentage: "2.12%",
        fwd:{
          withinCity:125,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,

        },
        rto:{
          withinCity:2,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        },
        addWt:{
          withinCity:20,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        } 
      },
      {
        carrierName: "Xpressbees Same Day Delivery", codCharges: 66, codPercentage: "2.12%",
        fwd:{
          withinCity:140,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,

        },
        rto:{
          withinCity:2,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        },
        addWt:{
          withinCity:20,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        } 
      },
      { carrierName: "ECOM EXPRESS 0.5KG", codCharges: 66, codPercentage: 2.5,
        fwd:{
          withinCity:65,
          withinState:67.5,
          Regional:67.5,
          metroToMetro:95,
          neJkKlAn:125,
          india:105,

        },
        rto:{
          withinCity:57.5,
          withinState:60,
          Regional:60,
          metroToMetro:82.5,
          neJkKlAn:112.5,
          india:92.5,
        },
        addWt:{
          withinCity:30,
          withinState:35,
          Regional:35,
          metroToMetro:45,
          neJkKlAn:65,
          india:55,
        }  },
      { carrierName: "ECOM EXPRESS 5KG", codCharges: 66, codPercentage: 2.5,
        fwd:{
        withinCity:250,
        withinState:275,
        Regional:275,
        metroToMetro:312.5,
        neJkKlAn:425,
        india:350,

      },
      rto:{
        withinCity:35,
        withinState:150,
        Regional:150,
        metroToMetro:170,
        neJkKlAn:225,
        india:187.5,
      },
      addWt:{
        withinCity:35,
        withinState:40,
        Regional:40,
        metroToMetro:45,
        neJkKlAn:60,
        india:45,
      } },
    ],
  },
  {
    customerType: "gold",
    deliveryPartners: [
      { carrierName: "Air Xpressbees 0.5 K.G", codCharges: 55, codPercentage: "2%",
        fwd:{
          withinCity:26,
          withinState:27,
          Regional:27,
          metroToMetro:50,
          neJkKlAn:60,
          india:55,

        },
        rto:{
          withinCity:23,
          withinState:24,
          Regional:24,
          metroToMetro:38,
          neJkKlAn:50,
          india:45,
        },
        addWt:{
          withinCity:12,
          withinState:14,
          Regional:14,
          metroToMetro:35,
          neJkKlAn:50,
          india:42,
        }  },
      { carrierName: "Express Reverse", codCharges: 55, codPercentage: "2%",
        fwd:{
          withinCity:40,
          withinState:43,
          Regional:43,
          metroToMetro:50,
          neJkKlAn:65,
          india:56,

        },
        rto:{
          withinCity:40,
          withinState:43,
          Regional:43,
          metroToMetro:50,
          neJkKlAn:65,
          india:56,
        },
        addWt:{
          withinCity:28,
          withinState:30,
          Regional:30,
          metroToMetro:36,
          neJkKlAn:38,
          india:33,
        }  },
      {
        carrierName: "Surface Xpressbees 0.5 K.G",
        codCharges: 55,
        codPercentage: "2%",
        fwd:{
          withinCity:26,
          withinState:27,
          Regional:27,
          metroToMetro:38,
          neJkKlAn:50,
          india:42,

        },
        rto:{
          withinCity:23,
          withinState:24,
          Regional:24,
          metroToMetro:33,
          neJkKlAn:45,
          india:37,
        },
        addWt:{
          withinCity:12,
          withinState:14,
          Regional:14,
          metroToMetro:18,
          neJkKlAn:26,
          india:22,
        } 
      },
      { carrierName: "Xpressbees 1 K.G", codCharges: 55, codPercentage: "2%",
        fwd:{
          withinCity:38,
          withinState:42,
          Regional:42,
          metroToMetro:54,
          neJkKlAn:76,
          india:63,

        },
        rto:{
          withinCity:34,
          withinState:37,
          Regional:37,
          metroToMetro:47,
          neJkKlAn:65,
          india:55,
        },
        addWt:{
          withinCity:25,
          withinState:30,
          Regional:30,
          metroToMetro:33,
          neJkKlAn:40,
          india:36,
        }  },
      { carrierName: "Xpressbees 10 K.G", codCharges: 55, codPercentage: "2%",
        fwd:{
          withinCity:150,
          withinState:170,
          Regional:170,
          metroToMetro:185,
          neJkKlAn:270,
          india:200,

        },
        rto:{
          withinCity:130,
          withinState:250,
          Regional:250,
          metroToMetro:165,
          neJkKlAn:250,
          india:175,
        },
        addWt:{
          withinCity:12,
          withinState:14,
          Regional:14,
          metroToMetro:15,
          neJkKlAn:21,
          india:16,
        }  },
      { carrierName: "Xpressbees 2 K.G", codCharges: 55, codPercentage: "2%",
        fwd:{
          withinCity:64,
          withinState:70,
          Regional:70,
          metroToMetro:76,
          neJkKlAn:100,
          india:84,

        },
        rto:{
          withinCity:55,
          withinState:60,
          Regional:60,
          metroToMetro:68,
          neJkKlAn:90,
          india:75,
        },
        addWt:{
          withinCity:16,
          withinState:18,
          Regional:18,
          metroToMetro:20,
          neJkKlAn:30,
          india:24,
        }  },
      { carrierName: "Xpressbees 5 K.G", codCharges: 55, codPercentage: "2%",
        fwd:{
          withinCity:100,
          withinState:110,
          Regional:110,
          metroToMetro:125,
          neJkKlAn:170,
          india:140,

        },
        rto:{
          withinCity:90,
          withinState:99,
          Regional:99,
          metroToMetro:110,
          neJkKlAn:150,
          india:122,
        },
        addWt:{
          withinCity:14,
          withinState:16,
          Regional:16,
          metroToMetro:18,
          neJkKlAn:24,
          india:16,
        }  },
      {
        carrierName: "Xpressbees Next Day Delivery",
        codCharges: 55,
        codPercentage: 2.5,
        fwd:{
          withinCity:58,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,

        },
        rto:{
          withinCity:0.2,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        },
        addWt:{
          withinCity:2,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        } 
      },
      {
        carrierName: "Xpressbees Same Day Delivery",
        codCharges: 55,
        codPercentage: 2.5,
        fwd:{
          withinCity:56,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,

        },
        rto:{
          withinCity:0.8,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        },
        addWt:{
          withinCity:8,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        } 
      },
      {
        carrierName: "ECOM EXPRESS 0.5KG(333267)",
        codCharges:55,
        codPercentage: 2,
        fwd:{
          withinCity:26,
          withinState:27,
          Regional:27,
          metroToMetro:38,
          neJkKlAn:50,
          india:42,

        },
        rto:{
          withinCity:23,
          withinState:24,
          Regional:24,
          metroToMetro:33,
          neJkKlAn:45,
          india:37,
        },
        addWt:{
          withinCity:12,
          withinState:14,
          Regional:14,
          metroToMetro:18,
          neJkKlAn:26,
          india:22,
        } 
      },
      { carrierName: "ECOM EXPRESS 5KG(733269)", codCharges:55, codPercentage: 2,
        fwd:{
          withinCity:100,
          withinState:110,
          Regional:110,
          metroToMetro:125,
          neJkKlAn:170,
          india:140,

        },
        rto:{
          withinCity:90,
          withinState:99,
          Regional:99,
          metroToMetro:110,
          neJkKlAn:150,
          india:122,
        },
        addWt:{
          withinCity:14,
          withinState:16,
          Regional:16,
          metroToMetro:18,
          neJkKlAn:24,
          india:16,
        }  },
    ],
  },
  {
    customerType: "diamond",
    deliveryPartners: [
      {
        carrierName: "Air Xpressbees 0.5 K.G",
        freight: 1.8,
        codPercentage: 1.8,
        fwd:{
          withinCity:52,
          withinState:54,
          Regional:54,
          metroToMetro:100,
          neJkKlAn:120,
          india:110,

        },
        rto:{
          withinCity:46,
          withinState:48,
          Regional:48,
          metroToMetro:76,
          neJkKlAn:100,
          india:90,
        },
        addWt:{
          withinCity:24,
          withinState:28,
          Regional:28,
          metroToMetro:70,
          neJkKlAn:100,
          india:84,
        } 
      },
      { carrierName: "Express Reverse", freight: 1.8, codPercentage: 1.8,
        fwd:{
          withinCity:80,
          withinState:86,
          Regional:86,
          metroToMetro:100,
          neJkKlAn:130,
          india:112,

        },
        rto:{
          withinCity:80,
          withinState:86,
          Regional:86,
          metroToMetro:100,
          neJkKlAn:130,
          india:112,
        },
        addWt:{
          withinCity:56,
          withinState:60,
          Regional:60,
          metroToMetro:72,
          neJkKlAn:76,
          india:66,
        }  },
      {
        carrierName: "Surface Xpressbees 0.5 K.G",
        freight: 1.8,
        codPercentage: 1.8,
        fwd:{
          withinCity:80,
          withinState:86,
          Regional:86,
          metroToMetro:100,
          neJkKlAn:130,
          india:112,

        },
        rto:{
          withinCity:80,
          withinState:86,
          Regional:86,
          metroToMetro:100,
          neJkKlAn:130,
          india:112,
        },
        addWt:{
          withinCity:56,
          withinState:60,
          Regional:60,
          metroToMetro:72,
          neJkKlAn:76,
          india:66,
        }

      },
      { carrierName: "Xpressbees 1 K.G", freight: 1.8, codPercentage: 1.8 },
      { carrierName: "Xpressbees 10 K.G", freight: 1.8, codPercentage: 1.8 },
      { carrierName: "Xpressbees 2 K.G", freight: 1.8, codPercentage: 1.8 },
      { carrierName: "Xpressbees 5 K.G", freight: 1.8, codPercentage: 1.8,
        fwd:{
          withinCity:56,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,

        },
        rto:{
          withinCity:0.8,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        },
        addWt:{
          withinCity:8,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        }  },
      {
        carrierName: "Xpressbees Next Day Delivery",
        freight: 1.8,
        codPercentage: 1.8,
        fwd:{
          withinCity:100,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,

        },
        rto:{
          withinCity:1.6,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        },
        addWt:{
          withinCity:16,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        } 
      },
      {
        carrierName: "Xpressbees Same Day Delivery",
        freight: 1.8,
        codPercentage: 1.8,
        fwd:{
          withinCity:112,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,

        },
        rto:{
          withinCity:1.6,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        },
        addWt:{
          withinCity:16,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        } 
      },
      {
        carrierName: "ECOM EXPRESS 0.5KG(333267)",
        freight: 1.8,
        codPercentage: 1.8,
        fwd:{
          withinCity:56,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,

        },
        rto:{
          withinCity:0.8,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        },
        addWt:{
          withinCity:8,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        } 
      },
      {
        carrierName: "ECOM EXPRESS 5KG(733269)",
        freight: 1.8,
        codPercentage: 1.8,
        fwd:{
          withinCity:56,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,

        },
        rto:{
          withinCity:0.8,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        },
        addWt:{
          withinCity:8,
          withinState:0,
          Regional:0,
          metroToMetro:0,
          neJkKlAn:0,
          india:0,
        } 
      },
    ],
  },
];

const CustomerTypeColors = {
  bronze: "bg-amber-700",
  silver: "bg-gray-400",
  gold: "bg-yellow-500",
  diamond: "bg-blue-500",
};

export default function RateCalculator({ customerType }) {
  const [originPincode, setOriginPincode] = useState("");
  const [destinationPincode, setDestinationPincode] = useState("");
  const [productType, setProductType] = useState("prepaid");
  const [chargeableWeight, setChargeableWeight] = useState("");
  const [codAmount, setCodAmount] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedType, setExpandedType] = useState(null);

  const filteredChargeSheet = customerType
    ? chargeSheet.filter((category) => category.customerType === customerType)
    : chargeSheet;

  const toggleExpand = (customerType) => {
    setExpandedType(expandedType === customerType ? null : customerType);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const body = {
      chargeableWeight,
      productType,
      originPincode,
      destinationPincode,
    };
    try {
      const response = await axiosInstance.post(
        "/calculate/calculate-charges",
        body
      );
      console.log(response.data);
      setResult(response.data.chargesBreakdown);
    } catch (err) {
      setError(
        err.response
          ? err.response.data
          : "An error occurred while fetching rates."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side (Rate Calculator) */}
      <div className="w-[70%] p-6">
        <Card>
          <CardHeader>
            <CardTitle>Ship Dart Rate Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originPincode">Origin Pincode</Label>
                  <Input
                    id="originPincode"
                    type="text"
                    value={originPincode}
                    onChange={(e) => setOriginPincode(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destinationPincode">
                    Destination Pincode
                  </Label>
                  <Input
                    id="destinationPincode"
                    type="text"
                    value={destinationPincode}
                    onChange={(e) => setDestinationPincode(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productType">Product Type</Label>
                  <Select value={productType} onValueChange={setProductType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PREPAID">Prepaid</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                      <SelectItem value="rev">Reverse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chargeableWeight">
                    Chargeable Weight (kg)
                  </Label>
                  <Input
                    id="chargeableWeight"
                    type="number"
                    value={chargeableWeight}
                    onChange={(e) => setChargeableWeight(e.target.value)}
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codAmount">COD Amount (optional)</Label>
                  <Input
                    id="codAmount"
                    type="number"
                    value={codAmount}
                    onChange={(e) => setCodAmount(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  "Calculate Rate"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        {result.length > 0 && (
          <div>
            {result.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{item.carrierName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-2 rounded-md overflow-auto">
                    {JSON.stringify(item.breakdown, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Right Side (Rate Sheet) */}
      <div className="w-[30%] h-screen bg-white shadow-lg overflow-y-auto border-l">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-xl font-bold text-gray-800">Rate Sheet</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredChargeSheet.map((category) => (
            <div key={category.customerType} className="bg-white">
              <button
                onClick={() => toggleExpand(category.customerType)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      CustomerTypeColors[category.customerType]
                    }`}
                  />
                  <span className="font-medium capitalize">
                    {category.customerType}
                  </span>
                </div>
                {expandedType === category.customerType ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {expandedType === category.customerType && (
                <div className="px-4 py-2 bg-gray-50">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="py-2 pr-4">Carrier</th>
                        <th className="py-2 px-4">Freight</th>
                        <th className="py-2 pl-4">COD %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.deliveryPartners.map((partner, idx) => (
                        <tr key={idx} className="hover:bg-gray-100">
                          <td className="py-2 pr-4">{partner.carrierName}</td>
                          <td className="py-2 px-4">{partner.freight}%</td>
                          <td className="py-2 pl-4">
                            {partner.codPercentage}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
