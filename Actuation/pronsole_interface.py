import sys
from socketIO_client import SocketIO
import time

def print_command(*args):
	print args[0]['command']
	sys.stdout.flush()


socketIO = SocketIO('localhost', 3000)


socketIO.on('print_command', print_command)

#socketIO.emit('aaa')
#socketIO.wait(seconds=1)

while 1:
	time.sleep(0.01)
	pass