'use strict';

let data = require('../config/config.js').data,
  bluebird = require('bluebird');

function processData(type, companyID) {
  if (data.types.includes(type)) {
    return getDefaultCompanyData(type, companyID);
  }
  else if (type === 'omega') {
      return getOmegaCompanyData(companyID).then(roundResults);
  }
  else if (type === 'gamma') {
    return getGammaCompanyData(companyID).then(roundResults);
  }
  else {
    return Promise.reject(new Error('Unknown Data Item Type: ' + type));
  }
}

function getOmegaCompanyData(companyID) {
  return bluebird.join(getDefaultCompanyData('alpha', companyID), getDefaultCompanyData('beta', companyID), (alpha, beta) => {
    let result = [];
    for (let a of alpha) {
      let b = getMatching(beta, a);
      if (b) {
        let value = a.value * b.value * .5;
        result.push({
          period: a.period,
          value: value
        });
      }
    }
    return result;
  });
}

function getGammaCompanyData(companyID) {
  return bluebird.join(getOmegaCompanyData(companyID), getDefaultCompanyData('alpha', companyID), getDefaultCompanyData('beta', companyID), (omega, alpha, beta) => {
    let result = [];
    for (let o of omega) {
      let a = getMatching(alpha, o);
      let b = getMatching(beta, o);
      if (a && b) {
        let value = o.value * a.value / b.value;
        result.push({
          period: o.period,
          value: value
        });
      }
    }
    return result;
  });
}

function getDefaultCompanyData(type, companyID) {
  return new Promise((resolve, reject) => {
    let result = [];
    let dataTypeRecord = data.lookup.find(f => f.mnemonic === type)
    if (dataTypeRecord) {
      let id = dataTypeRecord.data_item_id;
      let filterData = data.companyData.filter(f => f.data_item_id === id && f.company_id === companyID);
      for (let d of filterData) {
        result.push({
          period: d.fiscal_year,
          value: d.data_item_value
        });
      }
      resolve(result);
    }
    else {
      reject(new Error('Unknown Data Item Type: ' + type));
    }
  });
}

function getMatching(allItems, item) {
  return allItems.find(f => f.period == item.period)
}

function roundResults(result) {
  return new Promise((resolve) => {
    for (let r of result) {
      r.value = Math.round(r.value * 10000) / 10000;
    }
    resolve(result);
  });
}

module.exports = {
  processData: processData
};
