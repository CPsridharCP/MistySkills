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

// Copy Paster the below code snippet into your JS skill to add Google Text to speech capability to your skill
// usage: call function speak with the text as an argunent. Eg. speak("Testing Google Text to Speech API");

_ = initializeAccessTokenUpdate();
speak("Testing Google Text to Speech API");

// ======================= Set Your Credentials Here ==================

function setCredentials() 
{
    misty.Set('cloudFunctionAuthTokenURL', "YOUR_TRIGGER_URL_TO_GOOGLE_CLOUD_FUNCTION_THAT_PROVIDES_ACCESS_TOKEN", false);
    misty.Set("langCodeForTTS", "en-US", false);
}

// ==================== Update Auth Token =============================

// Each Google Cloud Access Token expires after ~45 minutes.
// We use this function to refresh tokens every 15 minutes.
// Feel free to change the refresh rate as you see fit!

function initializeAccessTokenUpdate()
{
    setCredentials();
    misty.Set("googleAuthToken", "notUpdatedYet", false);
    _getAuthToken();
    misty.RegisterTimerEvent("getAuthToken", 60000 * 15, true);
    while (misty.Get("googleAuthToken") == "notUpdatedYet") misty.Pause(500);
    return 0;
}

function _getAuthToken() 
{
    misty.SendExternalRequest("POST", misty.Get("cloudFunctionAuthTokenURL"), null, null, null, false, false, null, "application/json", "_UpdateAuthToken");
}

function _UpdateAuthToken(data) 
{
    misty.Set("googleAuthToken", JSON.parse(data.Result.ResponseObject.Data).authToken, false);
    misty.Debug("Updated Auth Token");
}

// ==================== Send Test To Google ===========================

function speak(text)
{
    var arguments = JSON.stringify({
        'input': {
            'text': text
        },
        'voice': {
            'languageCode': "en-US",
            'name': "en-US-Wavenet-F",
            'ssmlGender': "FEMALE"
        },
        'audioConfig': {
            'audioEncoding': "LINEAR16",
            "effectsProfileId": [
                "small-bluetooth-speaker-class-device"
            ],
            "pitch": 0,
            "speakingRate": 0.91
        }
    });

    misty.Debug("Sending Text Data to Google");
    misty.SendExternalRequest("POST", "https://texttospeech.googleapis.com/v1beta1/text:synthesize", "Bearer", misty.Get("googleAuthToken"), arguments, false, false, null, "application/json", "_Base64In")
}

// ================= Base64 Audio Returned by Google ==================

function _Base64In(data)
{
    misty.Debug("Saving and plaaying audio received from Google TTS API");
    misty.SaveAudio("tts.wav", JSON.parse(data.Result.ResponseObject.Data).audioContent, true, true);
}
