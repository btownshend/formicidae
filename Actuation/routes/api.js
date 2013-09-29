
exports.sockets = null;

// var client = new osc.Client('127.0.0.1', 3333);
// client.send('/oscAddress', 200);



exports.connectPrinter = function (req, res) {

  //console.log("Sockets: " + JSON.stringify(exports.sockets.getConnections()));
  exports.sockets.emit("print_command", {command : "connect /dev/cu.usbmodemfd121 230400"});
  //exports.sockets.emit("connect", {port : '/dev/cu.usbmodemfd121', baud : '230400'});
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

exports.moveX = function (req, res) {
  //console.log("Sockets: " + JSON.stringify(exports.sockets.getConnections()));
  exports.sockets.emit("print_command", {command : "move X 10 5000"});
  console.log("moveX");

  res.json({
    name: 'MoveX response'
  });
};

exports.printCommand = function (req, res) {
  var command = req.body.command;

  if (command === 'home') {
    command = "home xy";
    console.log("don't go home you dumbass--you're going to kill the speciman");    
  }

  exports.sockets.emit("print_command", {command : command});
  console.log("print command");

  res.json({
    name: 'print command response'
  });

};

// OSC
/*
var osc = require('node-osc');

var client = new osc.Client('127.0.0.1', 7000);

function spoofTargetsOSC() {

  client.send("/vt/set/ntargets", 2);

  setTimeout(function() {
    client.send("/vt/update", 'frame', 'timeElapsed', 5, 0.5, 0.5, 0, 0);
    client.send("/vt/update", 'frame', 'timeElapsed', 2, 0.5, 0.5, 0, 0);
  }, 10);

  setTimeout(spoofTargetsOSC, 1000);
}


setTimeout(spoofTargetsOSC, 1000);
*/ 

var osc = require('node-osc');

var oscServer = new osc.Server(7000, '127.0.0.1');
//var oscServer = new osc.Server(7000, '0.0.0.0');


// oscServer.on("message", function (msg, rinfo) {
//       console.log(msg);
// });

var updates = null;


oscServer.on("/vt/set/ntargets", function (msg, rinfo) {
  if (updates) {
    
    var lowestIndex = -1;
    var lowestId = 1000000;
    for (var i = 0; i < updates.length; i++) {
      if (updates['id'] < lowestId) {
        lowestId = updates['id'];
        lowestIndex = i;
      }
    }
    if (lowestIndex >= 0) {
      handleUpdate(updates[lowestIndex]);
    }
  }
  updates = [];
  console.log("newFrame");
});

oscServer.on("/vt/update", function (msg, rinfo) {
  console.log('update');
  if (!updates) {
    updates = [];
  }
  updates.push({id : msg[3]});

  //console.log(msg[3]);
});

function handleUpdate(update) {

  console.log("handle update: " + update.id)  ;

}