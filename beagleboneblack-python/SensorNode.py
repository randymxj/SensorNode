#!/usr/bin/python

import SensorGlobal
import time
import traceback
import pymongo
import datetime

from SensorServer import SensorServer

try:
	conn = pymongo.Connection('localhost', 27017)
	db = conn.SensorNode
	data = db.sensordatas
		
	while True:
			
		temp1, temp2 = SensorGlobal.readTemperature()
		temp1 = round(temp1, 2)
		temp2 = round(temp2, 2)
		rh = round(SensorGlobal.readHumidity(), 2)
		pre = round(SensorGlobal.readPressure()/100.0, 2)
		cps = round(SensorGlobal.readCompass(), 2)
		
		#print "Temperature: %.2f/%.2f C, Humidity: %.2f %%, Barometric Pressure: %.2f hPa, Magnetic compass: %.2f" % (temp1, temp2, rh, pre, cps)
		
		value = {"time":datetime.datetime.utcnow(),
			"temperature":temp1,
			"humidity":rh,
			"pressure":pre,
			"compass":cps}
		
		data.insert(value)
				
		time.sleep(600)
	
except Exception, e:
	exstr = traceback.format_exc()
	print exstr
	print 'Quit'
	cur.close()
	conn.close()
	exit()
			
# Initilize the objects - TCP Server
'''
myServer = SensorServer()
myServer.start()

print 'Something later'

while True:
	try:
		time.sleep(1)
	except KeyboardInterrupt:
		print 'Keyboard Interrupt'
		myServer.stop()
		break;
'''
