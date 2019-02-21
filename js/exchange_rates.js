// Required variables and dependencies
require("dotenv").config();
const key = process.env.OPEN_EXCHANGE_KEY;
const request = require("request");
const colors = require("colors");
// Function for conversion of currencies while getting the exchange rates.
function getExchangeRates(base, convertTo) {
  const list = [base, convertTo].join(",");
  const url = `https://openexchangerates.org/api/latest.json?app_id=f6889ec40c8c46cb9f0c0eb937c827e1&symbols=${list}`;
  
  return new Promise((resolve, reject) => {
    console.log(`\nGetting exchange rates...`.green);
    request(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        console.log(`API connection error: ${error}`);
      }
    });
  });
}
// Exports API key for currency conversion.
module.exports = { getExchangeRates };