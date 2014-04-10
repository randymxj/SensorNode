#!/usr/bin/python

import SensorGlobal

import SocketServer
import threading
import traceback
import errno

# ===========================================================================
# MyRequestHandler Class
# ===========================================================================

class MyRequestHandler(SocketServer.BaseRequestHandler): 
	def handle(self): 
		print '@ Sensor Node Client connected from: ', self.client_address 
		while True:
			try:
				hexString = self.request.recv(1024)
				bytes = bytearray(int(x.encode('hex'), 16) for x in hexString)
				print '@ Receive data (%r): %s' % (self.client_address, self.byteArrayToHexString(bytes))	
				self.dataProcess(bytes)
				
			except IOError as e:
				if e.errno == errno.ECONNRESET:
					print '# Exception: TCP/IP Client disconncted'
				else:
					print '# Exception: IOError'
				break
				
			except Exception, e:
				print '# Exception on TCP handler'
				print e
				print traceback.format_exc()
				break
	
	def byteArrayToHexString(self, ba):
		'This function convert the byteArray to HEX string for display'
		str = "".join("0x%x, " % b for b in ba)
		return str
	
	def sendData(self, data):
		'This function sends a byteArray to the TCP/IP Client'
		print '@ Send data (%r): %s' % (self.client_address, self.byteArrayToHexString(data))
		self.request.sendto(data, self.client_address)
		
	def dataProcess(self, data):
		'This function process the recv data buffer'
		bufferSize = len(data)
		if bufferSize < 7:
			# Return if buffer is not competion
			return
			
		payloadSize = data[5] * 255 + data[6]
		print '@ Payload size: ' + str(payloadSize) + ', Buffer size: ' + str(bufferSize)
		if bufferSize - 7 < payloadSize:
			# Return if payload size is not match with command
			return
		
		if data[0] == 0x00:
			# TCP/IP connection test, send the test packet back to client
			print '@ OPCODE 0x00: TCP/IP connection test'
			self.sendData(data)
			
		elif data[0] == 0x25:
			print '@ OPCODE 0x25: Network Authentication'
			sendBuffer = bytearray([0x25, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x7F])
			self.sendData(sendBuffer)
			
		elif data[0] == 0x40:
			print '@ OPCODE 0x40: Request temperature data'
			t = int(SensorGlobal.readTemperature() * 100)
			t1 = t / 256
			t0 = t % 256
			sendBuffer = bytearray([0x40, 0x00, 0x00, 0x00, 0x00, 0x00, 0x04, 0x00, 0x77, t1, t0])
			self.sendData(sendBuffer)
		
		elif data[0] == 0x41:
			print '@ OPCODE 0x41: Request humidity data'
			rh = int(SensorGlobal.readHumidity() * 100)
			rh1 = rh / 256
			rh0 = rh % 256
			sendBuffer = bytearray([0x41, 0x00, 0x00, 0x00, 0x00, 0x00, 0x04, 0x00, 0x77, rh1, rh0])
			self.sendData(sendBuffer)
		
		elif data[0] == 0x42:
			print '@ OPCODE 0x42: Request pressure data'
			p = int(SensorGlobal.readPressure())
			p3 = 0
			p2 = p / 65536
			p1 = ( p % 65536 ) / 256
			p0 = ( p % 65536 ) % 256
			sendBuffer = bytearray([0x42, 0x00, 0x00, 0x00, 0x00, 0x00, 0x06, 0x00, 0x77, p3, p2, p1, p0])
			self.sendData(sendBuffer)
		
		elif data[0] == 0x45:
			print '@ OPCODE 0x45: Request altitude data'
			a = int(SensorGlobal.readAltitude() * 100)
			a3 = 0
			a2 = a / 65536
			a1 = ( a % 65536 ) / 256
			a0 = ( a % 65536 ) % 256
			sendBuffer = bytearray([0x45, 0x00, 0x00, 0x00, 0x00, 0x00, 0x06, 0x00, 0x77, a3, a2, a1, a0])
			self.sendData(sendBuffer)
			
		elif data[0] == 0x46:
			print '@ OPCODE 0x46: Request magnetic compass data'
			c = int(SensorGlobal.readCompass() * 100)
			c1 = c / 256
			c0 = c % 256
			sendBuffer = bytearray([0x46, 0x00, 0x00, 0x00, 0x00, 0x00, 0x04, 0x00, 0x77, c1, c0])
			self.sendData(sendBuffer)
			
		else:
			print '@ OPCODE is not valid'
			
		# Recursion to process the remaining packet if there is any
		data = data[payloadSize + 7:]
		self.dataProcess(data)
			
# ===========================================================================
# SensorServer Class
# ===========================================================================

class SensorServer(threading.Thread):
	# TCP Interface setting
	port = 5913
	tcpServer = None
	
	# Constructor
	def __init__(self):
		print 'Initialize the Sensor Server'
		threading.Thread.__init__(self)
	
	def run(self):
		print 'Start TCP listening on the port ' + str(self.port)
		self.tcpServer = SocketServer.ThreadingTCPServer(('', self.port), MyRequestHandler)
		self.tcpServer.serve_forever()
	
	def stop(self):
		print 'Stop the server thread'
		self.tcpServer.shutdown()
		