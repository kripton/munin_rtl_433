#!/usr/bin/env node

var btoa = require('btoa');
var http = require('http');

var port = process.env.PORT || 3005;
var host = process.env.HOST || '127.0.0.1';
var sensorMapString = process.env.SENSORMAPPING || '{}';

if (sensorMapString === '{}') {
  console.error('You need to give a sensor name mapping in the environment variable SENSORMAPPING. Example: {"inFactory_sensor_id_128":"MySensor","HIDEKI_TS04_sensor_rc_2":"OtherSensor"}');
  process.exit(1);
}

try {
  var sensorMap = JSON.parse(sensorMapString);
} catch (exception) {
  console.error('Failed to parse SENSORMAPPING: ' + exception);
  process.exit(1);
}

var type = '';
if (process.argv[1].indexOf('temperature') != -1) {
  type = 'temperature';
}
if (process.argv[1].indexOf('humidity') != -1) {
  type = 'humidity';
}
if (type === '') {
  console.error('Unknown or unsupported type. Please include either "temperature" or "humidity" in the script\'s name');
  process.exit(1);
}

// Fetch the JSON-data from the accumulating server
http.get('http://' + host + ':' + port + '/', function(response) {
  var body = '';
  response.on('data', function(d) {
    body += d;
  });
  response.on('end', function() {
    var parsed = JSON.parse(body);
    var sensorStates = JSON.parse(body);

    if (process.argv[2] == "config") {
      console.log('graph_title rtl_443 ' + type + '\ngraph_category sensors\ngraph_vlabel ' + type);
    }

    var sensorId;
    for (sensorId in sensorMap) {
      if (sensorMap.hasOwnProperty(sensorId)) {
        var sensorName = sensorMap[sensorId];
        var sensorObj = sensorStates[sensorId];
        var fieldName = btoa(sensorName).replace(/=/g, '');

        //console.log('sensorId: ' + sensorId + ' sensorName: ' + sensorName + ' sensorObj: ', sensorObj);

        if (sensorName && sensorObj && type === 'temperature' && sensorObj.temperature_C) {
          if (process.argv[2] == "config") {
            console.log(fieldName + '.label ' + sensorName);
          } else {
            console.log(fieldName + '.value ' + sensorObj.temperature_C);
          }
        }
        if (sensorName && sensorObj && type === 'temperature' && sensorObj.temperature_F) {
          if (process.argv[2] == "config") {
            console.log(fieldName + '.label ' + sensorName);
          } else {
            console.log(fieldName + '.value ' + sensorObj.temperature_F);
          }
        }
        if (sensorName && sensorObj && type === 'humidity' && sensorObj.humidity) {
          if (process.argv[2] == "config") {
            console.log(fieldName + '.label ' + sensorName);
          } else {
            console.log(fieldName + '.value ' + sensorObj.humidity);
          }
        }
      }
    }

  });
});
