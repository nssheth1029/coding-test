'use strict';

let express = require('express'),
  data = require("../config/config.js").data,
  processor = require('./processor');

function start() {
  let app = express();

  app.get('/v1/data-items/:type', (req, res) => {
    if (!req.query.company_id) {
      res.status(400).send("Company ID not included as query parameter (ie: company_id)")
    }
    processor.processData(req.params.type, parseInt(req.query.company_id)).then(result => {
      res.contentType('application/json').send(result);
    }, err => {
      res.status(404).send(err.message);
    });
  })

  app.listen(8080, () => {
    console.log("Server listening on port 8080");
  });
}

module.exports = {
  start: start
};
