/**************************************************************************
WARRANTY DISCLAIMER.

General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS
PROVIDES THIS SAMPLE SOFTWARE “AS-IS” AND DISCLAIMS ALL WARRANTIES AND 
CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES 
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, 
ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES 
NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. 
MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, 
FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE. 
Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN 
DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) 
ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, 
PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, 
RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT. 

Please refer to the Misty Robotics End User License Agreement for further information 
and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/

Copyright 2020 Misty Robotics Licensed under the Apache License, Version 2.0 
http://www.apache.org/licenses/LICENSE-2.0
***************************************************************************/

// Usage: 
// 1. In Skill - Call the function speakTheText(text) with the text as an argunent. 
//    Eg. speakTheText("Testing Google Text to Speech API");
// 2. Use the user-trigger-event to call the speakTheText() function from another skill or a REST API call made directly to this skill.
//    Eg. POST <robot-ip-address>api/skills/event with payload 
//        {
//            "UniqueId": "a5899e62-89b0-4406-b071-4ab9bb2e653a",
//            "EventName": "speakTheText",
//            "Payload": {
//                "text": "Your Text To Speak"
//            }
//        }
// Requirements: 
// 1. Get an API Key from Google Cloud Platform Console for TTS and update APIKEY_Google in the .JSON file

// TEST
// speakTheText("test");

// ==================== Send Text To Google ===========================

function speakTheText(text) {
    // TTS
    var arguments = JSON.stringify({
        'input': {
            'text': text
        },
        'voice': {
            'languageCode': "en-US",
            'ssmlGender': "FEMALE"
        },
        'audioConfig': {
            'audioEncoding': "LINEAR16",

            "effectsProfileId": [
                "small-bluetooth-speaker-class-device"
            ],
            "pitch": 0.7,
            "speakingRate": 0.91
        }
    });

    misty.SendExternalRequest("POST", "https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=" + _params.APIKEY_Google, null, null, arguments, false, false, null, "application/json", "_Base64In");
}

// ==================== Audio returned from Google ====================

function _Base64In(data) {
    try {
        misty.SaveAudio("TTS.wav", JSON.parse(data.Result.ResponseObject.Data).audioContent, true, true);
    } catch (error) {
        misty.Debug(JSON.stringify(data));
    }
}

// ============= Enable REST API call directly to skill ================

misty.RegisterUserEvent("speakTheText", true);

function _speakTheText(data) {
    try {
        speakTheText(data.text);
    } catch (error) {
        misty.Debug("Cannot parse text input to speakTheText(); use this format { \"text\" : \"Your Text\"");
    }   
}