'use client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useState, useEffect } from 'react';
import React from 'react'
import LineChart from '../../../../components/line-chart'
import { data } from 'autoprefixer'

export default function page() {
    const [stockData, setStockData] = useState([]);
    const [etfData, setEtfData] = useState([]);
    const [stockPortfolioName, setStockPortfolioName] = useState('');
    const [etfPortfolioName, setEtfPortfolioName] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [etfQuantity, setEtfQuantity] = useState('');

    useEffect(() => {
        async function fetchStockData() {
            try {
                const response = await fetch('http://localhost:8000/stock',{credentials: "include"});
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setStockData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchStockData();
    }, []);

    useEffect(() => {
        async function fetchStockData() {
            try {
                const response = await fetch('http://localhost:8000/etf', {credentials: "include"});
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                const stockId = data._id
                setEtfData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchStockData();
    }, []);

    const handleBuyStock = async (item) => {
        try {
            console.log(item)
            const response = await fetch('http://localhost:8000/stock/buy-stock',{
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    stockID: item,
                    portfolio_name: stockPortfolioName,
                    qty: stockQuantity,
                    investment_date: '2024-03-31T03:53:14.063'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to buy stock');
            }

            alert('Stock bought successfully');
        } catch (error) {
            console.error('Error buying stock:', error);
        }
    };


    const handleBuyEtf = async (item) => {
        try {
            console.log(item)
            const response = await fetch('http://localhost:8000/etf/buy-etf',{
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    etfID: item,
                    portfolio_name: etfPortfolioName,
                    qty: etfQuantity,
                    investment_date: '2024-03-31T03:53:14.063'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to buy stock');
            }

            alert('Stock bought successfully');
        } catch (error) {
            console.error('Error buying stock:', error);
        }
    };


    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Explore
                    </h2>
                    <div className="hidden md:flex items-center space-x-2">
                        <CalendarDateRangePicker />
                        <Button>Download</Button>
                    </div>
                </div>
                <Tabs defaultValue="stocks" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="stocks">Stocks</TabsTrigger>
                        <TabsTrigger value="etfs">ETFs</TabsTrigger>
                    </TabsList>
                    <TabsContent value="stocks" className="space-y-4">
                        {/* <h2 className="text-2xl font-bold tracking-tight text-green-600">
                            Gainers
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Revenue
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$45,231.89</div>
                                    <p className="text-xs text-muted-foreground">
                                        +20.1% from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Subscriptions
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+2350</div>
                                    <p className="text-xs text-muted-foreground">
                                        +180.1% from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <rect width="20" height="14" x="2" y="5" rx="2" />
                                        <path d="M2 10h20" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+12,234</div>
                                    <p className="text-xs text-muted-foreground">
                                        +19% from last month
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-red-600">
                            Losers
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Revenue
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$45,231.89</div>
                                    <p className="text-xs text-muted-foreground">
                                        +20.1% from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Subscriptions
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+2350</div>
                                    <p className="text-xs text-muted-foreground">
                                        +180.1% from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <rect width="20" height="14" x="2" y="5" rx="2" />
                                        <path d="M2 10h20" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+12,234</div>
                                    <p className="text-xs text-muted-foreground">
                                        +19% from last month
                                    </p>
                                </CardContent>
                            </Card>
                        </div> */}
                        <h2 className="text-2xl font-bold tracking-tight">
                            Stocks
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                            <Accordion type="single" collapsible>
                                {stockData.map((item, index) => (
                                    <AccordionItem value={item} key={index} className="w-full">
                                        <AccordionTrigger>
                                            <Card className="w-full">
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <CardTitle className="text-l font-medium">
                                                        {item.fullName}  ({item.shortName})
                                                    </CardTitle>
                                                </CardHeader>
                                                {[item.data[item.data.length - 1]].map((iteme, index) => (
                                                    <CardContent key={index} className='flex justify-between'>
                                                        <div className="flex w-full justify-between">
                                                            <div className='w-1/2 flex-col items-start'>
                                                                <div className='mt-2'>
                                                                    Open: {iteme.open}
                                                                </div>
                                                                <div className='mt-2'>
                                                                    Close: {iteme.close}
                                                                </div>
                                                            </div>
                                                            <div className='w-1/2 flex-col items-start'>
                                                                <div className='mt-2 text-green-600'>
                                                                    High: {iteme.high}
                                                                </div>
                                                                <div className='mt-2 text-red-600'>
                                                                    Low: {iteme.low}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col w-16">
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="outline" className="bg-green-600 text-white">Buy</Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="sm:max-w-[425px]">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Buy</DialogTitle>
                                                                        {/* <DialogDescription>
                                                                            
                                                                            Stock ID: {item._id}
                                                                        </DialogDescription> */}
                                                                    </DialogHeader>
                                                                    <div className="grid gap-4 py-4">
                                                                        <div className="grid grid-cols-3 items-center gap-4">
                                                                            <Label htmlFor="name" className="text-left">
                                                                                Portfolio Name:
                                                                            </Label>
                                                                            <Input
                                                                                id="name"
                                                                                placeholder='Enter portfolio name'
                                                                                value={stockPortfolioName}
                                                                                onChange={(e) => setStockPortfolioName(e.target.value)}
                                                                                className="col-span-3"
                                                                            />
                                                                        </div>
                                                                        <div className="grid grid-cols-3 items-center gap-4">
                                                                            <Label htmlFor="quantity" className="text-left">
                                                                                Quantity:
                                                                            </Label>
                                                                            <Input
                                                                                id="quantity"
                                                                                placeholder="Enter quantity"
                                                                                value={stockQuantity}
                                                                                onChange={(e) => setStockQuantity(e.target.value)}
                                                                                className="col-span-3"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <DialogFooter>
                                                                        <Button onClick={() => handleBuyStock(item._id)}>Buy</Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                            {/* <Button variant="outline" className="bg-red-600 text-white mt-2">Sell</Button> */}
                                                        </div>
                                                    </CardContent>
                                                ))}
                                            </Card>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <LineChart data={item.data} />
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </TabsContent>
                    <TabsContent value="etfs" className="space-y-4">
                        <h2 className="text-2xl font-bold tracking-tight">
                            ETFs
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                            <Accordion type="single" collapsible>
                                {etfData.map((item, index) => (
                                    <AccordionItem value={item} key={index} className="w-full">
                                        <AccordionTrigger>
                                            <Card className="w-full">
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <CardTitle className="text-l font-medium">
                                                        {item.name}
                                                    </CardTitle>
                                                </CardHeader>
                                                {[item.data[item.data.length - 1]].map((iteme, index) => (
                                                    <CardContent key={index} className='flex justify-between'>
                                                        <div className="flex w-full justify-between">
                                                            <div className='w-1/2 flex-col items-start'>
                                                                <div className='mt-2'>
                                                                    Open: {iteme.open}
                                                                </div>
                                                                <div className='mt-2'>
                                                                    Close: {iteme.close}
                                                                </div>
                                                            </div>
                                                            <div className='w-1/2 flex-col items-start'>
                                                                <div className='mt-2 text-green-600'>
                                                                    High: {iteme.high}
                                                                </div>
                                                                <div className='mt-2 text-red-600'>
                                                                    Low: {iteme.low}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col w-16">
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="outline" className="bg-green-600 text-white">Buy</Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="sm:max-w-[425px]">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Buy</DialogTitle>
                                                                        <DialogDescription>
                                                                            ETF ID: {iteme._id}
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="grid gap-4 py-4">
                                                                        <div className="grid grid-cols-3 items-center gap-4">
                                                                            <Label htmlFor="name" className="text-left">
                                                                                Portfolio Name:
                                                                            </Label>
                                                                            <Input
                                                                                id="name"
                                                                                placeholder='Enter portfolio name'
                                                                                value={etfPortfolioName}
                                                                                onChange={(e) => setEtfPortfolioName(e.target.value)}
                                                                                className="col-span-3"
                                                                            />
                                                                        </div>
                                                                        <div className="grid grid-cols-3 items-center gap-4">
                                                                            <Label htmlFor="quantity" className="text-left">
                                                                                Quantity:
                                                                            </Label>
                                                                            <Input
                                                                                id="quantity"
                                                                                placeholder="Enter quantity"
                                                                                value={etfQuantity}
                                                                                onChange={(e) => setEtfQuantity(e.target.value)}
                                                                                className="col-span-3"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <DialogFooter>
                                                                        <Button onClick={() => handleBuyEtf(item._id)}>Buy</Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                            {/* <Button variant="outline" className="bg-red-600 text-white mt-2">Sell</Button> */}
                                                        </div>
                                                    </CardContent>
                                                ))}
                                            </Card>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <LineChart data={item.data} />
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </ScrollArea>
    )
}