import { ScrollArea } from '@/components/ui/scroll-area'
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import React from 'react'

export default function page() {
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
                <h2 className="text-2xl font-bold tracking-tight text-green-600">
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
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                    Stocks
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="w-full">
                            <AccordionTrigger>
                                <Card className="w-full">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-l font-medium">
                                            Subscriptions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='flex justify-between'>
                                    <div>
                                        Price
                                    </div>
                                        <div className="flex flex-col w-16">
                                            <Button variant="outline" className="bg-green-600 text-white">Buy</Button>
                                            <Button variant="outline" className="bg-red-600 text-white mt-2">Sell</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </AccordionTrigger>
                            <AccordionContent>
                                Graph Here
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="w-full">
                            <AccordionTrigger>
                            <Card className="w-full">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-l font-medium">
                                            Subscriptions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='flex justify-between'>
                                    <div>
                                        Price
                                    </div>
                                        <div className="flex flex-col w-16">
                                            <Button variant="outline" className="bg-green-600 text-white">Buy</Button>
                                            <Button variant="outline" className="bg-red-600 text-white mt-2">Sell</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </AccordionTrigger>
                            <AccordionContent>
                                Graph Here
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="w-full">
                            <AccordionTrigger>
                            <Card className="w-full">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-l font-medium">
                                            Subscriptions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='flex justify-between'>
                                    <div>
                                        Price
                                    </div>
                                        <div className="flex flex-col w-16">
                                            <Button variant="outline" className="bg-green-600 text-white">Buy</Button>
                                            <Button variant="outline" className="bg-red-600 text-white mt-2">Sell</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </AccordionTrigger>
                            <AccordionContent>
                                Graph Here
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="w-full">
                            <AccordionTrigger>
                            <Card className="w-full">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-l font-medium">
                                            Subscriptions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='flex justify-between'>
                                    <div>
                                        Price
                                    </div>
                                        <div className="flex flex-col w-16">
                                            <Button variant="outline" className="bg-green-600 text-white">Buy</Button>
                                            <Button variant="outline" className="bg-red-600 text-white mt-2">Sell</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </AccordionTrigger>
                            <AccordionContent>
                                Graph Here
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="w-full">
                            <AccordionTrigger>
                            <Card className="w-full">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-l font-medium">
                                            Subscriptions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className='flex justify-between'>
                                    <div>
                                        Price
                                    </div>
                                        <div className="flex flex-col w-16">
                                            <Button variant="outline" className="bg-green-600 text-white">Buy</Button>
                                            <Button variant="outline" className="bg-red-600 text-white mt-2">Sell</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </AccordionTrigger>
                            <AccordionContent>
                                Graph Here
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </ScrollArea>
    )
}

