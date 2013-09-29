
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
        // reset our dead reckoning positions and update 'connected' to true
        currX = 0;
        currY = 0;
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

var TRACKING_MODE_MANUAL = 0;
var TRACKING_MODE_FOLLOW = 1;

var trackingMode = 0; 

exports.setTrackingMode = function(req, res) {
  var desiredMode = req.body.mode;


  trackingMode = desiredMode;

  console.log("tracking mode is: " + trackingMode);

}

function sendCommand(command) {
  exports.sockets.emit("print_command", {command : command});
  lastCommandTime = new Date().getTime();
}


var osc = require('node-osc');
var oscServer = new osc.Server(7000, '127.0.0.1');
//var oscServer = new osc.Server(7000, '0.0.0.0');

var updates = null;

oscServer.on("/vt/set/ntargets", function (msg, rinfo) {
  if (updates) {
    
    var lowestIndex = -1;
    var lowestId = 1000000;    
    for (var i = 0; i < updates.length; i++) {      
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

var desiredX = 0;
var desiredY = 0;
var currX = 0;
var currY = 0;
var bedSizeX = 260;
var bedSizeY = 230;
var stepSize = 5;
var lastCommandTime = 0;

function handleUpdate(update) {

  if (trackingMode == TRACKING_MODE_FOLLOW) {
    handleTrackingModeFollowUpdate(update);
  }

}

function handleTrackingModeFollowUpdate(update) {
  if (connected && new Date().getTime() - lastCommandTime > 1000) {
    desiredX = update.x * bedSizeX;
    desiredY = update.y * bedSizeY;

    var diffX = desiredX - currX;
    var diffY = desiredY - currY;

    var directionX = 1;
    var directionY = 1;

    if (diffX < 0) {
      directionX = -1;
    }
    if (diffY < 0) {
      directionY = -1;
    }

    var moveAmountX = stepSize * directionX;
    var moveAmountY = stepSize * directionY;

    if (Math.abs(desiredX - currX + moveAmountX) > stepSize) { // make sure we need to move at all
      if (currX + moveAmountX >= 0 && currX + moveAmountX <= bedSizeX) { // make sure we won't go outside our bed
        currX += moveAmountX;        
        console.log("moveX: " + moveAmountX + "  currPositionX: " + currX);
        sendCommand('move X ' + moveAmountX + ' 5000');
        //lastCommandTime = new Date().getTime();
      }

    }

    if (Math.abs(desiredY - currY + moveAmountY) > stepSize) { // make sure we need to move at all
      if (currY + moveAmountY >= 0 && currY + moveAmountY <= bedSizeY) { // make sure we won't go outside our bed
        currY += moveAmountY;        
        console.log("moveY: " + moveAmountY + "  currPositionY: " + currY);
        sendCommand('move Y ' + moveAmountY + ' 5000');
        //lastCommandTime = new Date().getTime();
      }

    }
    
  }
}


// Spoof OSC
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