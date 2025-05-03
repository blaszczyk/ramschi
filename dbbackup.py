#!/usr/bin/python3
from time import time
import subprocess

timestamp = int(time())

subprocess.run(['mkdir', 'dbdump_%d' % timestamp])

def dump(table):
	global timestamp
	dumpfilename = 'dbdump_%d/%s.csv' % (timestamp, table)
	print('dumping', table, 'into', dumpfilename)
	psql = "\copy ramschi.%s to %s csv header" % (table, dumpfilename)
	subprocess.run(['psql', '-d', 'heizi', '-c', psql])

dump('assignee')
dump('image')
dump('item')
dump('item_assignee')
