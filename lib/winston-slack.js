var winston = require('winston');
var request = require('request');
var util = require('util');

/**
 * @constructs Slack
 * @param {object} options hash of options
 */

var Slack = exports.Slack = function (options) {
    options = options || {};

    if (!options.chatId) {
        throw new Error("winston-slack requires 'chatId' property");
    }

    if (!options.token) {
        throw new Error("winston-slack requires 'token' property");
    }

    this.name = 'slack';
    this.chatId = options.chatId;
    this.token = options.token;
    this.as_user = options.as_user || false;
    this.level = options.level || 'info';

    this._apiUrl = 'https://slack.com/api/chat.postMessage';
};

/** @extends winston.Transport */
util.inherits(Slack, winston.Transport);

/**
 * Define a getter so that `winston.transports.Slack`
 * is available and thus backwards compatible.
 */
winston.transports.Slack = Slack;

/**
 * Core logging method exposed to Winston. Metadata is optional.
 * @function log
 * @member Slack
 * @param level {string} Level at which to log the message
 * @param msg {string} Message to log
 * @param meta {Object} **Optional** Additional metadata to attach
 * @param callback {function} Continuation to respond to when complete.
 */
Slack.prototype.log = function (level, msg, meta, callback) {
    var self = this;
    var body = '[' + level + ']: ' + msg;

    // convert meta to string if it is an error
    if (meta instanceof Error) {
        meta = {
            message: meta.message,
            name: meta.name,
            stack: meta.stack
        };
    }

    // add meta info into the body if not empty
    if (meta !== null && meta !== undefined && (typeof meta !== 'object' || Object.keys(meta).length > 0))
        body += "\n\n" + util.inspect(meta, {depth: 5}); // add some pretty printing

    var params = {
        as_user: this.as_user,
        token: this.token,
        channel: this.chatId,
        text: body
    };

    request.post(
        {
            uri: this._apiUrl,
            form: params
        }
        , function (err, response, body) {
            if (err) {
                self.emit('error', err);
            } else {
                try {
                    var json = JSON.parse(body);
                    if (!json.ok) {
                        self.emit('error', new Error(json.error));
                    }
                } catch (e) {
                    self.emit('error', e);
                }
            }

            self.emit('logged');

            callback(null, true);
        }
    );
};