"use client"

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [portfolioName, setPortfolioName] = useState("");
  const [initialCapital, setInitialCapital] = useState("");
  
  // New state for backend data
  const [portfolios, setPortfolios] = useState([]);
  const [selectedStockData, setSelectedStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch portfolio and stock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // For now, using hardcoded portfolio data since backend endpoint may not be ready
        const mockPortfolios = [
          {
            id: "1",
            portfolio_name: "Tech Growth Portfolio",
            cash: 15000.00,
            holdings: [
              { symbol: "AAPL", quantity: 50, type: "stock" },
              { symbol: "MSFT", quantity: 25, type: "stock" }
            ]
          },
          {
            id: "2", 
            portfolio_name: "Balanced Portfolio",
            cash: 8500.00,
            holdings: [
              { symbol: "SPY", quantity: 100, type: "etf" }
            ]
          }
        ];
        
        setPortfolios(mockPortfolios);

        // Fetch stock data for the first stock in the first portfolio
        if (mockPortfolios.length > 0 && mockPortfolios[0].holdings.length > 0) {
          const firstStock = mockPortfolios[0].holdings[0];
          
          try {
            const response = await fetch(`http://localhost:8000/api/market/stock/${firstStock.symbol}`);
            
            if (response.ok) {
              const stockData = await response.json();
              setSelectedStockData(stockData);
            } else {
              // Fallback to mock data if API fails
              const mockStockData = {
                symbol: firstStock.symbol,
                timeSeries: [
                  { date: "2024-01-15", close: 185.50 },
                  { date: "2024-01-16", close: 187.45 },
                  { date: "2024-01-17", close: 189.75 },
                  { date: "2024-01-18", close: 192.30 },
                  { date: "2024-01-19", close: 188.90 },
                  { date: "2024-01-22", close: 191.25 },
                  { date: "2024-01-23", close: 194.80 }
                ]
              };
              setSelectedStockData(mockStockData);
            }
          } catch (stockError) {
            console.error("Error fetching stock data:", stockError);
            // Use mock data as fallback
            const mockStockData = {
              symbol: firstStock.symbol,
              timeSeries: [
                { date: "2024-01-15", close: 185.50 },
                { date: "2024-01-16", close: 187.45 },
                { date: "2024-01-17", close: 189.75 },
                { date: "2024-01-18", close: 192.30 },
                { date: "2024-01-19", close: 188.90 },
                { date: "2024-01-22", close: 191.25 },
                { date: "2024-01-23", close: 194.80 }
              ]
            };
            setSelectedStockData(mockStockData);
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data
  const chartData = selectedStockData ? {
    labels: selectedStockData.timeSeries?.map(item => item.date) || [],
    datasets: [
      {
        label: `${selectedStockData.symbol} Closing Price`,
        data: selectedStockData.timeSeries?.map(item => item.close) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: selectedStockData ? `${selectedStockData.symbol} Stock Performance` : 'Stock Performance',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  // Calculate total portfolio value
  const totalPortfolioValue = portfolios.reduce((total, portfolio) => total + portfolio.cash, 0);
  const totalPortfolios = portfolios.length;
  const totalHoldings = portfolios.reduce((total, portfolio) => total + portfolio.holdings.length, 0);

  const handleSavePortfolio = () => {
    // For now, just close the dialog
    // TODO: Add backend submission logic
    console.log("Portfolio Name:", portfolioName);
    console.log("Initial Capital:", initialCapital);
    
    // Reset form
    setPortfolioName("");
    setInitialCapital("");
    setOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 space-x-4">
        <Spinner className="h-8 w-8 text-blue-600" />
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard Home</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Welcome to your portfolio management dashboard</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Create Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Portfolio</DialogTitle>
              <DialogDescription>
                Set up a new investment portfolio to track your stocks and ETFs.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="portfolio-name" className="text-right">
                  Portfolio Name
                </Label>
                <Input
                  id="portfolio-name"
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  placeholder="My Investment Portfolio"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="initial-capital" className="text-right">
                  Initial Capital
                </Label>
                <Input
                  id="initial-capital"
                  type="number"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(e.target.value)}
                  placeholder="10000"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleSavePortfolio}
                disabled={!portfolioName || !initialCapital}
              >
                Save Portfolio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Total Portfolio Value</h3>
          <p className="text-3xl font-bold text-green-600">${totalPortfolioValue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Cash holdings across portfolios</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Active Portfolios</h3>
          <p className="text-3xl font-bold text-blue-600">{totalPortfolios}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Portfolio management</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Total Holdings</h3>
          <p className="text-3xl font-bold text-purple-600">{totalHoldings}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Stocks and ETFs</p>
        </div>
      </div>

      {/* Portfolio List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Your Portfolios</h3>
        <div className="space-y-4">
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{portfolio.portfolio_name}</h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">Cash: ${portfolio.cash.toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>{portfolio.holdings.length} holdings</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {portfolio.holdings.map((holding, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      {holding.symbol} ({holding.quantity} shares)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Chart */}
      {selectedStockData && chartData && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Stock Performance</h3>
          <div className="h-96">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
        <div className="flex space-x-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create Portfolio
              </Button>
            </DialogTrigger>
          </Dialog>
          <Button className="bg-green-600 hover:bg-green-700">
            Import Portfolio
          </Button>
          <Button className="bg-gray-600 hover:bg-gray-700">
            View Reports
          </Button>
        </div>
      </div>
    </div>
  );
}