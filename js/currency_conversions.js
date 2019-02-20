// Required variables and dependencies
const mongoose = require('mongoose');
const db       = mongoose.connection;
// Connect to the Mongo DB
mongoose.connect('mongodb://localhost/currency_converter')
  .catch(err => console.error('Could not connect to the database...', err));
// Required modules
const currencyNames        = require('../lib/currency_names_codes.json');
const { getExchangeRates } = require("./exchange_rates");
const { Conversion }       = require('./models/conversion_validator')
// Function for base currency name, amount input and conversion.
function currencyLogInput(answers) {
  const {
    baseCurrencyName,
    convertToCurrencyNames,
    inputAmount
  } = answers;

  const convertToObject = convertToCurrencyNames.map(name => ({
    name: name,
    iso: currencyNames[name]
  }));
  
  return {
    name: baseCurrencyName,
    iso: currencyNames[baseCurrencyName],
    amount: inputAmount,
    convertToNames: convertToObject,
  }
}
// The async function declaration defines an asynchronous function, which returns an AsyncFunction object.
async function getCurrencyRates(inputs) {
  try {
    const base = inputs.iso;
    const convert = inputs.convertToNames.map(c => c.iso);
    const rateApiResponse = await getExchangeRates(base, convert);

    const { rates } = rateApiResponse;
    const ratePublicationTime = rateApiResponse.timestamp * 1000;
    
    const convertToOutputs = convert.map(currency => ({
      iso: currency,
      rate: rates[currency]
    }))

    const ratesObject = { 
      baseRate: rates[inputs.iso],
      convertToRate: convertToOutputs,
      ratePublicationTime: ratePublicationTime
    };
    return ratesObject

  }
  catch (ex) {
    console.log(`This is the catch message for getCurrencyRates: ${ex.message}`);
  }
}
// Function to calculate currency conversion.
function calculateCurrencyConversion(rates, inputAmount) {
  const baseRate = rates.baseRate;

  return rates.convertToRate.map(convertTo => {
    let amount = inputAmount * 1 / baseRate * convertTo.rate;
    return Object.assign(convertTo, { amount: amount })
  });
}

async function createConversion(answers) {
  const inputs = currencyLogInput(answers);

  try {
    const rates = await getCurrencyRates(inputs);
    const convertToData = calculateCurrencyConversion(rates, inputs.amount);
    const convertTo = []

    inputs.convertToNames.forEach((object, index) => {
      convertTo.push(Object.assign({}, object, convertToData[index]));
    }, this);

    delete inputs.convertToNames;

    const conversion = new Conversion(Object.assign(
      inputs,
      { convertTo: convertTo },
      { 
        ratePublicationTime: rates.ratePublicationTime,
        rate: rates.baseRate
      }
    ));
    const document = await conversion.save();
    return document
  }
  catch (ex) {
    console.log(`This is the error(s) for createConversion....\n${ex.message}
    THE END`);
  }
}
// Function for retrieving the previous currency conversion.
async function getLastConversion() {
  try {
    const conversion = await Conversion
      .find()
      .sort({ _id: -1 })
      .limit(1);
    return conversion[0]

  }
  catch (ex) {
    console.log(ex.message);
  }
}
// Function for retrieving previoud ten conversions
async function getLastTenConversions() {
  try {
    const conversions = await Conversion
      .find()
      .sort({ _id: -1 })
      .limit(10);
    return conversions;

  } catch (ex) {
    console.log(ex.message);
  }
}
// Function for retrieving the previous ten conversions by currency
async function getTenConversionsByCurrency(currency) {
  const { queryCurrency } = currency

  try {
    const conversions = await Conversion.aggregate([
      { $match: { 'convertTo.name': queryCurrency } },
      {
        $project: {
          _id: 0,
          conversionTime: 1,
          name: 1,
          amount: 1,
          ratePublicationTime: 1,
          rate: 1,
          convertTo: {
            $filter: {
              input: '$convertTo',
              as: 'convertTo',
              cond: { $eq: ['$$convertTo.name', queryCurrency] }
            }
          }
        }
      }
    ])
    return conversions;

  } catch (ex) {
    console.log(`Query Error ${ex.message}`);
  }
}
// Function for retreiving all conversion records.
async function getAllConversionRecords() {
  try {
    const conversions = await Conversion.aggregate([
      { $unwind: "$convertTo" },
      { $project: {
        _id: 0,
        'baseAmount': '$amount',
        'baseName': '$name',
        'baseRate': '$rate',
        'convertToAmount': '$convertTo.amount',
        'convertToName': '$convertTo.name',
        'convertToRate': '$convertTo.rate',
        'convertToIso': '$convertTo.iso',
        'convertToId': '$convertTo._id',
        'conversionTime': '$conversionTime',
        'ratePublicationTime': '$ratePublicationTime',
        'recordId': '$_id',
      }}
    ])
    return conversions;
  }  catch (ex) {
    console.log(`Query Error ${ex.message}`);
  }
}

function closeConnection() {
  db.close();
}
// Export all the modules for currency conversion.
module.exports = {
  createConversion,
  getLastConversion,
  getLastTenConversions,
  getTenConversionsByCurrency,
  getAllConversionRecords,
  closeConnection
};