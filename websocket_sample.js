
function CallEvent(){
    var server;
}
var evm = require("events").EventEmitter;
CallEvent.prototype = new evm();
CallEvent.prototype.call = function(){
    this.emit("callEvent");
};

var ev = new CallEvent();

var ws = require("websocket.io");
var server = ws.listen(8888,
  function () {
    console.log("ws start");
  }
);

var sessionArray = new Array();

ev.server = server;

server.on("connection",
  function(socket) {

	      socket.ssid = Math.random(10);
	      var sid = socket.ssid;
	      console.log(sid);
	      sessionArray.push(sid);

	      ev.on("callEvent", function(){

		      var sv = this.server;

		      for(i in sessionArray){
			  console.log(sessionArray[i]);
		      }

		      console.log("event call!!!!");
		      //console.log(sv);
		      data ="http://172.20.10.5:3000/portal";
		      sv.clients.forEach(
			        function(client) {
				      console.log("client sid:" + client.ssid);
				       client.send(data);
				}
		      );

		  });

    socket.on("message",
      function(data) {

		var sid = socket.ssid;
		console.log("socket id = " + sid);
		socket.send("res:" + sid);

        console.log("message " + data);

     }
    );
  }
);




var http = require('http');

server = http.createServer();
server.on('request', function(req, res) {

	ev.call();

	setTimeout(function() {
		res.setHeader('Content-Type', 'text/plain');
		res.writeHead(200);
		res.write('200 - OK.');

		res.end();
	    },  1000);

    });

server.listen(4000, function() {
	console.log('start listening on port 4000...');
    });