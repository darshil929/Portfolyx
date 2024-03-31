import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { AdapterDateFns } from 'chartjs-adapter-date-fns';

const PieChart = ({ data }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null); // to keep track of Chart instance

    useEffect(() => {
        if (chartRef && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            // Destroy the previous Chart instance if it exists
            if (chartInstance.current !== null) {
                chartInstance.current.destroy();
            }

            // Prepare data for pie chart
            const stockData = data.portfolios[0].stock.map(stock => stock.amount_money);
            const walletData = data.wallet;
            const labels = ['Stocks', 'Wallet'];
            const colors = ['green', 'blue'];

            // Create a new Chart instance
            chartInstance.current = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: [stockData.reduce((a, b) => a + b, 0), walletData],
                        backgroundColor: colors,
                    }],
                },
                options: {
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                        },
                        tooltip: {
                            enabled: true,
                        },
                    },
                    maintainAspectRatio: false, // Disable aspect ratio to make the chart responsive
                    responsive: true, // Enable responsiveness
                },
            });
        }

        // Cleanup function
        return () => {
            // Destroy the Chart instance when the component unmounts
            if (chartInstance.current !== null) {
                chartInstance.current.destroy();
            }
        };
    }, [data]);

    return <canvas style={{ width: '100%', height: 'auto', maxHeight: '400px' }} ref={chartRef} />;
};

export default PieChart;
