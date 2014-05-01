module.exports = function(server){
	var io = require('socket.io').listen(server, { log: false });

	io.sockets.on('connection', function(socket){
		//console.log('llego el socker mijo');

		//socket.on('sendMessage', function(msg){
			//console.log('sendMessage ' + msg);
		//});

		socket.on('disconnect',function(){
			console.log('se fue ');
		});

		socket.on('newComment', function(comment){
			//console.log('Enviar comentario');
			io.sockets.emit('updtComment',comment);
		});

		socket.on('newChatComment', function(comment){
			io.sockets.emit('chatComment', comment);
		});
	});

	
}