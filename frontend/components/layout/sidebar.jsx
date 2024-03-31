'use client'
import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { DashboardNav } from "@/components/dashboard-nav"
import { navItems } from "@/constants/data"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "../ui/button"



export default function Sidebar() {


    const [goal, setGoal] = React.useState(350)
  
    function onClick(adjustment) {
      setGoal(Math.max(200, Math.min(10000, goal + adjustment)))
    }


  return (
    <nav
      className={cn(`relative hidden h-screen border-r pt-4 lg:block w-72`)}
    >
      <div className="space-y-4 py-4 h-full">
        <div className="px-3 py-2 flex flex-col justify-between h-full">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
              Overview
            </h2>
            <DashboardNav items={navItems} />
          </div>
          
          <div className="mx-auto w-full max-w-sm">
          <CardHeader className="p-0">
            <CardTitle className="p-0">Funds</CardTitle>
            <CardDescription>Add or remove funds</CardDescription>
          </CardHeader>
          <div className=" pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(-10)}
                disabled={goal <= 200}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-5xl font-bold tracking-tighter">
                  {goal}
                </div>
               
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(10)}
                disabled={goal >= 10000}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
          </div>
          </div>


        </div>
      </div>
    </nav>
  )
}
