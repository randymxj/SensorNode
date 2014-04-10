#!/usr/bin/python

import sys
sys.path.append('/home/ubuntu/Adafruit-Raspberry-Pi-Python-Code/Adafruit_BMP085/')
sys.path.append('/home/ubuntu/Adafruit-Raspberry-Pi-Python-Code/Adafruit_HMC6352/')
sys.path.append('/home/ubuntu/Adafruit-Raspberry-Pi-Python-Code/Adafruit_HTU21D/')
#sys.path.append('/home/ubuntu/Adafruit-Raspberry-Pi-Python-Code/Adafruit_LEDBackpack/')
sys.path.append('/home/ubuntu/Adafruit-Raspberry-Pi-Python-Code/Adafruit_MPU6050/')

import time

from Adafruit_BMP085 import BMP085
from Adafruit_HMC6352 import HMC6352
from Adafruit_HTU21D import HTU21D
#from Adafruit_8x8 import EightByEight
#from Adafruit_MPU6050 import MPU6050

VERSION_MAJOR = 0
VERSION_MINOR = 1

sensorBMP085 = BMP085(0x77)
sensorHMC6352 = HMC6352()
sensorHTU21D = HTU21D()
#sensorMPU6050 = MPU6050()
#LEDGrid = EightByEight(address=0x70)

def readTemperature():
	t1 = sensorHTU21D.readTemperatureData()
	t2 = sensorBMP085.readTemperature()
	return t1, t2

def readHumidity():
	h = sensorHTU21D.readHumidityData()
	return h
	
def readPressure():
	p = sensorBMP085.readPressure()
	return p
	
def readAltitude():
	a = sensorBMP085.readAltitude()
	return a

def readCompass():
	c = sensorHMC6352.readData()
	return c

#def readAccelGyro():
#	x_accel, y_accel, z_accel, x_gyro, y_gyro, z_gyro = sensorMPU6050.readMPU6050()
#	return x_accel, y_accel, z_accel, x_gyro, y_gyro, z_gyro
	