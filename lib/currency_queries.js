const currencyChoices = [
  "United States Dollar",
  "Gold Ounce",
  "Bitcoin",
  "Brazilian Real",
  "Euro",
  "Thai Baht",
  "Fijian Dollar",
  "Indian Rupee",
  "Japanese Yen",
  "Moroccan Dirham",
  "Swiss Franc",
  "Russian Ruble",
  "Tanzanian Shilling",
  "Kuwaiti Dinar",
  "United Arab Emirates Dirham",
  "Israeli New Sheqel"
];

const createQuestions = [
  {
    type: "list",
    name: "baseCurrencyName",
    message: "Choose a base currency type to convert from:",
    choices: currencyChoices
  },
  {
    type: "checkbox",
    name: "convertToCurrencyNames",
    message: "Choose the currency types you want to convert to:",
    choices: currencyChoices,
    validate: function (answer) {
      return (answer.length < 1 ? "You must choose a convert-to currency." : true);
    }
  },
  {
    type: "input",
    name: "inputAmount",
    message: "How much do you want to convert?",
    validate: function(value) {
      let valid = /[0-9].*/.test(value);
      return (
        valid ||
        "You need to enter a valid numerical entry"
      );
    }
  }
];

const queryQuestions = [
  {
    type: "list",
    name: "queryCurrency",
    message: "Which convert-to currency do you want conversion records for?",
    choices: currencyChoices
  }
];

const csvQuestions = [
  {
    type: "input",
    name: "fileName",
    message: "Enter a name for your csv-formatted database backup:",
    validate: function (value) {
      let valid = /[a-zA-Z-_0-9]*\.csv/.test(value);
      return valid || "Enter a string ending with the .csv extension; Letters, numbers, underscores, and dashes are allowed";
    },
  },
  {
    type: "input",
    name: "filePath",
    message: "Optional: Enter a file path to save your backup to:",
    default: "."
  },
];
// Export questions module
module.exports = {
  createQuestions: createQuestions,
  queryQuestions: queryQuestions,
  csvQuestions: csvQuestions
};