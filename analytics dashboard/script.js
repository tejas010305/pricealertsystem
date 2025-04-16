const sampleData = generateSampleData();
let chart1, chart2;

document.addEventListener("DOMContentLoaded", () => {
  setupCharts(sampleData);

  document.getElementById("toggleSMA").addEventListener("change", () => updateChart(sampleData));
  document.getElementById("toggleVolatility").addEventListener("change", () => updateChart(sampleData));
  document.getElementById("toggleRSI").addEventListener("change", () => updateChart(sampleData));
});

function generateSampleData() {
  const data = [];
  let price = 100;
  for (let i = 0; i < 50; i++) {
    price += (Math.random() - 0.5) * 2;
    data.push({ date: `Day ${i + 1}`, price: price });
  }

  // Indicators
  data.forEach((d, i) => {
    const window = data.slice(Math.max(0, i - 13), i + 1);
    const prices = window.map(x => x.price);
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const std = Math.sqrt(prices.map(x => (x - mean) ** 2).reduce((a, b) => a + b, 0) / prices.length);

    d.sma = mean;
    d.volatility = std;

    if (i >= 14) {
      let gains = 0, losses = 0;
      for (let j = 1; j <= 14; j++) {
        const diff = data[i - j + 1].price - data[i - j].price;
        if (diff >= 0) gains += diff; else losses -= diff;
      }
      const rs = gains / (losses || 1);
      d.rsi = 100 - (100 / (1 + rs));
    }
  });

  return data;
}

function setupCharts(data) {
  const ctx1 = document.getElementById("priceChart").getContext("2d");
  const ctx2 = document.getElementById("rsiChart").getContext("2d");

  chart1 = new Chart(ctx1, {
    type: "line",
    data: {
      labels: data.map(d => d.date),
      datasets: []
    },
    options: {
      responsive: true,
      plugins: { title: { display: true, text: "Price & Indicators" } }
    }
  });

  chart2 = new Chart(ctx2, {
    type: "line",
    data: {
      labels: data.map(d => d.date),
      datasets: []
    },
    options: {
      responsive: true,
      plugins: { title: { display: true, text: "RSI (Relative Strength Index)" } }
    }
  });

  updateChart(data);
}

function updateChart(data) {
  const showSMA = document.getElementById("toggleSMA").checked;
  const showVol = document.getElementById("toggleVolatility").checked;
  const showRSI = document.getElementById("toggleRSI").checked;

  chart1.data.datasets = [
    {
      label: "Price",
      data: data.map(d => d.price),
      borderColor: "#007bff",
      fill: false,
      tension: 0.3
    },
    ...(showSMA ? [{
      label: "SMA",
      data: data.map(d => d.sma),
      borderColor: "#28a745",
      fill: false,
      tension: 0.3
    }] : []),
    ...(showVol ? [{
      label: "Volatility",
      data: data.map(d => d.volatility),
      borderColor: "#ffc107",
      fill: false,
      tension: 0.3
    }] : [])
  ];

  chart2.data.datasets = showRSI ? [{
    label: "RSI",
    data: data.map(d => d.rsi || null),
    borderColor: "#ff5733",
    fill: false,
    tension: 0.3
  }] : [];

  chart1.update();
  chart2.update();
}
