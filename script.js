// Initialize all charts and visualizations when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up individual stock charts
    createStockCharts();
    
    // Update price and change displays
    updateStockMetrics();
    
    // Set up dashboard charts
    createDashboardCharts();
});

// Create time series charts for each stock
function createStockCharts() {
    // Common chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { 
                                style: 'currency', 
                                currency: 'USD' 
                            }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            },
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Date'
                },
                ticks: {
                    maxTicksLimit: 6,
                    maxRotation: 0
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Price (USD)'
                },
                ticks: {
                    callback: function(value) {
                        return '$' + value;
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
        elements: {
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 5
            },
            line: {
                tension: 0.2
            }
        }
    };
    
    // Create a chart for each stock
    for (const ticker in stockData) {
        const stock = stockData[ticker];
        const ctx = document.getElementById(`chart-${ticker}`).getContext('2d');
        
        // Prepare data for Chart.js
        const chartData = {
            labels: stock.data.map(item => item.date),
            datasets: [{
                label: stock.name,
                data: stock.data.map(item => item.price),
                borderColor: stock.color,
                backgroundColor: `${stock.color}20`, // Very transparent version of the color
                borderWidth: 2,
                fill: true
            }]
        };
        
        // Create the chart
        new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: chartOptions
        });
    }
}

// Update the price and change displays for each stock
function updateStockMetrics() {
    for (const ticker in stockData) {
        const stock = stockData[ticker];
        
        // Update price display
        const priceElement = document.getElementById(`price-${ticker}`);
        if (priceElement) {
            priceElement.textContent = new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD' 
            }).format(stock.currentPrice);
        }
        
        // Update change display
        const changeElement = document.getElementById(`change-${ticker}`);
        if (changeElement) {
            const changeText = `${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent}%`;
            changeElement.textContent = changeText;
            
            // Add color class based on positive/negative change
            if (stock.changePercent >= 0) {
                changeElement.classList.add('positive');
                changeElement.classList.remove('negative');
            } else {
                changeElement.classList.add('negative');
                changeElement.classList.remove('positive');
            }
        }
    }
}

// Create the dashboard charts
function createDashboardCharts() {
    // Market Trend Chart
    const marketTrendCtx = document.getElementById('market-trend-chart').getContext('2d');
    new Chart(marketTrendCtx, {
        type: 'line',
        data: marketTrendData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Date'
                    },
                    ticks: {
                        maxTicksLimit: 10,
                        maxRotation: 45
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Index Value'
                    }
                }
            },
            elements: {
                point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 5
                },
                line: {
                    tension: 0.2
                }
            }
        }
    });
    
    // Sector Performance Chart
    const sectorPerformanceCtx = document.getElementById('sector-performance-chart').getContext('2d');
    new Chart(sectorPerformanceCtx, {
        type: 'bar',
        data: sectorPerformance,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y + '%';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Performance (%)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Add event listeners for interactive features
document.querySelectorAll('.stock-card').forEach(card => {
    card.addEventListener('click', function() {
        // Toggle expanded view or additional details
        this.classList.toggle('expanded');
    });
});

// Function to simulate real-time updates (for demonstration purposes)
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Update each stock with a small random price change
        for (const ticker in stockData) {
            const stock = stockData[ticker];
            const lastDataPoint = stock.data[stock.data.length - 1];
            
            // Generate a small random price movement
            const changePercent = (Math.random() - 0.5) * 0.002; // Very small change
            const newPrice = lastDataPoint.price * (1 + changePercent);
            
            // Update the current price and change values
            stock.currentPrice = parseFloat(newPrice.toFixed(2));
            stock.changeAmount = parseFloat((stock.currentPrice - lastDataPoint.price).toFixed(2));
            stock.changePercent = parseFloat((stock.changeAmount / lastDataPoint.price * 100).toFixed(2));
            stock.isPositive = stock.changeAmount >= 0;
        }
        
        // Update the displays
        updateStockMetrics();
    }, 5000); // Update every 5 seconds
}

// Uncomment to enable simulated real-time updates
// simulateRealTimeUpdates();