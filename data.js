// Sample stock data for time series visualizations
// This data is for demonstration purposes only and does not reflect actual market values

// Helper function to generate realistic-looking stock data
function generateStockData(basePrice, volatility, daysBack = 180) {
    const data = [];
    let currentPrice = basePrice;
    const today = new Date();
    
    for (let i = daysBack; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        // Generate a random price movement with some trend and volatility
        const changePercent = (Math.random() - 0.48) * volatility; // Slight upward bias
        currentPrice = currentPrice * (1 + changePercent);
        
        // Add some market-wide events for realism
        if (i === 145) currentPrice = currentPrice * 0.95; // Market dip
        if (i === 90) currentPrice = currentPrice * 1.03; // Market rally
        if (i === 30) currentPrice = currentPrice * 0.97; // Recent correction
        
        // Format date as MMM DD (e.g., Jan 01)
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit'
        });
        
        data.push({
            date: formattedDate,
            price: parseFloat(currentPrice.toFixed(2)),
            volume: Math.floor(Math.random() * 10000000) + 1000000
        });
    }
    
    return data;
}

// Generate data for each stock
const stockData = {
    // Technology Stocks
    aapl: {
        name: 'Apple Inc.',
        ticker: 'AAPL',
        sector: 'Technology',
        data: generateStockData(175.50, 0.015),
        color: 'rgb(75, 192, 192)'
    },
    msft: {
        name: 'Microsoft Corporation',
        ticker: 'MSFT',
        sector: 'Technology',
        data: generateStockData(330.75, 0.012),
        color: 'rgb(54, 162, 235)'
    },
    amzn: {
        name: 'Amazon.com Inc.',
        ticker: 'AMZN',
        sector: 'Technology',
        data: generateStockData(128.90, 0.018),
        color: 'rgb(255, 159, 64)'
    },
    googl: {
        name: 'Alphabet Inc.',
        ticker: 'GOOGL',
        sector: 'Technology',
        data: generateStockData(142.30, 0.014),
        color: 'rgb(255, 99, 132)'
    },
    meta: {
        name: 'Meta Platforms Inc.',
        ticker: 'META',
        sector: 'Technology',
        data: generateStockData(325.80, 0.020),
        color: 'rgb(153, 102, 255)'
    },
    
    // Other Sectors
    tsla: {
        name: 'Tesla Inc.',
        ticker: 'TSLA',
        sector: 'Automotive',
        data: generateStockData(215.50, 0.025), // Higher volatility
        color: 'rgb(255, 99, 132)'
    },
    nvda: {
        name: 'NVIDIA Corporation',
        ticker: 'NVDA',
        sector: 'Technology',
        data: generateStockData(420.60, 0.022),
        color: 'rgb(75, 192, 192)'
    },
    jpm: {
        name: 'JPMorgan Chase & Co.',
        ticker: 'JPM',
        sector: 'Financial Services',
        data: generateStockData(182.30, 0.010), // Lower volatility for financial
        color: 'rgb(54, 162, 235)'
    },
    jnj: {
        name: 'Johnson & Johnson',
        ticker: 'JNJ',
        sector: 'Healthcare',
        data: generateStockData(152.80, 0.008), // Lower volatility for healthcare
        color: 'rgb(255, 159, 64)'
    },
    wmt: {
        name: 'Walmart Inc.',
        ticker: 'WMT',
        sector: 'Retail',
        data: generateStockData(68.90, 0.009),
        color: 'rgb(153, 102, 255)'
    }
};

// Calculate current prices and changes for display
for (const ticker in stockData) {
    const stock = stockData[ticker];
    const data = stock.data;
    const currentPrice = data[data.length - 1].price;
    const previousPrice = data[data.length - 2].price;
    const changeAmount = currentPrice - previousPrice;
    const changePercent = (changeAmount / previousPrice) * 100;
    
    stock.currentPrice = currentPrice;
    stock.changeAmount = parseFloat(changeAmount.toFixed(2));
    stock.changePercent = parseFloat(changePercent.toFixed(2));
    stock.isPositive = changeAmount >= 0;
}

// Generate sector performance data
const sectorPerformance = {
    labels: ['Technology', 'Financial Services', 'Healthcare', 'Retail', 'Automotive'],
    datasets: [{
        label: 'Sector Performance (Last 30 Days)',
        data: [12.5, 8.2, 5.7, 4.3, 15.8],
        backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(255, 159, 64)',
            'rgb(153, 102, 255)',
            'rgb(255, 99, 132)'
        ],
        borderWidth: 1
    }]
};

// Generate market trend data (last 30 days)
const marketTrendData = {
    labels: stockData.aapl.data.slice(-30).map(item => item.date),
    datasets: [{
        label: 'Market Index',
        data: stockData.aapl.data.slice(-30).map((item, index) => {
            // Create a weighted average of all stocks to simulate a market index
            let sum = 0;
            let count = 0;
            for (const ticker in stockData) {
                sum += stockData[ticker].data[stockData[ticker].data.length - 30 + index].price / stockData[ticker].data[stockData[ticker].data.length - 30].price;
                count++;
            }
            return (sum / count) * 100; // Normalize to percentage change from start
        }),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
};