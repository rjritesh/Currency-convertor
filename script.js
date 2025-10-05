// Exchange rates (mock data for demonstration)
const exchangeRates = {
    USD: { EUR: 0.85, GBP: 0.73, JPY: 110.0, CAD: 1.25, AUD: 1.35, CHF: 0.92, CNY: 6.45, INR: 74.5, KRW: 1180.0 },
    EUR: { USD: 1.18, GBP: 0.86, JPY: 129.5, CAD: 1.47, AUD: 1.59, CHF: 1.08, CNY: 7.59, INR: 87.8, KRW: 1391.0 },
    GBP: { USD: 1.37, EUR: 1.16, JPY: 150.5, CAD: 1.71, AUD: 1.85, CHF: 1.26, CNY: 8.83, INR: 102.1, KRW: 1616.0 },
    JPY: { USD: 0.009, EUR: 0.0077, GBP: 0.0066, CAD: 0.011, AUD: 0.012, CHF: 0.008, CNY: 0.059, INR: 0.68, KRW: 10.7 },
    CAD: { USD: 0.80, EUR: 0.68, GBP: 0.58, JPY: 88.0, AUD: 1.08, CHF: 0.74, CNY: 5.16, INR: 59.6, KRW: 944.0 },
    AUD: { USD: 0.74, EUR: 0.63, GBP: 0.54, JPY: 81.5, CAD: 0.93, CHF: 0.68, CNY: 4.78, INR: 55.2, KRW: 874.0 },
    CHF: { USD: 1.09, EUR: 0.93, GBP: 0.79, JPY: 119.5, CAD: 1.36, AUD: 1.47, CNY: 7.03, INR: 81.2, KRW: 1283.0 },
    CNY: { USD: 0.15, EUR: 0.13, GBP: 0.11, JPY: 17.0, CAD: 0.19, AUD: 0.21, CHF: 0.14, INR: 11.6, KRW: 182.5 },
    INR: { USD: 0.013, EUR: 0.011, GBP: 0.0098, JPY: 1.47, CAD: 0.017, AUD: 0.018, CHF: 0.012, CNY: 0.086, KRW: 15.8 },
    KRW: { USD: 0.00085, EUR: 0.00072, GBP: 0.00062, JPY: 0.093, CAD: 0.0011, AUD: 0.0011, CHF: 0.00078, CNY: 0.0055, INR: 0.063 }
};

// History storage
let conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];

// Theme management
function toggleTheme() {
    const body = document.body;
    const isLight = body.classList.contains('light-theme');
    
    if (isLight) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
    }
}

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(savedTheme + '-theme');
}

// Swap currencies
function swapCurrencies() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    
    const fromValue = fromSelect.value;
    const toValue = toSelect.value;
    
    fromSelect.value = toValue;
    toSelect.value = fromValue;
}

// Convert currency
function convertCurrency(event) {
    event.preventDefault();
    
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    
    if (!amount || amount <= 0) {
        return showError('Please enter a valid amount');
    }
    
    if (fromCurrency === toCurrency) {
        return showError('Please select different currencies');
    }
    
    const rate = exchangeRates[fromCurrency]?.[toCurrency];
    
    if (!rate) {
        return showError('Conversion rate not available');
    }
    
    const result = amount * rate;
    
    displayResult(amount, fromCurrency, result, toCurrency, rate);
    addToHistory(amount, fromCurrency, result, toCurrency);
}

// Display conversion result
function displayResult(amount, fromCurrency, result, toCurrency, rate) {
    const resultSection = document.getElementById('resultSection');
    const resultAmount = document.getElementById('resultAmount');
    const resultRate = document.getElementById('resultRate');
    
    resultAmount.textContent = `${result.toFixed(2)} ${toCurrency}`;
    resultRate.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
    
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Add to history
function addToHistory(amount, fromCurrency, result, toCurrency) {
    const conversion = {
        id: Date.now(),
        amount,
        fromCurrency,
        result: result.toFixed(2),
        toCurrency,
        timestamp: new Date().toLocaleString()
    };
    
    conversionHistory.unshift(conversion);
    if (conversionHistory.length > 10) conversionHistory = conversionHistory.slice(0, 10);
    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
    updateHistoryDisplay();
}

// Update history
function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    if (conversionHistory.length === 0) {
        historyList.innerHTML = '<div class="history-empty">No conversions yet</div>';
        return;
    }
    
    historyList.innerHTML = conversionHistory.map(conv => `
        <div class="history-item">
            <div class="history-conversion">
                ${conv.amount} ${conv.fromCurrency} → ${conv.result} ${conv.toCurrency}
            </div>
            <div class="history-time">${conv.timestamp.split(',')[1].trim()}</div>
        </div>
    `).join('');
}

// Clear history
function clearHistory() {
    conversionHistory = [];
    localStorage.removeItem('conversionHistory');
    updateHistoryDisplay();
}

// Show error
function showError(message) {
    const resultSection = document.getElementById('resultSection');
    const resultAmount = document.getElementById('resultAmount');
    const resultRate = document.getElementById('resultRate');
    
    resultAmount.textContent = 'Error';
    resultAmount.style.color = 'var(--error-color)';
    resultRate.textContent = message;
    
    resultSection.style.display = 'block';
    resultSection.style.borderColor = 'var(--error-color)';
    
    setTimeout(() => {
        resultSection.style.display = 'none';
        resultAmount.style.color = '';
        resultSection.style.borderColor = '';
    }, 3000);
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    updateHistoryDisplay();
    document.getElementById('amount').value = '100';
    document.getElementById('amount').focus();
});
