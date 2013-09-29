import sys
from socketIO_client import SocketIO
import time

def on_aaa_response(*args):
 	#print 'on_aaa_response', args
 	print "help"
 	sys.stdout.flush()

socketIO = SocketIO('localhost', 3000)
socketIO.on('aaa_response', on_aaa_response)
#socketIO.emit('aaa')
#socketIO.wait(seconds=1)



while 1:
	pass
	#time.sleep(0.1)