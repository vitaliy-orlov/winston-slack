# winston-slack
A Slack transport for [winston](https://github.com/winstonjs/winston)
# Installation
```
npm install winston
npm install winston-slack-light
```
# Usage
``` js
var winston = require('winston');
require('winston-slack').Slack;
var transport = new winston.transports.Slack({
    token: '<api token>',
    chatId: '<channel or user slack id>'
});
var logger = new winston.Logger({ transports: [transport] });
```
Options:
* __chatId:__ Channel or user ID
* __token:__ Your private API Slack [token](https://get.slack.help/hc/en-us/articles/215770388-Creating-and-regenerating-API-tokens)
* __asUser:__ Send message as user. By default, message send as bot user. [Info](https://api.slack.com/methods/chat.postMessage#authorship)
* __asAttachment:__ Send message with body as attachment. It gives you ability to use colors for any log level.
* __attachmentTitle:__ Set text for message. This text will be show in push notification. By default, log level.
* __colors:__ Set your own colors for log levels. Properties: debug, verbose, info, warn, error.