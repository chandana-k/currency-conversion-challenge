#!/usr/bin/env node

// Required dependencies and packages
const { version } = require("./package");
const program  = require('commander');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();

const {
  createQuestions,
  queryQuestions,
  csvQuestions
} = require("./lib/currency_queries");

const {
  createConversion,
  getLastConversion,
  getLastTenConversions,
  getTenConversionsByCurrency,
  closeConnection
} = require("./js/currency_conversions");

const { prettyPrintConversion }    = require("./views/currency_details_format");
const { prettyPrintRecordsInList } = require("./views/currency_list_format");
const { generateCsvBackup }        = require("./js/csv_handler");
// (Commander.js)A command's options are validated when the command is used. Any unknown options will be reported as an error. However, if an action-based command does not define an action, then the options are not validated.
program.version(version);

function printSingle(result, newRecordStatus) {
  prettyPrintConversion(result, newRecordStatus);
  closeConnection();
}

function printBulk(records) {
  prettyPrintRecordsInList(records);
  closeConnection();
}

function completeCSV(){
  closeConnection();
}

program
  .command('convert')
  .description('Prompts user to submit currency types and a value to convert')
  .action(() => {
    prompt(createQuestions).then(answers => {
      let output = new Promise((resolve, reject) => {
        resolve(createConversion(answers));
        reject(new Error("The conversion failed to process"));
      });
      output
        .then(result => printSingle(result, true))
        .catch(err => console.log("Error", err.message));
    });
  });

program
  .command('last-one')
  .description('Retrieves a record of the last conversion')
  .action(() => {
    let record = new Promise((res,rej) => {
      res(getLastConversion());
      rej(new Error("The last conversion was not retrieved"));
    })
    record
      .then(result => printSingle(result, false))
      .catch(err => console.log("Error", err.message));
  });

program
  .command('last-ten')
  .description("Retrieves up to 10 of the most recent conversions")
  .action(() => {
    let records = new Promise((res, rej) => {
      res(getLastTenConversions());
      rej(new Error("The conversion records were not retrieved"));
    });
    records
      .then(result => printBulk(result))
      .catch(err => console.log("Error", err.message));
  });

program
  .command("query-currency")
  .description("Returns up to 10 records for a selected converted-to currency")
  .action(() => {
    prompt(queryQuestions).then(answer => {
      let records = new Promise((res, rej) => {
        res(getTenConversionsByCurrency(answer));
        rej(new Error("The conversion records were not retrieved"));
      })
      records
        .then(result => printBulk(result))
        .catch(err => console.log("Error", err.message));
    });
  });

program
  .command("csv-export")
  .description("Allows ALL historical conversions to be exported to a .csv file")
  .action(() => {
    prompt(csvQuestions).then(answers => {
      let csv = new Promise((res,rej) => {
        res(generateCsvBackup(answers));
        rej(new Error("The CSV backup failed."));
      })
      csv
        .then(result => completeCSV())
        .catch(err => console.log("Error", err.message));
    });
  });

program.parse(process.argv);