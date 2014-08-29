var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var _SensorData = new Schema({ 
    Time: Date,
	Temperature: Number,
	Humidity: Number,
	Pressure: Number,
	VisibleLight: Number,
	IRLight: Number,
	UVIndex: Number
});

exports.SensorData = mongoose.model('SensorData', _SensorData);