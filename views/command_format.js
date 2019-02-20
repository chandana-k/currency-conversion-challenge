// Required dependencies and packages
const moment = require("moment");
const pluralize = require('pluralize');
const columnify = require("columnify");
const getSymbolFromCurrency = require("currency-symbol-map");
// Function for currency name pluralizer
function namePluralizer(amount, currencyName) {
  const factor = amount > 1 ? 2 : 1;

  return currencyName == "Japanese Yen" ? currencyName : pluralize(currencyName, factor);
}
// Function for calculating currency value format. 
function valueFormatter(amount) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
// Function to format string- ISO code, amount, currency name and type.
function formatString(isoCode, amount, currencyName, type) {
  const symbol = getSymbolFromCurrency(isoCode);
  const value = valueFormatter(amount);
  const name = namePluralizer(amount, currencyName);

  if (type == "input") {
    return `${symbol} ${value} ${name}`
  } else {
    return ({
      [`${symbol} ${value}`]: name
    })
  }
}
// Function for formatting currency conversions as columns
function conversionsAsColumns(outputStringsForColumnify) {
  console.log(columnify(outputStringsForColumnify, {
    columns: ["Value", "Currency"],
    minWidth: 16,
    config: {
      Value: { align: "right" }
    }
  }))
}
// Function for currency conversion pluralization.
function conversionPluralization(length) {
  if (length > 1) {
    return "These currency conversions were";
  } else {
    return "This currency conversion was";
  }
}
// Function for current time format
function messageTimeFormatter(time) {
  return moment(time).format("dddd, MMMM Do, YYYY [at] h:mm a");
}
// Function to list time format.
function listTimeFormat(time) {
  return moment(time).format("h:mm a, MM/DD/YYYY");
}
// Export modules.
module.exports = {
  namePluralizer,
  valueFormatter,
  formatString,
  conversionsAsColumns,
  conversionPluralization,
  messageTimeFormatter,
  listTimeFormat
};