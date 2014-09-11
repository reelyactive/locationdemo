var config = {};

config.reelceiver = {};

/****************************************************************************/
/* Start configurable parameters                                            */
/****************************************************************************/

config.httpport = 3000;

config.listenerprotocol = 'udp';
config.listenersource = '192.168.1.101:50000';

config.reelceiver.closest =  '001bc50940810000';
config.reelceiver.middle =   '001bc50940810001';
config.reelceiver.farthest = '001bc50940810002';

/****************************************************************************/
/* End configurable parameters                                              */
/****************************************************************************/

module.exports = config;
