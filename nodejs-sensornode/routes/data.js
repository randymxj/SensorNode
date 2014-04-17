
/*
 * Data
 */

exports.getrealtimedata = function(req, res){	
	var mongoose = require('mongoose');
	var db = mongoose.createConnection('localhost', 'SensorNode');
	var DataSchema = require('../models/sensordata.js').DataSchema;
	var SensorData = db.model('SensorData', DataSchema);
	
	SensorData.find(function(err, results){
		var data = {"time": results[0].time,
				"temperature": results[0].temperature,
				"humidity": results[0].humidity,
				"pressure": results[0].pressure,
				"compass": results[0].compass,
				};
		
		res.send(data);
    });
	
	mongoose.connection.close();
};

exports.gethistorydata = function(req, res){

	var mongoose = require('mongoose');
	var db = mongoose.createConnection('localhost', 'SensorNode');
	var DataSchema = require('../models/sensordata.js').DataSchema;
	var SensorData = db.model('SensorData', DataSchema);
	
	// Get parameter
	var step = parseInt(req.query.step);
	var start = parseInt(req.query.start);
	var end = parseInt(req.query.end) * step;

	//SensorData.find(function(err, results){
	SensorData.find({}).sort('-time').skip(start).limit(end).exec(function(err, results){
		var data = [];
		for( i = 0; i < results.length; i++ )
		{
			if( i % step == 0 )
			{
				var obj = {"time": results[i].time,
					"temperature": results[i].temperature,
					"humidity": results[i].humidity,
					"pressure": results[i].pressure,
					"compass": results[i].compass,
					};
				data.push(obj);
			}
		}
		
		res.send(data);
    });
	
	mongoose.connection.close();
};

function convertToJSONDate(strDate){
    var dt = new Date(strDate);
    var newDate = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds()));
    return '/Date(' + newDate.getTime() + ')/';
}
