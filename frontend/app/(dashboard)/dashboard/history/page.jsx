import { ScrollArea } from '@/components/ui/scroll-area'
import { CalendarDateRangePicker } from "@/components/date-range-picker"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RecentSales } from "@/components/recent-sales"
import { ChevronRight } from "lucide-react"
import { Label } from "@/components/ui/label"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import React from 'react'

export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Transaction History
        </h2>
        <div className="flex justify-between w-full">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="email" placeholder="Search for a stock" />
            <Button type="submit">Search</Button>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div>
        </div>
        <Card className="col-span-4 md:col-span-3 mt-8">
          <CardHeader>
            <CardTitle>
              Date: 23rd March 2024
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
