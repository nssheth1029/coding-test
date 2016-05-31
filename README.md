### Coding Exercise
This coding exercise is implemented using NodeJS.

#### Installation

**Note: **Ensure you have the latest version of NodeJS installed on your system. Instructions to install/download NodeJS can be found at: https://nodejs.org

##### For Development / Testing
```
 $ npm install
```
##### For Production
```
$ npm install --production
```
#### Starting REST Server
To start the REST server you need to export 2 enviornment variable which point to the lookup and data files. These location must be specified as absolute locations.
```
export LOOKUP_FILE=<AbsolutefilePath>
export DATA_FILE=<AbsolutefilePath>
node .
```
Server can be accessed using the following URL.
```
http://localhost:8080/v1/data-items/gamma?company_id=124423
```

### Running Test
```
export LOOKUP_FILE=<AbsolutefilePath>
export DATA_FILE=<AbsolutefilePath>
mocha
```
**Note**: If you get an error when executing the **mocha** command then you must install mocha in the global space. Using the following command:
```
sudo npm install -g mocha
```
#### REST API specifications

Please follow the specifications in the following Swagger document:

```text
swagger: '2.0'
info:
  title: Data Item API
  version: "1.0.0"
host: data.calculator.com
schemes:
  - https
basePath: /v1
produces:
  - application/json
paths:
  /data-items/{type}:
    get:
      summary: Get annual results based on data-item type
      parameters:
        - name: type
          in: path
          description: The calculation type (alpha, beta, gamma)
          required: true
          type: string
        - name: company_id
          in: query
          description: Company numeric identifier
          required: true
          type: number
          format: integer
      responses:
        200:
          description: An array of data items
          schema:
            type: array
            items:
              $ref: '#/definitions/DataItem'

definitions:
  DataItem:
    type: object
    properties:
      year:
        type: number
        format: integer
      value:
        type: number
        format: double

```
