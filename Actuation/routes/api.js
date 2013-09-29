/*
 * Serve JSON to our AngularJS client
 */

exports.name = function (req, res) {
  res.json({
  	name: 'TestGrounds'
  });
};

exports.connectPrinter = function (req, res) {
  console.log("connect the printer");

  var fork = require('child_process').fork,
    pronsole = fork( "python", ["../../Libraries/Printrun/pronsole.py"]);

    pronsole.send("help");

  pronsole.stdout.on('data', function (data) {
    console.log(data);
    // var buff = new Buffer(data);
    // var dataString = buff.toString('utf8');
    // console.log(dataString);
  });

  pronsole.stderr.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  pronsole.on('exit', function (code) {
    console.log("child exited");
  });

  res.json({
    name: 'Connect Printer response'
  });
};

