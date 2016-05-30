let request = require('superagent'),
  should = require('should'),
  server = require('../server'),
  assert = require('assert'),
  fs = require('fs'),
  expect = require('expect');

describe('Request Testing', () => {
  let baseURL = 'http://localhost:8080';

  describe('Not Found Request Testing', () => {
    it('should return a 404 (Not Found) with no context', done => {
      request.get(baseURL).end((err, res) => {
        res.should.have.property('status', 404);
        done();
      })
    });

    it('should return a 404 (Not Found) when a wrong type is specified', done => {
      request.get(baseURL + '/v1/data-items/test?company_id=1').end((err, res) => {
        res.should.have.property('status', 404);
        done();
      });
    });
  });

  describe('Bad Request Testing', () => {
    it('should return a 400 (Bad Request) when the company_id is not specified', done => {
      request.get(baseURL + '/v1/data-items/alpha').end((err, res) => {
          res.should.have.property('status', 400);
          done();
      });
    });



    it('should return a 200 (OK) when a invalid company is specified with empty results', done => {
      request.get(baseURL + '/v1/data-items/alpha?company_id=1').end((err, res) => {
        res.should.have.property('status', 200);
        res.should.have.property('type', 'application/json');
        let result = JSON.parse(res.text);
        result.length.should.be.equal(0);
        done();
      });
    });

    it('should return a 200 (OK) with some result', done => {
      request.get(baseURL + '/v1/data-items/alpha?company_id=124423').end((err, res) => {
        res.should.have.property('status', 200);
        let result = JSON.parse(res.text);
        result.length.should.be.above(0);
        done();
      });
    });
  });

  describe('Valid Given Data', () => {
    it('should validate against known alpha data for company', done => {
      validateResultsAgainstDataFile(baseURL + '/v1/data-items/alpha?company_id=124423', __dirname + '/../assertions/alpha.json', done);
    });

    it('should validate against known beta data for company', done => {
      validateResultsAgainstDataFile(baseURL + '/v1/data-items/beta?company_id=124423', __dirname + '/../assertions/beta.json', done);
    });

    it('should validate against known omega data for company', done => {
      validateResultsAgainstDataFile(baseURL + '/v1/data-items/omega?company_id=124423', __dirname + '/../assertions/omega.json', done);
    });

    it('should validate against known gamma data for company', done => {
      validateResultsAgainstDataFile(baseURL + '/v1/data-items/gamma?company_id=124423', __dirname + '/../assertions/gama.json', done);
    });
  });
});

function validateResultsAgainstDataFile(url, dataFilePath, callback) {
  request.get(url).end((err, res) => {
    res.should.have.property('status', 200);
    res.should.have.property('type', 'application/json');
    let result = JSON.parse(res.text);
    fs.readFile(dataFilePath, function(readError, fileData) {
      if (readError) {
        console.log("Error Reading the Data File.");
      }
      let fileResult = JSON.parse(fileData);
      result.should.containDeep(fileResult);
      callback();
    });
  });

}
