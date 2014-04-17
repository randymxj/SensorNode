var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var _SensorData = new Schema({ 
    time: Date,
	temperature: Number,
	humidity: Number,
	pressure: Number,
	compass: Number
});

exports.SensorData = mongoose.model('SensorData', _SensorData);