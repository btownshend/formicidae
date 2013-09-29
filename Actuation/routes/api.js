
// var io = require('socket.io').listen(8000);

// io.sockets.on('connection', function (socket) {
  
//   socket.emit('news', { hello: 'world' });
  

//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });
exports.sockets = null;

exports.connectPrinter = function (req, res) {

  //console.log("Sockets: " + JSON.stringify(exports.sockets.getConnections()));
  exports.sockets.emit("aaa_response", {message : "this is the test message"});
  console.log("connect the printer");


  // var fork = require('child_process').fork,
  //   pronsole = fork( "python", ["../../Libraries/Printrun/pronsole.py"]);

  //   pronsole.send("help");

  // pronsole.stdout.on('data', function (data) {
  //   console.log(data);
  //   // var buff = new Buffer(data);
  //   // var dataString = buff.toString('utf8');
  //   // console.log(dataString);
  // });

  // pronsole.stderr.on('data', function (data) {
  //   console.log('stdout: ' + data);
  // });

  // pronsole.on('exit', function (code) {
  //   console.log("child exited");
  // });

  res.json({
    name: 'Connect Printer response'
  });
};

