
/*
 * Data
 */

exports.getrealtimedata = function(req, res){
	var mysql = require('mysql');
	var database = 'sensornode';
	var table = 'sensordata';
	var client = mysql.createConnection({  
		host : '192.168.1.100',  
		user : 'sensornode',  
		password : '6fAKNHnfndWB54mz'
	});

	client.query('USE ' + database);

	var query = client.query('SELECT * FROM sensordata ORDER BY sensordata.id DESC LIMIT ?, ?', [0, 1], function(err, results){
		var data = {"time": results[0].time,
				"temperature": results[0].temperature,
				"humidity": results[0].humidity,
				"pressure": results[0].pressure,
				"compass": results[0].compass,
				};
		
		client.end();
		
		res.send(data);
	});
};

exports.gethistorydata = function(req, res){
	var mysql = require('mysql');
	var database = 'sensornode';
	var table = 'sensordata';
	var client = mysql.createConnection({  
		host : '192.168.1.100',  
		user : 'sensornode',  
		password : '6fAKNHnfndWB54mz'
	});

	client.query('USE ' + database);

	var query = client.query('SELECT * FROM sensordata ORDER BY sensordata.id DESC LIMIT ?, ?', [0, 25], function(err, results){
		var data = [];
		for( i = 0; i < results.length; i++ )
		{
			var obj = {"time": results[i].time,
				"temperature": results[i].temperature,
				"humidity": results[i].humidity,
				"pressure": results[i].pressure,
				"compass": results[i].compass,
				};
			data.push(obj);
		}
		
		client.end();
		
		res.send(data);
	});
};

function convertToJSONDate(strDate){
    var dt = new Date(strDate);
    var newDate = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds()));
    return '/Date(' + newDate.getTime() + ')/';
}
