exports.handler = (event, context) => {
    try {
        if (event.session.new) {
            //New Session
            console.log("NEW SESSION")
        }

        switch (event.request.type) {

            case "LaunchRequest":
                // > Launch Request
                console.log("LAUNCH REQUEST")
                context.succeed(
                    generateResponse(
                        buildSpeechletResponse("Welcome to health assistant. How may I help you?", false) //MARK
                    )
                )
                break;

            case "IntentRequest":
                // Intent Request
                console.log(`INTENT REQUEST`)

                switch (event.request.intent.name) {
                    case "PersonalInfo":
                        var heightInFeet = event.request.intent.slots.heightFeet;
                        if (heightInFeet && heightInFeet.value) {
                            feet = parseInt(heightInFeet.value);
                        }
                        var heightInInches = event.request.intent.slots.heightInches;
                        if (heightInInches && heightInInches.value) {
                            inches = parseInt(heightInInches.value);
                        }
                        var a = event.request.intent.slots.age;
                        if (a && a.value) {
                            age = parseInt(a.value);
                        }
                        var w = event.request.intent.slots.weight;
                        if (w && w.value) {
                            weight = parseInt(w.value);
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
