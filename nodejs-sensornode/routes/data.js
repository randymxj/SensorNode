
/*
 * Data
 */

var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'SensorNode');
var connected = false;

db.on('error', function(err){
	console.error('ERROR - Failed to connect to Mongodb: ', err);
});

db.on('open', function(ref){
	console.log('INFO - Open connection to Mongodb.');
});

db.on('connected', function(ref){
	console.log('INFO - Connected to Mongodb.');
	connected = true;
});

db.on('disconnected', function(ref){
	console.log('INFO - Disconnected from Mongodb.');
	connected = false;
});

exports.gethostinfo = function(req, res){	
	var DataSchema = require('../models/sensordata.js').DataSchema;
	var SensorData = db.model('SensorData', DataSchema);

	var os = require("os"),
    cpus = os.cpus();
	
	SensorData.collection.stats({scale: 1}, function(err, results){
		var data = {"cpu_model": cpus[0].model,
					"cpu_speed": cpus[0].speed,
					"cpu_times_user": cpus[0].times.user,
					"cpu_times_nice": cpus[0].times.nice,
					"cpu_times_sys": cpus[0].times.sys,
					"cpu_times_idle": cpus[0].times.idle,
					"cpu_times_irq": cpus[0].times.irq,
					"sys_uptime": os.uptime(),
					"sys_loadavg1": os.loadavg()[0],
					"sys_loadavg5": os.loadavg()[1],
					"sys_loadavg10": os.loadavg()[2],
					"sys_platform": os.platform(),
					"sys_arch": os.arch(),
					"sys_release": os.release(),
					"mem_free": os.freemem(),
					"mem_total": os.totalmem(),
					"db_count": results.count,
					"db_size": results.size,
					"db_storageSize": results.storageSize,
					"db_totalIndexSize": results.totalIndexSize,
				};
		
		res.send(data);
	});
	
	mongoose.connection.close();
};

exports.getrealtimedata = function(req, res){ 
	res.header("Access-Control-Allow-Origin", "*");

	var DataSchema = require('../models/sensordata.js').DataSchema;
	var SensorData = db.model('SensorData', DataSchema);
	
	
	
	SensorData.find({}).sort('-Time').exec(function(err, results){
		var data = {"Time": results[0].Time,
					"Temperature": results[0].Temperature,
					"Humidity": results[0].Humidity,
					"Pressure": results[0].Pressure,
					"VisibleLight": results[0].VisibleLight,
					"IRLight": results[0].IRLight,
					"UVIndex": results[0].UVIndex,
				};
		
		res.send(data);
    });

	mongoose.connection.close();
};

exports.gethistorydata = function(req, res){
	var DataSchema = require('../models/sensordata.js').DataSchema;
	var SensorData = db.model('SensorData', DataSchema);
	
	// Get parameter
	var step = parseInt(req.query.step);
	var start = parseInt(req.query.start);
	var end = parseInt(req.query.end) * step;

	SensorData.find({}).sort('-Time').skip(start).limit(end).exec(function(err, results){
		var data = [];
		for( i = 0; i < results.length; i++ )
		{
			if( i % step == 0 )
			{
				var obj = {"Time": results[i].Time,
						"Temperature": results[i].Temperature,
						"Humidity": results[i].Humidity,
						"Pressure": results[i].Pressure,
						"VisibleLight": results[i].VisibleLight,
						"IRLight": results[i].IRLight,
						"UVIndex": results[i].UVIndex,
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
