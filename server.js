var barnOwl = require('barnowl');
var express = require('express');
var nedb = require('nedb');
var config = require('./config');

var REELYACTIVE_UUID = "7265656c794163746976652055554944";
var EMPTY_DEVICE_DIV = "<div class=\"device\">&nbsp;</div>";

var middleware = new barnOwl(config.middleware);
var identifierTable = {};
var app = express();
var db = new nedb();


/* Tell barnowl where to listen */
middleware.bind(config.listener);


/* Create the HTTP server */
app.listen(config.httpport);


/* Upsert tiraids into the database based on their identifier, */
/* but ignore reelceiver transmissions.                        */
middleware.on('visibilityEvent', function(tiraid) {
  var id = tiraid.identifier.value;
  if(!isReelceiver(tiraid)) {
    db.update({ "identifier.value": id }, tiraid, { upsert: true });
  }
});


/* Handle static requests */
app.use('/', express.static(__dirname + '/web'));


/* Handle locations request */
app.get('/locations', function(req, res) {
  var response = "";

  getStrongestRssi(function(tiraid) {
    var rssiDivs = prepareRssiDivs(tiraid);
    response += rssiDivs.divs;
    response += prepareOtherDivs(tiraid, rssiDivs.strongestSlot);
    res.status(200);
    res.set({ 'Content-Type': 'test/html',
              'Content-Length': response.length });
    res.send(response);
  });
});


/* Determine if this is a reelceiver by examining the 128-bit UUID */
function isReelceiver(tiraid) {
  if(tiraid.identifier.advData) {
    if(tiraid.identifier.advData.complete128BitUUIDs) {
      var uuid = tiraid.identifier.advData.complete128BitUUIDs;
      if(uuid === REELYACTIVE_UUID) {
        return true;
      }
    }
  }
  return false;
}


/* Search through the identifier table and return the tiraid */
/*   with the strongest rssi.                                */
function getStrongestRssi(callback) {
  db.find({}, { _id: 0 }).sort({ "radioDecodings.rssi": -1 }
                               ).exec(function(err, tiraids) {
    var strongest = null;
    if(tiraids.length != 0) {
      strongest = tiraids[0];
    }
    callback(strongest);
  });
}


/* Return the rssi divs and which slot (0 to 3) is the strongest */
function prepareRssiDivs(tiraid) {
  var rssi = [ "&nbsp;", "&nbsp;", "&nbsp;" ];
  var radioDecodings = tiraid.radioDecodings;
  for(var cDecoding = 0; cDecoding < radioDecodings.length; cDecoding++) {
    var decoding = radioDecodings[cDecoding];
    var decoderIdentifier = decoding.identifier;
    if(decoderIdentifier === null) continue;
    switch(decoderIdentifier.value) {
      case config.reelceiver.closest:
        rssi[0] = decoding.rssi;
        break;
      case config.reelceiver.middle:
        rssi[1] = decoding.rssi;
        break;
      case config.reelceiver.farthest:
        rssi[2] = decoding.rssi;
        break;
      default:
        console.log("You might want to add reelceiver "
                    + decoderIdentifier.value + " to the config!");
    }
  }
  var divs = "";
  var strongestRssi = "0";
  var strongestSlot = -1;
  for(var cReelceiver = 0; cReelceiver < 3; cReelceiver++) {
    divs += "<div class=\"rssi\">" + rssi[cReelceiver] + "</div>";
    if(rssi[cReelceiver] > strongestRssi) {
      strongestRssi = rssi[cReelceiver];
      strongestSlot = cReelceiver;
    }
  }
  return { divs: divs, strongestSlot: strongestSlot };
}


/* Return the other divs */
function prepareOtherDivs(tiraid, strongestSlot) {
  var divs = [ EMPTY_DEVICE_DIV, EMPTY_DEVICE_DIV, EMPTY_DEVICE_DIV ];
  if(strongestSlot < 0) {
    return divs[0] + divs[1] + divs[2];
  }
  divs[strongestSlot] = "<div class=\"device\">";
  switch(tiraid.identifier.type) {
    case "ADVA-48":
      divs[strongestSlot] += "<img src=\"images/iPod.jpg\"></div>";
      break;
    default:
      divs[strongestSlot] += "<img src=\"images/tag.jpg\"></div>";
  }
  var prettyIdentifier = JSON.stringify(tiraid.identifier, null, "&nbsp;");
  prettyIdentifier = prettyIdentifier.replace(/(\r\n|\n|\r)/gm, "<br>");
  var identifierSlot = (strongestSlot + 1) % 3;
  divs[identifierSlot] = "<div class=\"device\"><p>" + prettyIdentifier +
                         "</p></div>";
  return divs[0] + divs[1] + divs[2];
}

