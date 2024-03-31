// components/LineChart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { AdapterDateFns } from 'chartjs-adapter-date-fns';

const LineChart = ({ data }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null); // to keep track of Chart instance

    useEffect(() => {
        if (chartRef && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            // Destroy the previous Chart instance if it exists
            if (chartInstance.current !== null) {
                chartInstance.current.destroy();
            }

            // Create a new Chart instance
            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(item => formatDate(item.date)), // format date
                    datasets: [
                        {
                            label: 'High',
                            data: data.map(item => item.high),
                            borderColor: 'green',
                            borderWidth: 1.5, // thinner line
                            pointRadius: 0, // remove dots on each data point
                            fill: false,
                        },
                        {
                            label: 'Low',
                            data: data.map(item => item.low),
                            borderColor: 'red',
                            borderWidth: 1.5, // thinner line
                            pointRadius: 0, // remove dots on each data point
                            fill: false,
                        },
                    ],
                },
                options: {
                    plugins: {
                        legend: false,
                        tooltip: false,
                    },
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day',
                                tooltipFormat: 'yyyy-MM-dd', // tooltip format
                            },
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

    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date;
    };

    return <canvas style={{ width: '100%', height: 'auto', maxHeight: '400px' }} ref={chartRef} id={'a'}/>;
};

export default LineChart;
