/**
 * Currency utility for formatting prices in Indian Rupees
 */

/**
 * Format a number as Indian Rupees
 * @param {number} amount - The amount to format
 * @param {boolean} showDecimals - Whether to show decimal places (default: false for INR)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showDecimals = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  const formattedAmount = showDecimals 
    ? amount.toFixed(2)
    : Math.round(amount).toString();

  // Format number with Indian numbering system (lakhs and crores)
  return `₹${formatIndianNumber(formattedAmount)}`;
};

/**
 * Format number with Indian numbering system
 * @param {string|number} num - Number to format
 * @returns {string} Formatted number with commas
 */
const formatIndianNumber = (num) => {
  const numStr = num.toString();
  const [integerPart, decimalPart] = numStr.split('.');
  
  // Indian numbering system: last 3 digits, then groups of 2
  const lastThree = integerPart.slice(-3);
  const otherNumbers = integerPart.slice(0, -3);
  
  let result = lastThree;
  if (otherNumbers !== '') {
    result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  
  return decimalPart ? `${result}.${decimalPart}` : result;
};

/**
 * Get currency symbol
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = () => '₹';

/**
 * Convert USD to INR (approximate rate)
 * @param {number} usdAmount - Amount in USD
 * @param {number} exchangeRate - Exchange rate (default: 83)
 * @returns {number} Amount in INR
 */
export const convertUSDtoINR = (usdAmount, exchangeRate = 83) => {
  return Math.round(usdAmount * exchangeRate);
};

export default formatCurrency;

