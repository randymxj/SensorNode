#!/usr/bin/python

import time
import traceback
import pymongo
import datetime

import sys
sys.path.append('/home/randymxj/OpenPythonSensor/lib_bmp180/')
sys.path.append('/home/randymxj/OpenPythonSensor/lib_htu21d/')
sys.path.append('/home/randymxj/OpenPythonSensor/lib_si1145/')

from lib_bmp180 import BMP180
from lib_htu21d import HTU21D
from lib_si1145 import SI1145

try:
	# Initialize Sensors
	bmp = BMP180()
	htu = HTU21D()
	si = SI1145()
	
	# Initialize DB
	conn = pymongo.Connection('localhost', 27017)
	db = conn.SensorNode
	data = db.sensordatas
		
	while True:	
		temp1 = round(bmp.readTemperatureData(), 2)
		pre = round(bmp.readPressureData(temp1, 3), 2)
		
		temp2 = round(htu.readTemperatureData(), 2)
		rh = round(htu.readHumidityData(), 2)
		
		uvindex = round(float(si.readUVIndex())/100, 2)
		visibleLevel = si.readAmbientLight()
		IRLevel = si.readIRLight()

		#print "Temperature: %.2f / %.2f C, Humidity: %.2f %%, Barometric Pressure: %.2f hPa, UVIndex: %.2f" % (temp1, temp2, rh, pre, uvindex)
		
		# Write to DB
		value = {"Time": datetime.datetime.utcnow(),
			"Temperature": temp1,
			"Humidity": rh,
			"Pressure": pre,
			"VisibleLight": visibleLevel,
			"IRLight": IRLevel,
			"UVIndex": uvindex}
		
		data.insert(value)
		
		# Maintain DB Size
		count = data.find().count()
		if count > 5000:
			iter = data.find().sort('_id', pymongo.DESCENDING).limit(count - 5000)
			for item in iter:
				data.remove({"_id":item['_id']})

		time.sleep(600)
	
except Exception, e:
	exstr = traceback.format_exc()
	print exstr
	print 'Quit'
	conn.close()
	exit()
	