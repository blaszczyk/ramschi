import http.client
import json

host = 'localhost:8080'

create_item = json.dumps({
	'name': 'foo',
	'description': 'bar',
	'category': 'ELECTRONICS',
	'price': 100
})

json_headers = {'Content-type': 'application/json'}

connection = http.client.HTTPConnection(host)

connection.request('POST', '/api/item', create_item, { 'Content-type': 'application/json' })
item_id = connection.getresponse().read().decode('utf-8')[1:-1]
print('Item created with id', item_id)

connection.request('GET', '/api/item/' + item_id, None, { 'Accept': 'application/json' })
item = connection.getresponse().read().decode('utf-8')
print('Item received', item)

connection.request('GET', '/api/items', None, { 'Accept': 'application/json' })
items = connection.getresponse().read().decode('utf-8')
print('All items received', items[0:80] , '...')

connection.request('GET', '/api/items?category=GARDEN', None, { 'Accept': 'application/json' })
items = connection.getresponse().read().decode('utf-8')
print('GARDEN items received', items[0:80] , '...')

connection.request('GET', '/api/items?filter=fo', None, { 'Accept': 'application/json' })
items = connection.getresponse().read().decode('utf-8')
print('Filtered items received', items[0:80] , '...')

connection.close()
