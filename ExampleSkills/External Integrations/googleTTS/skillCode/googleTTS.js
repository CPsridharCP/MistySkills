/*
*    Copyright 2020 Misty Robotics, Inc.
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
*/

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
