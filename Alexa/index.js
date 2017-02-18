var ethnic = "temp"; //race
var gender = "true"; //female, false for male
var age = 20; //years
var userID = 0;
var verificationID = 0;

var ethnicities = {
    "black": "African American",
    "african american": "African American",
    "white": "Caucasian",
    "caucasian": "Caucasian",
    "asian": "Asian",
    "hispanic": "Hispanic/Latino",
    "latino": "Hispanic/Latino",
    "alaskan native": "American Indian / Alaskan Native",
    "american indian": "American Indian / Alaskan Native"
    "Native Hawaiian": "Native Hawaiian / Pacific Islander",
    "Pacific Islander": "Native Hawaiian / Pacific Islander"
}

exports.handler = (event, context) => {
    try {
        if (event.session.new) {
            //New Session
            console.log("NEW SESSION")
        }

        switch (event.request.type) {

            case "LaunchRequest":
                console.log("LAUNCH REQUEST")
                context.succeed(
                    generateResponse(
                        buildSpeechletResponse("Welcome to health assistant. Please login to your account by stating your user ID.", false) //MARK
                    )
                )
                break;

            case "IntentRequest":
                // Intent Request
                console.log(`INTENT REQUEST`)

                switch (event.request.intent.name) {
                    case "UserLoginRequest":
                        console.log("Logging in")
                        var temp = event.request.intent.slots.userID;

                        if (temp) { //MARK: USER ID is found in backend database
                            userID = temp;
                            //Mark: Load information of user into variables.
                            context.succeed(
                                generateResponse {
                                    buildSpeechletResponse("Your identification information was found and you are now registered. Feel free to set personal information and request analysis.", true), {}
                                }
                            )
                        } else {
                            context.succeed(
                                generateResponse {
                                    buildSpeechletResponse("I'm sorry, your identification value was not found in our internal database, try again?", true), {}
                                }
                            )
                        }

                    case "PersonalInfo":
                        var a = event.request.intent.slots.age;
                        if (a && a.value) {
                            age = parseInt(a.value);
                        }
                        var race = event.request.intent.slots.race;
                        if (race && race.value) {
                            race = race.value.toLowerCase();
                            if (ethnicities[race]) {
                                ethnic = ethnicities[race];
                            }
                        }
                        var g = event.request.intent.slots.gender;
                        if (g && g.value) {
                            gender = g.value.toLowerCase();
                            if (gender == "female") {
                                gender = true;
                            } else {
                                gender = false;
                            }
                        }

                    case "DefineParkinsons":
                        context.succeed(
                            generateResponse(
                                buildSpeechletResponse('Parkinsons disease (PD) is a long-term degenerative disorder of the central nervous system that mainly affects the motor system. Symptoms include shaking, slowness of movement, depression and emotional problems. The cause of Parkinsons remains unknown, but it is believed to be a product of both genetic and environmental factors.', false), {}
                            )
                        )
                        break;

                    case "HelpMe":
                        context.succeed(
                            generateResponse(
                                buildSpeechletResponse('', false), {}
                            )
                        )
                        break;

                    case "TerminateCal":
                        context.succeed(
                            generateResponse(
                                buildSpeechletResponse(`Thanks! See you around!`, true), {} //MARK
                            )
                        )
                        console.log('SESSION ENDED REQUEST')
                        break;
                }
                break;

            case "SessionEndRequest":
                // Session Ended Request
                context.succeed(
                    generateResponse(
                        buildSpeechletResponse(`Thanks! See you around!`, true), {} //MARK
                    )
                )
                console.log('SESSION ENDED REQUEST')
                break;

            default:
                context.fail('INVALID REQUEST TYPE ${event.request.type}')

        }
    } catch (error) {
        context.fail('Exception: ${error}')
    }

}

// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {

    return {
        outputSpeech: {
            type: "PlainText",
            text: outputText
        },
        shouldEndSession: shouldEndSession
    }

}

generateResponse = (speechletResponse, sessionAttributes) => {

    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }

}
