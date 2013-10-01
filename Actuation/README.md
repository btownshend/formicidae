

Steps to create the printer (stimulation) bridge
==========

* Clone printrun project: https://github.com/kliment/Printrun
* the command below assumes you have checked out copy of Printrun in a relative directory called 'Libraries'
* Make sure node.js is installed


**From inside the Actuation directory**
> npm install
> node app.js
> python pronsole_interface.py | ../../Libraries/Printrun/pronsole.py



Pronsole
connect /dev/cu.usbmodemfd121 230400



Notes
======

**Type A Bed Dimensions**
> 260mm x 230mm x 230mm



**Project Marlin (list of commands for various operations)** 

* Codes (https://github.com/ErikZalm/Marlin):

> turn off min thermister temp warning: m302
> report back current perceived position:  m114







