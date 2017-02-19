'use strict';
let Alexa = require('alexa-sdk');
let firebase = require('firebase');
let config = require('./config');

let APP_ID = undefined; //Fill in later
let SKILL_NAME = 'Imperium';

//Initialization for Node.js app
firebase.initializeApp({
    serviceAccount: config,
    databaseURL: "https://echo-smarts.firebaseio.com"
});

let database = firebase.database();

exports.handler = function(event, context, callback) {
    let alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

let handlers = {
    'PersonalInfo': function() {

    },
    'UserLoginRequest': function() {
        var userID = this.event.request.intent.slots.userID;
    },
    'HelpMe': function() {
        this.emit(':tell', 'Hello! Welcome to Imperium. I am a health database that keeps track of your health information. Input personal information or request an analysis of your health portfolio.')
    },
    'DefineParkinsons': function() {
        this.emit(':tell', 'Parkinsons disease (PD) is a long-term degenerative disorder of the central nervous system that mainly affects the motor system. Symptoms include shaking, slowness of movement, depression and emotional problems. The cause of Parkinsons remains unknown, but it is believed to be a product of both genetic and environmental factors.')
    },
    'AMAZON.HelpIntent': function() {
        let speechOutput = "Hello! Welcome to Imperium. I am a health database that keeps track of your health information. Input personal information or request an analysis of your health portfolio.";
        let reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function() {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function() {
        this.emit(':tell', 'Goodbye!');
    }
};
