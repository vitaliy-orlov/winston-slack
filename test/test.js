var winston = require('winston');
var Slack = require('../lib/winston-slack').Slack;

var transport = new winston.transports.Slack({
    token: '<api token>',
    chatId: '<channel or user slack id>',
    level: 'debug'
}),
    logger = new winston.Logger({ transports: [transport] });

logger.log('debug', 'Debug test message');
logger.log('verbose', 'Verbose test message', {bool: true, string: 'test'});
logger.log('info', 'Info test message');
logger.log('warn', 'Warn test message');
logger.log('error', 'Error test message', {stack: [1,2,3,4]});

logger.remove(transport);