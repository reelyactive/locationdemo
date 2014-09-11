locationdemo
============

Demonstration of how wireless devices can be located using a reelyActive starter kit.  Runs locally and displays visually in the browser.

Installation
------------

1. Clone the repo
2. npm install

Configuration
-------------

In config.js:

1. Set the httpport on which to serve the webpage (default 3000)
2. Set the listenerprotocol ('udp' or 'serial') 
3. Set the listenersource, for example:
 - '192.168.1.101:50000' your computer's IP address followed by the port on which UDP packets are being received from the hardware
 - '/dev/ttyUSB0' if you're running Linux and the hardware is connected via a USB port
4. Set the serial number of the three reelceivers in order of proximity to the hub

Running locally
---------------

    node server.js

Then point your web browser to [localhost:3000](http://localhost:3000).

Example output
--------------

![screenshot](http://reelyactive.com/images/locationdemo-screenshot.jpg)

See also
--------

[barnowl](https://www.npmjs.org/package/barnowl) for npmjs

License
-------

MIT License

Copyright (c) 2014 reelyActive

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
