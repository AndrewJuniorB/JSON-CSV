//======================================================
//Build your Express here
//======================================================
//import expess from 'express'
var express = require('express');
//import bodyParser from 'body-parser'
var bodyParser = require('body-parser');
var fs = require('fs');

var PORT = process.env.PORT ?? 3000;
var app = express();

app.use(express.static('client'));
// parse application/json
app.use(bodyParser.json());
//Contain key-value pairs, where the value can be a string or array (when extended is false)
app.use(bodyParser.urlencoded({ extended: false }));


// app.set('views', './client');
// app.set('view engine', 'pug');


//======================================================
//CSV GENERATOR FUNC
//======================================================
var csvGenerator = function (parsedSample, values, keysObj) {
  var resultCSV = '';
  //console.log('jsonSample', jsonSample)
  //return as Object file (If limit is 0, [] is returned.)
  //var jsonKeys = Object.keys(parsedSample);
  //console.log("JSON KEYS", jsonKeys)
  // var titles = jsonKeys.join(',') + '\n';

  for (key in parsedSample) {

    if (!keysObj[key] && (key !== 'children')) {
      keysObj[key] = key;
    }

    if (key !== 'children') {
      values.push(parsedSample[key]);
    } else {
      resultCSV = values.join() + '\n';
      // FOR CHILDREN ARRAY
      for (var i = 0; i < parsedSample[key].length; i++) {
        resultCSV += csvGenerator(parsedSample[key][i], [], keysObj);
      }
    }
    console.log("VALUES", values);
  }
  //IF empty values besides titles
  if (resultCSV === '') {
    resultCSV = values.join() + '\n';
  }
  return resultCSV;
};


//======================================================
//POST
//======================================================
app.post('/', (req, res) => {
  //console.log("POST express ===========")
  var data = JSON.parse(req.body.dataURL.split(';')[0]);
  var titles = {};
  // var titles = Object.keys(data).join();
  //console.log("REQ =>", req )
  // console.log("DATA =>", data )

  var resultCSV = csvGenerator(data, [], titles);
  //console.log("RESULT CSV =>", resultCSV);
  var csv = Object.keys(titles).join() + '\n' + resultCSV;
  // console.log("CSV =>", csv )
  //console.log("SPLITTED =>", resultCSV.split('\n'))
  // var splitted = csv.split('\n');
  // res.render('index_1', {csv: resultCSV});
  //fs.writeFile(file, data[, options], callback)
  fs.writeFile('csv_report.csv', csv, (err) => {
    if (err) throw err;
    console.log('====================================================== \n', csv)
    console.log('====================================================== \n');
    console.log('CSV FILE GENEREATED');
  })
  res.send(`<p>${csv.split('\n').join('<br>')}</p>`);
});

app.get('/download_json', (req, res) => {
  res.download('./csv_report.csv');
});

app.listen(3000, function () {
  console.log(`Server listen on ${PORT} port...`)
});