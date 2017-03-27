var restify = require('restify');
var builder = require('botbuilder');
var bot = require('./wordclock-bot');
var intents = new builder.IntentDialog();

//=========================================================
// Bot Setup
//=========================================================
// Setup Restify Server
var server = restify.createServer();
server.use(restify.queryParser());

server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: 'b2aeb2e6-3452-4b79-b26d-c724e456776c',
    appPassword: 'aQL4cif99u3PvFjagt4es1z'
});
bot.create(connector);
server.post('/api/messages', connector.listen());
  
// Create chat bot (local runs)
// var connector = new builder.ConsoleConnector().listen();
// bot.create(connector);