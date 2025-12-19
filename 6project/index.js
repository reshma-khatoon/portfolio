// API Configuration
const API_URL = "https://api.exchangerate-api.com/v4/latest";

// State Management
let conversionHistory = JSON.parse(localStorage.getItem("conversionHistory")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let exchangeRates = {};

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  renderFavorites();
  renderHistory();
  fetchExchangeRates();
  
  // Event listeners
  document.getElementById("amount").addEventListener("input", convertCurrency);
  document.getElementById("fromCurrency").addEventListener("change", convertCurrency);
  document.getElementById("toCurrency").addEventListener("change", convertCurrency);
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
});

// Fetch Exchange Rates
async function fetchExchangeRates() {
  const from = document.getElementById("fromCurrency").value;
  const loader = document.getElementById("loader");
  const error = document.getElementById("error");
  
  loader.classList.remove("d-none");
  error.classList.add("d-none");

  try {
    const response = await fetch(`${API_URL}/${from}`);
    const data = await response.json();
    exchangeRates = data.rates;
    document.getElementById("updateTime").textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    convertCurrency();
  } catch (err) {
    error.textContent = "⚠️ Failed to fetch rates. Using cached data.";
    error.classList.remove("d-none");
  } finally {
    loader.classList.add("d-none");
  }
}

// Convert Currency
async function convertCurrency() {
  const amount = parseFloat(document.getElementById("amount").value);
  const from = document.getElementById("fromCurrency").value;
  const to = document.getElementById("toCurrency").value;
  const result = document.getElementById("result");

  if (isNaN(amount) || amount <= 0) {
    result.innerHTML = "";
    return;
  }

  // If rates not loaded, fetch them
  if (Object.keys(exchangeRates).length === 0) {
    await fetchExchangeRates();
  }

  let converted;
  if (from === to) {
    converted = amount;
  } else {
    if (!exchangeRates[to]) {
      result.innerHTML = `<p class="error-text">Rate not available</p>`;
      return;
    }
    converted = amount * exchangeRates[to];
  }

  // Update rate info
  const rate = exchangeRates[to] || 1;
  document.getElementById("rateFrom").textContent = from;
  document.getElementById("rateValue").textContent = rate.toFixed(4);
  document.getElementById("rateTo").textContent = to;

  result.innerHTML = `
    <div class="result-display">
      <span class="result-amount">${amount.toFixed(2)}</span>
      <span class="result-currency">${from}</span>
      <span class="result-equals">=</span>
      <span class="result-amount highlight">${converted.toFixed(2)}</span>
      <span class="result-currency">${to}</span>
    </div>
  `;

  // Add to history
  addToHistory(amount, from, converted, to);
}

// Swap Currencies
function swapCurrencies() {
  const fromSelect = document.getElementById("fromCurrency");
  const toSelect = document.getElementById("toCurrency");
  [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
  fetchExchangeRates();
}

// Add to History
function addToHistory(amount, from, converted, to) {
  const entry = {
    id: Date.now(),
    amount: amount.toFixed(2),
    from: from,
    converted: converted.toFixed(2),
    to: to,
    timestamp: new Date().toLocaleTimeString()
  };

  conversionHistory.unshift(entry);
  if (conversionHistory.length > 10) conversionHistory.pop();
  localStorage.setItem("conversionHistory", JSON.stringify(conversionHistory));
  renderHistory();
}

// Render History
function renderHistory() {
  const historyEl = document.getElementById("history");
  
  if (conversionHistory.length === 0) {
    historyEl.innerHTML = "<p class='empty-message'>No conversions yet</p>";
    document.getElementById("clearHistoryBtn").classList.add("d-none");
    return;
  }

  document.getElementById("clearHistoryBtn").classList.remove("d-none");
  historyEl.innerHTML = conversionHistory.map(entry => `
    <div class="history-item">
      <span class="history-text">
        <strong>${entry.amount}</strong> ${entry.from} = <strong>${entry.converted}</strong> ${entry.to}
      </span>
      <span class="history-time">${entry.timestamp}</span>
    </div>
  `).join("");
}

// Clear History
function clearHistory() {
  if (confirm("Are you sure you want to clear history?")) {
    conversionHistory = [];
    localStorage.removeItem("conversionHistory");
    renderHistory();
  }
}

// Add Favorite
function addFavorite() {
  const from = document.getElementById("favFrom").value;
  const to = document.getElementById("favTo").value;

  if (from === to) {
    alert("Select different currencies!");
    return;
  }

  if (!favorites.some(fav => fav.from === from && fav.to === to)) {
    favorites.push({ from, to });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
    toggleFavoriteForm();
  } else {
    alert("This pair is already in favorites!");
  }
}

// Render Favorites
function renderFavorites() {
  const favEl = document.getElementById("favorites");
  
  if (favorites.length === 0) {
    favEl.innerHTML = "<p class='empty-message'>No favorites yet</p>";
    return;
  }

  favEl.innerHTML = favorites.map(fav => `
    <div class="favorite-item">
      <button onclick="useFavorite('${fav.from}', '${fav.to}')">
        <i class="fas fa-exchange-alt"></i> ${fav.from} → ${fav.to}
      </button>
      <button class="remove-btn" onclick="removeFavorite('${fav.from}', '${fav.to}')">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join("");
}

// Use Favorite
function useFavorite(from, to) {
  document.getElementById("fromCurrency").value = from;
  document.getElementById("toCurrency").value = to;
  fetchExchangeRates();
}

// Remove Favorite
function removeFavorite(from, to) {
  favorites = favorites.filter(fav => !(fav.from === from && fav.to === to));
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
}

// Toggle Favorite Form
function toggleFavoriteForm() {
  document.getElementById("favoriteForm").classList.toggle("d-none");
}

// Theme Toggle
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
  updateThemeIcon();
}

function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.querySelector("#themeToggle i");
  if (document.body.classList.contains("dark-mode")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
}