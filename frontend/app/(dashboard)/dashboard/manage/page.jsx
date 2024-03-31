'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import React, { useState } from 'react'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Page() {
    const [stocks, setStocks] = useState([]);

    const addStock = () => {
        setStocks([...stocks, { id: Date.now() }]);
    }

    const removeStock = (id) => {
        setStocks(stocks.filter(stock => stock.id !== id));
    }

    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <h2 className="text-3xl font-bold tracking-tight">
                    Manage Your Portfolio
                </h2>
                <div className="w-full flex justify-end">
                    <Button varient="outline" onClick={addStock}>
                        <div className="mr-2">Add Stock</div>
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
                {stocks.map(stock => (
                    <div key={stock.id}>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Revenue
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-between">
                                <div>
                                    <div className="text-2xl font-bold">$45,231.89</div>
                                    <p className="text-xs text-muted-foreground">
                                        +20.1% from last month
                                    </p>
                                </div>
                                <div>
                                    <Button 
                                        varient="outline"
                                        onClick={() => removeStock(stock.id)}
                                        className="bg-red-600"
                                    >
                                        <div className="mr-2">Remove</div>
                                        <Minus className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}
