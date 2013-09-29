
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


exports.printCommand = function (req, res) {
  var command = req.body.command;

  if (command === 'home') {
    command = "home xy";
    console.log("don't go home you dumbass--you're going to kill the speciman");    

  } else if (command.length > 7 && command.substring(0,7) == 'connect') {
    
    console.log('received connect command');


    setTimeout(function() {
      console.log("sending 'home xy' command");
      sendCommand('home xy');

      setTimeout(function() {
        connected = true;
        console.log("connected!!");
      }, 5000);

    }, 2000);
  }

  sendCommand(command);

  res.json({
    name: 'print command response'
  });

};

function sendCommand(command) {
  exports.sockets.emit("print_command", {command : command});
}

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

var updates = null;

oscServer.on("/vt/set/ntargets", function (msg, rinfo) {
  if (updates) {
    
    var lowestIndex = -1;
    var lowestId = 1000000;    
    for (var i = 0; i < updates.length; i++) {
      console.log('update id: ' + updates[i]['id']);
      if (updates[i]['id'] < lowestId) {                
        lowestId = updates['id'];
        lowestIndex = i;
      }
    }
    if (lowestIndex >= 0) {
      handleUpdate(updates[lowestIndex]);
    }
  }
  updates = [];
});

oscServer.on("/vt/update", function (msg, rinfo) {

  if (!updates) {
    updates = [];
  }
  updates.push({
    frame : msg[1],
    time : msg[2],
    id : msg[3],
    x : msg[4],
    y : msg[5],
    vx : msg[6],
    vy : msg[7]});
});


var connected = false;

var desiredX = 0.5;
var desiredY = 0.5;

var maxX = 400;
var maxY = 400;

var currX = 0;
var currY = 0;


function handleUpdate(update) {

  console.log("handle update: " + update.id)  ;

}