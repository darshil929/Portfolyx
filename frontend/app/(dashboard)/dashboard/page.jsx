'use client'
import React, { useEffect, useRef,useState } from 'react';
import Chart from 'chart.js/auto';
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Overview } from "@/components/overview"
import { RecentSales } from "@/components/recent-sales"
import { Button } from "@/components/ui/button"
import LineChart from '@/components/line-chart'
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation";

export default function page() {
  const [user,setUser] = useState(null)
  const [rdata,setRdata] = useState([])
  const [activeTab, setActiveTab] = useState('overview');
  const [stockPortfolioName, setStockPortfolioName] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [update, setUpdate] = useState(0);

  const [pnl,setPnl] = useState(0)

  const [stocks,setStocks] = useState(null)
  const pieChartRef = useRef(null);
  const chartInstance = useRef(null);
  let myChart = null;
  const router = useRouter();


  useEffect(()=>{
    fetch('http://localhost:8000/user/dashboard',{credentials: "include"}).then(response => { if (response.status != 200) {
      // console.log(response)
      router.push('/login')
    }
  else{
    return response.json()
  }}).then(data => {console.log(data);setUser(data)}).catch(e => {console.log(e) })

  fetch('http://localhost:8000/stock/',{credentials: "include"}).then(response => { if (response.status != 200) {
    // console.log(response)
    router.push('/login')
  }
else{
  return response.json()
}}).then(data => {console.log(data);setStocks(data)}).catch(e => {console.log(e) })


  },[update])

  function listStocks(user) {
    const stockList = [];
    if (activeTab=='overview'){
      user.portfolios.forEach(portfolio => {
        portfolio.stock.forEach(stock => {
            stockList.push({
                stockID: stock.stockID,
                amount_money: stock.amount_money
            });
        });
    });
    }
    else{
      const port = user.portfolios.find(portfolio => portfolio.portfolio_name === activeTab)
        port.stock.forEach(stock => {
            stockList.push({
                stockID: stock.stockID,
                amount_money: stock.amount_money
            });
        });
    }
  

    return stockList;
}

function getFullNameById(id) {
  const stock = stocks.find(stock => stock._id === id);
  return stock ? stock.fullName : "Full name not found";
}

  useEffect(() => {
    // if (pieChartRef.current) {
    //   // Destroy the existing chart instance before creating a new one
    //   pieChartRef.current.destroy();
    // }
    if (user && stocks) {
    const stocks = listStocks(user)
    const labels = stocks.map(stock => getFullNameById(stock.stockID));
    const data = stocks.map(stock => stock.amount_money);

    const ctx = pieChartRef.current.getContext('2d');
    pieChartRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Stock Composition',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

  
    setPnl(calculateProfitLoss())
    
  }


  }, [stocks,activeTab]);



  function calculateProfitLoss() {
    const profitLoss = [];
    
    user.portfolios.forEach(portfolio => {
        portfolio.stock.forEach(userStock => {
            const stock = stocks.find(stock => stock._id === userStock.stockID);
            // console.log(stock)
            if (stock) {
                const currentStockValue = userStock.quantity * stock.data[stock.data.length - 1].close;
                const initialStockValue =  userStock.amount_money;
                const pl = currentStockValue - initialStockValue;
                // console.log(stock.data[stock.data.length - 1])
                profitLoss.push({
                    stockID: userStock.stockID,
                    fullName: stock.fullName,
                    profitLoss: pl.toFixed(2)
                });
            }
        });
    });

    

    let totalProfitLoss = 0;
    console.log(profitLoss)

    profitLoss.forEach(item => {
    totalProfitLoss += parseFloat(item.profitLoss);
    
});
    // console.log(totalProfitLoss)
    return totalProfitLoss.toFixed(2);
}



function calculateCash() {
  let profitLoss = 0;
  
  user.portfolios.forEach(portfolio => {
    profitLoss += parseFloat(portfolio.cash)
  });

  
  return profitLoss.toFixed(2);
}

const timeDiff = (t1)=> {
  const timestamp1 = new Date(t1);
  console.log(timestamp1,t1)
  const timestamp2 = new Date("2024-03-28T00:00:00.000+00:00"); 
  
const differenceInMilliseconds = Math.abs(timestamp2 - timestamp1);
// Convert milliseconds to years
const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25; // Consider leap years
const differenceInYears = differenceInMilliseconds / millisecondsInYear;
console.log(differenceInMilliseconds)

// Round to two decimal places
const roundedDifferenceInYears = Math.round(differenceInYears * 100) / 100;

return  roundedDifferenceInYears
}

const cagr = (portfolio) => {
  if (portfolio.stock.length >0) {
  const diff = timeDiff(portfolio.stock[0].investment_date)
  let initial = 0
  let final = 0
  portfolio.stock.forEach(userStock => {
    const stock = stocks.find(stock => stock._id === userStock.stockID);
    // console.log(stock)
    if (stock) {
      final  += userStock.quantity * stock.data[stock.data.length - 1].close;
      initial +=  userStock.amount_money;
    }
});

console.log(initial,final,diff)

  const cagrs = Math.pow(final / initial, 1 / diff) - 1;

  return cagrs.toFixed(2)
}
return 0
}



function calculateProfitLossInd(portfolio) {
  console.log(portfolio )
  const profitLoss = [];
      portfolio.stock.forEach(userStock => {
          const stock = stocks.find(stock => stock._id === userStock.stockID);
          // console.log(stock)
          if (stock) {
              const currentStockValue = userStock.quantity * stock.data[stock.data.length - 1].close;
              const initialStockValue =  userStock.amount_money;
              const pl = currentStockValue - initialStockValue;
              // console.log(stock.data[stock.data.length - 1])
              profitLoss.push({
                  stockID: userStock.stockID,
                  fullName: stock.fullName,
                  profitLoss: pl.toFixed(2)
              });
          }
      });
 

  let totalProfitLoss = 0;
  console.log(profitLoss)

  profitLoss.forEach(item => {
  totalProfitLoss += parseFloat(item.profitLoss);
  
});
  // console.log(totalProfitLoss)
  return totalProfitLoss.toFixed(2);
}



const handleTabClick = (index) => {
  setActiveTab(index);
  console.log(activeTab)
};


const addPortfolio = async () => {
  try {
    const response = await fetch('http://localhost:8000/user/add-portfolio',{
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            portfolio_name: stockPortfolioName,
            cash: stockQuantity,
        })
    });

    if (!response.ok) {
        throw new Error('Failed to add');
    }

    alert('Portfolio created successfully');
    setUpdate(update+1)
} catch (error) {
    console.error('Error adding Portfolio:', error);
}

}


  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, {user?.name} 👋
          </h2>
          <div className="hidden md:flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="outline" className="bg-green-600 text-white">+ Portfolio</Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="sm:max-w-[425px]">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Add Portfolio</DialogTitle>
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
                                                                                Cash:
                                                                            </Label>
                                                                            <Input
                                                                                id="quantity"
                                                                                placeholder="Enter cash"
                                                                                value={stockQuantity}
                                                                                onChange={(e) => setStockQuantity(e.target.value)}
                                                                                className="col-span-3"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <DialogFooter>
                                                                        <Button onClick={() => addPortfolio()}>Add</Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
            {/* <Button onClick={addPortfolio}>+ Create</Button> */}
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" onClick={() => handleTabClick('overview')}>Overview</TabsTrigger>
            {user &&  user?.portfolios.map((portfolio,index) => <TabsTrigger  value={portfolio.portfolio_name} onClick={() => handleTabClick(portfolio.portfolio_name)}>
              {portfolio.portfolio_name}
            </TabsTrigger>)}
            {/* <TabsTrigger value="self">
              Self
            </TabsTrigger>
            <TabsTrigger value="portfolio-1">
              Portfolio 1
            </TabsTrigger>
            <TabsTrigger value="portfolio-2">
              Portfolio 2
            </TabsTrigger> */}
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Profit/Loss
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
                  <div className="text-2xl font-bold">${pnl}</div>
                  {/* <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p> */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    CAGR
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
                  <div className="text-2xl font-bold">25%</div>
                  {/* <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p> */}
                </CardContent>
              </Card>
              <Card>  
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cash</CardTitle>
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
                  <div className="text-2xl font-bold">${user&&calculateCash()}</div>
                  {/* <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p> */}
                </CardContent>
              </Card>
              {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Now
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
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p>
                </CardContent>
              </Card> */}
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Top Performing Stock</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {stocks&& stocks[0].fullName}
                  </p>
                </CardHeader>
                <CardContent className="pl-2">
                {stocks && <LineChart data={stocks[0].data} />}
                </CardContent>
              </Card>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>All Stocks Composition</CardTitle>
                  <CardDescription>
                  Composition of Stocks in each Portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                {activeTab == "overview" ? <canvas ref={pieChartRef}  id="myChart" /> : null}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {user && stocks &&  user?.portfolios.map((portfolio,index) =>  <TabsContent value={portfolio.portfolio_name} key={index} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Profit/Loss
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
                  <div className="text-2xl font-bold">${calculateProfitLossInd(portfolio)}</div>
                  {/* <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p> */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    CAGR
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
                  <div className="text-2xl font-bold">{cagr(portfolio)}</div>
                  {/* <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p> */}
                </CardContent>
              </Card>
              <Card>  
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cash</CardTitle>
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
                  <div className="text-2xl font-bold">${portfolio.cash.toFixed(2)}</div>
                  {/* <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p> */}
                </CardContent>
              </Card>
              {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Now
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
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p>
                </CardContent>
              </Card> */}
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
              <CardHeader>
                  <CardTitle>Top Performing Stock</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {stocks&& portfolio.stock.length   && stocks.find(stock => stock._id == portfolio.stock[0].stockID).fullName}
                  </p>
                </CardHeader>
                <CardContent className="pl-2">
                {stocks && portfolio.stock.length && <LineChart data={stocks.find(stock => stock._id == portfolio.stock[0].stockID).data} />}
                </CardContent>
              </Card>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>All Stocks Composition</CardTitle>
                  <CardDescription>
                  Composition of Stocks in each Portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                {activeTab == portfolio.portfolio_name? <canvas ref={pieChartRef}  id="myChart" /> : null}
                </CardContent>
              </Card>
            </div>
          </TabsContent>)}


        </Tabs>
      </div>
    </ScrollArea>
  )
}
