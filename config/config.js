'use strict';

let fs = require('fs'),
  csv = require('fast-csv'),
  bluebird = require('bluebird');

let data = {
  types: [],
  lookup: null,
  companyData: null
};

function preloadData() {
  if (!process.env.LOOKUP_FILE) {
    console.error("LOOKUP_FILE environment variable not set.");
    process.exit(1);
  }
  if (!process.env.DATA_FILE) {
    console.error("DATA_FILE environment variable not set.");
    process.exit(1);
  }
  return bluebird.join(loadLookupFile(process.env.LOOKUP_FILE), loadDataFile(process.env.DATA_FILE), (lookupData, companyData) => {
    data.lookup = lookupData;
    data.companyData = companyData;
    for (let type of data.lookup) {
      data.types.push(type.mnemonic);
    }
  });
}

function loadLookupFile(filePath) {
  return new Promise((resolve, reject) => {
      fs.readFile(filePath, function(err, result) {
        if (err) {
          console.error("Error Reading the Lookup File.");
          reject(err);
        }
        resolve(JSON.parse(result));
      })
  });
}

function loadDataFile(filePath) {
  return new Promise((resolve, reject) => {
    let companyData = [];
    csv.fromPath(filePath, {delimiter: '\t'}).on("data", data => {
      if (data.length != 5) {
        throw new Error("Incorrect CSV Data Format.");
      }
      try {
        companyData.push({
          company_id: parseInt(data[0]),
          company_name: data[1],
          fiscal_year: parseInt(data[2]),
          data_item_id: data[3],
          data_item_value: parseFloat(data[4])
        });
      }
      catch (e) {
        reject(e);
      }
    }).on("end", () => {
      resolve(companyData);
    }).on("error", err => {
      reject(err);
    })
  });
}

module.exports = {
  preloadData: preloadData,
  data: data
}
