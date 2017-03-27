var builder = require('botbuilder');
var WordClock = require('./wordclock');
var wordClock = new WordClock();
var intents = new builder.IntentDialog();

function create(connector) {
    var bot = new builder.UniversalBot(connector);

    //=========================================================
    // Bots Dialogs
    //=========================================================
    bot.dialog('/', intents);

    // match "commanding" actions with subjects
    intents.matches(/(time|now)/ig, [
        function (session) {
            // random choose how bot would respond to the command.
            var randomChoice = Math.round(Math.random() * 4) + 1;
            session.send(wordClock['tellTime'+randomChoice]());
        }
    ]);

    intents.onDefault([
        function (session, args, next) {
            if (!session.userData.name) {
                session.beginDialog('/welcome');
            } else {
                next();
            }
        },
        function (session, results) {
            session.send('Hello %s! How may I assist you?', session.userData.name);
        }
    ]);

    intents.matches(/(bye|goodbye)/ig, [
        function (session, args, next) {
            session.endDialog('It\'s nice to meet you %s! Goodbye!', session.userData.name);
        }
    ]);

    bot.dialog('/welcome', [
        function (session) {
            builder.Prompts.text(session, 'Hi! My name is word clock bot. What is your?');
        },
        function (session, results) {
            session.userData.name = results.response;
            session.endDialog();
        }
    ]);

    return bot;
};

module.exports = { create };