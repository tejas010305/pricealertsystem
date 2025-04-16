let currentPrice = 0;
let alertThreshold = null;

function generateRandomPrice() {
  currentPrice = (Math.random() * 200).toFixed(2); // Random price between 0 - 200
  document.getElementById('price').textContent = `$${currentPrice}`;
  checkAlert();
}

function setAlert() {
  const input = document.getElementById('alertPrice').value;
  alertThreshold = parseFloat(input);
  document.getElementById('notification').classList.add('hidden');
  alert("Alert set for $" + alertThreshold);
}

function checkAlert() {
  if (alertThreshold !== null && parseFloat(currentPrice) >= alertThreshold) {
    const notification = document.getElementById('notification');
    notification.textContent = `🚨 Price Alert! Price has reached $${currentPrice}`;
    notification.classList.remove('hidden');
    alertThreshold = null; // reset after alert
  }
}

// Update price every 3 seconds
setInterval(generateRandomPrice, 3000);

// Generate first price
generateRandomPrice();
