// Required variables and dependencies
const Json2csvParser              = require("json2csv").Parser;
const fs                          = require("fs");
const { getAllConversionRecords } = require("./conversions");
const { success }                 = require("../views/csv");

function organizeContent(conversions) {
  // create a new header object and iterate over all the currencies for conversion in the array.
  const headers = Object.keys(conversions[0]);
  const jsonParser = new Json2csvParser({ headers })
  // jsonParser automatically converts String to a number/integer.
  return(jsonParser.parse(conversions));
}
// The async function declaration defines an asynchronous function, which returns an AsyncFunction object.
async function generateCsvBackup(fileInfo) {
  const { fileName, filePath } = fileInfo;
  const filePathString         = `${filePath}/${fileName}`;
  // An async function can contain an await expression that pauses the execution of the async function and waits for the passed Promise's resolution, and then resumes the async function's execution and returns the resolved value.
  // Here 'try' statement is executed for getting all the currency conversion records.
  try {
    const conversions = await getAllConversionRecords();
    const csv         = organizeContent(conversions);
    // Appends csv file to the given path. 
    fs.appendFile(filePathString, csv, err => {
      // Logs error
      if (err) throw err;
      success(fileName, __dirname, __filename);
    });
    // Statements are executed if an exception is thrown in the try block.
  } catch (ex) {
    console.log(ex.message);
  }
}
// Export the CSV conversion model.
module.exports = { generateCsvBackup }