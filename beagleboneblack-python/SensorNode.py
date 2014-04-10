#!/usr/bin/python

import SensorGlobal
import MySQLdb
import time
import traceback

from SensorServer import SensorServer

try:
	conn = MySQLdb.connect(host='192.168.1.100',user='sensornode',passwd='6fAKNHnfndWB54mz',port=3306)
	cur = conn.cursor()
     
	conn.select_db('sensornode')
		
	while True:
			
		temp1, temp2 = SensorGlobal.readTemperature()
		temp1 = round(temp1, 2)
		temp2 = round(temp2, 2)
		rh = round(SensorGlobal.readHumidity(), 2)
		pre = round(SensorGlobal.readPressure()/100.0, 2)
		cps = round(SensorGlobal.readCompass(), 2)
		
		#print "Temperature: %.2f/%.2f C, Humidity: %.2f %%, Barometric Pressure: %.2f hPa, Magnetic compass: %.2f" % (temp1, temp2, rh, pre, cps)
		
		value = [time.strftime('%Y-%m-%d %H:%M:%S'), temp1, rh, pre, cps]	
		cur.execute("INSERT INTO sensordata (time, temperature, humidity, pressure, compass) VALUES (%s, %s, %s, %s, %s)", value)
		
		conn.commit()
				
		time.sleep(600)
 
	cur.close()
	conn.close()
 
except MySQLdb.Error, e:
	print "Mysql Error %d: %s" % (e.args[0], e.args[1])
	
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
