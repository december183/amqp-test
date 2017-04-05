var amqp = require('amqp');
var fs = require('fs');
var opts = {
	host: '114.215.194.79',
	login: 'kx_user',
	password: 'kx123456',
	vhost: 'kx'
};
var options = {
	type: 'topic',

};
var exchange = 'topic_info';
var routing = 'news.info';
var connection = amqp.createConnection(opts);
connection.on('error', function(e) {
	console.log("Error from amqp: ", e);
});

connection.on('ready', function() {
	var q = connection.queue('my-queue', function(queue) {
		console.log('Queue ' + queue.name + ' is open');
		// catch messages
		queue.bind(exchange, routing);
		// receive messages
		queue.subscribe(function(message) {
			// print message to stdout
			// console.log(message);
			var messageStr = message.data.toString('utf-8');
			var messageObj = JSON.parse(messageStr);
			var file = '/root/node/lesson/amqp/logs/' + messageObj.time.substr(0,10) + '.txt';
			console.log(messageObj);
			fs.appendFile(file, messageStr + '\r\n', function(err) {
				if(err) throw err;
				console.log('The message was append to ' + file);
			});
		});
	});
	var exc = connection.exchange('my-exchange', options = {type: 'topic'}, function(exchange) {
		console.log('Exchange ' + exchange.name + ' is open');
	});
});