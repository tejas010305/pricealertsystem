const ctx = document.getElementById('candlestickChart').getContext('2d');
const patternsDiv = document.getElementById('patterns');

let candleData = generateRandomCandles(30); // 30 candles
let patterns = detectPatterns(candleData);

const chart = new Chart(ctx, {
  type: 'candlestick',
  data: {
    datasets: [{
      label: 'Random Candles',
      data: candleData,
      borderColor: '#333',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(ctx) {
            const ohlc = ctx.raw;
            return `O: ${ohlc.o} H: ${ohlc.h} L: ${ohlc.l} C: ${ohlc.c}`;
          }
        }
      }
    }
  }
});

// Show detected patterns
patternsDiv.innerHTML = patterns.length
  ? `📌 Detected Patterns:<br>${patterns.map(p => `- ${p.name} at index ${p.index}`).join('<br>')}`
  : "❌ No patterns detected.";

function generateRandomCandles(count) {
  let candles = [];
  let base = 100;
  for (let i = 0; i < count; i++) {
    let open = base + Math.random() * 5;
    let close = open + (Math.random() - 0.5) * 10;
    let high = Math.max(open, close) + Math.random() * 3;
    let low = Math.min(open, close) - Math.random() * 3;
    candles.push({ x: i, o: round(open), h: round(high), l: round(low), c: round(close) });
    base = close;
  }
  return candles;
}

function round(n) {
  return Math.round(n * 100) / 100;
}

// Detect common patterns
function detectPatterns(candles) {
  let results = [];

  for (let i = 1; i < candles.length; i++) {
    let c = candles[i];
    let prev = candles[i - 1];
    let body = Math.abs(c.o - c.c);
    let range = c.h - c.l;

    // Doji
    if (body < range * 0.1) {
      results.push({ name: "Doji", index: i });
    }

    // Hammer
    if (body < range * 0.3 && (c.l < Math.min(c.o, c.c) - body)) {
      results.push({ name: "Hammer", index: i });
    }

    // Bullish Engulfing
    if (prev.c < prev.o && c.c > c.o && c.o < prev.c && c.c > prev.o) {
      results.push({ name: "Bullish Engulfing", index: i });
    }

    // Bearish Engulfing
    if (prev.c > prev.o && c.c < c.o && c.o > prev.c && c.c < prev.o) {
      results.push({ name: "Bearish Engulfing", index: i });
    }
  }

  return results;
}
