/*
*    Copyright 2019 Misty Robotics, Inc.
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

// This snippet shows how to use Google Teanslate and Text to Speech with Misty
// Backend work required :
// 1. Create a dialogue flow project and import one of the pre-built translate agents;remove contxt in translate.text intent
// 2. Create a Google Cloud Function That Provides you with Access Token  
// 3. Enable Cloud-Text-To-Speech API and Cloud-Translation API in the GCS Console

// Usage:
// Press front right bump sensor and speak after thee beeep
// Wehen you are done, press the Front Left Bump Sensor 
// Checkout the Video 
// Your could say : Translate XXXXXX to YYYYYY language  / How do you say XXXXX in YYYYY language /  Translate XXXXXX from YYYYY language to ZZZZZZ language

// ======================= UPDATE YOUR CREDENTIALS HERE ========================
misty.Set("AccessTokenTrigger", "<YOUR-ACESS-TOKEN-PROVIDER-CLOUD-FUNCTION-TRIGGERR>", false);
misty.Set("GoogleCloudProjectID", "<YOUR-GOOGLE-CLOUD-SERVICE-PROJECT-ID>", false);


misty.Set("googleAuthToken", "not updated yet", false);
misty.Set("getAuthTokenStatus", false, false);
misty.Set("fileNameCount", 0, false);

misty.MoveHeadDegrees(0, 0, 0, 100);
misty.DisplayImage("e_DefaultContent.jpg");
misty.MoveArmDegrees("both", 90, 100);

misty.Set("langCodeForTTS", "en-US", false);

// ========================= GET ACCESS TOKEN ===============================

// _getAuthToken();
// misty.RegisterTimerEvent("getAuthToken", 30 * 60 * 1000, true);

function _getAuthToken() 
{
    misty.SendExternalRequest("POST", misty.Get("AccessTokenTrigger"), null, null, null, false, false, null, "application/json", "_UpdateAuthToken");
}

function _UpdateAuthToken(data) 
{
    misty.Set("googleAuthToken", JSON.parse(data.Result.ResponseObject.Data).authToken, false);
    misty.Set("getAuthTokenStatus", true, false);
    misty.Debug("Updated Auth Token");
}


// ========================= BUMP SENSORS ====================================

misty.AddReturnProperty("Bumped", "sensorName");
misty.AddReturnProperty("Bumped", "IsContacted");
misty.RegisterEvent("Bumped", "BumpSensor", 0, true);

try {
    misty.DeleteAudio("recording1.wav");
} catch (e) {}
try {
    misty.DeleteAudio("tts.wav");
} catch (error) {}


function _Bumped(data) 
{
    var sensor = data.AdditionalResults[0];
    var isPressed = data.AdditionalResults[1];
    isPressed ? misty.Debug(sensor + " is Pressed") : misty.Debug(sensor + " is Released");

    if (isPressed) {
        if (sensor == "Bump_FrontRight") 
        {
            _startRecording();

        } 
        else if (sensor == "Bump_FrontLeft") 
        {
            _stopRecording();
        }
    }
}

// ============================ STAT RECORDING ======================================

function _startRecording(prePause = 0) 
{
    if (prePause) misty.Pause(prePause);

    var nextFileNameCount = misty.Get("fileNameCount") + 1;
    if (nextFileNameCount >= 10) nextFileNameCount = 1;
    misty.Set("fileNameCount", nextFileNameCount, false);

    misty.PlayAudio("s_SystemWakeWord.wav", 100);
    misty.Pause(1000);
    misty.Debug("Started Recording - recording" + misty.Get("fileNameCount").toString() + ".wav");
    misty.StartRecordingAudio("recording" + misty.Get("fileNameCount").toString() + ".wav");
}

// ============================ STOP RECORDING ==================================

function _stopRecording() 
{
    misty.StopRecordingAudio();
    misty.PlayAudio("s_SystemSuccess.wav", 100);
    // misty.GetAudioList();

    // Look up and left a bit - more like thinking
    misty.MoveHeadDegrees(-20, 20, 20, 100);
    misty.DisplayImage("e_ContentLeft.jpg");
    misty.PlayAudio("s_DisorientedConfused5.wav", 100);

    misty.GetAudioFile("recording" + misty.Get("fileNameCount").toString() + ".wav", "callDialogueFlow");
}

// ======================= SEND AUDIO TO DIALOGUE FLOW ==============================

function callDialogueFlow(data) 
{
    misty.Debug(JSON.stringify(data));
    var base64 = data.Result.Base64;

    var arguments = JSON.stringify({
        "queryInput": {
            "audioConfig": {
                "audioEncoding": "AUDIO_ENCODING_LINEAR_16",
                "languageCode": "en-US",
                "sampleRateHertz": 48000
            }
        },
        "inputAudio": base64
    });


    // TOGGLE BELOW AND REMOVE TIMED EVENT ON GETAUTHTOKEN FOR  INSTANT TOKENS FOR EVERY CALL
    _getAuthToken();
    while (!misty.Get("getAuthTokenStatus")) 
    {
        misty.Pause(100);
    }
    misty.Set("getAuthTokenStatus", false, false);
    misty.Debug("Passes get auth Token");


    var token = misty.Get("googleAuthToken");
    misty.SendExternalRequest("POST", "https://dialogflow.googleapis.com/v2/projects/" + misty.Get("GoogleCloudProjectID") + "/agent/sessions/123456:detectIntent", "Bearer", token, arguments, false, false, null, "application/json", "_dialogueFlowResponse");
    misty.Debug("Sent info to Dialogue Flow");
    misty.DeleteAudio("recording" + misty.Get("fileNameCount").toString() + ".wav");

}

// ======================= DIALOGUE FLOW RESPONSE ===============================

function _dialogueFlowResponse(data) 
{
    // misty.RegisterTimerEvent("detectWakeWord", 8000, false);

    misty.Debug("Data back from Dialogure Flow");
    var response = JSON.parse(data.Result.ResponseObject.Data);
    
    misty.Debug("Response Parsed");
    // misty.Debug(JSON.stringify(response));
    
    let intent = response.queryResult.intent.displayName;
    if (intent == "translate.text")
    {
        let text = response.queryResult.parameters.text;
        let langFrom = (response.queryResult.parameters["lang-from"] == "" ? "English" : response.queryResult.parameters["lang-from"]);
        let langTo = response.queryResult.parameters["lang-to"];

        misty.Debug(text);
        misty.Debug(langFrom);
        misty.Debug(langTo);

        // If the Lnguage is suppoprted by Google TTS
        let getKnownLanguages = JSON.parse(misty.Get("knownLanguages")).languageList;
        if (getKnownLanguages.includes(langTo)) 
        {
            let getLangCode = JSON.parse(misty.Get("languageCode"));
            misty.Set("langCodeForTTS", getLangCode[langTo], false);

            var arguments = JSON.stringify({
                'q' : text,
                'format' : 'text',
                'source': getLangCode[langFrom],
                'model': 'nmt',
                'target': getLangCode[langTo]
            });

            misty.Debug("Sending Data to Google Translate");
            var token = misty.Get("googleAuthToken");
            misty.SendExternalRequest("POST", "https://translation.googleapis.com/language/translate/v2", "Bearer", token, arguments, false, false, null, "application/json", "_TranslatedData");
        }
        // If the Language is not suppported by Google TTS
        else
        {
            if (langTo == "" || langTo == undefined) langTo = 'this language';
            misty.Set("langCodeForTTS", "en-US", false);
            misty.Set("textToSpeak", "Sorry, I am still learning to talk in " + langTo + ". Would you like me to help you with another language?", false);
            speakTheText();
        }
    } 
    else 
    {
        misty.Set("langCodeForTTS", "en-US", false);
        misty.Set("textToSpeak", "Sorry, what should i translate?", false);
        speakTheText();
    }
}


function _TranslatedData(data)
{
    let response = JSON.parse(data.Result.ResponseObject.Data);
    let textToSpeak = response.data.translations[0].translatedText;
    misty.Debug(textToSpeak);
    // misty.Debug(JSON.stringify(response.data.translations[0].translatedText));

    misty.Set("textToSpeak", textToSpeak, false);
    speakTheText();
}


// ================================ GOOGLE TEXT TO SPEECH =============================

function speakTheText() 
{
    misty.Debug(misty.Get("langCodeForTTS"));
    misty.Debug(misty.Get("textToSpeak"));

    var arguments = JSON.stringify({
        'input': {
            'text': misty.Get("textToSpeak")
        },
        'voice': {
            'languageCode': misty.Get("langCodeForTTS"),
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

    misty.Debug("Sending Data to Google");
    misty.SendExternalRequest("POST", "https://texttospeech.googleapis.com/v1beta1/text:synthesize", "Bearer", misty.Get("googleAuthToken"), arguments, false, false, null, "application/json", "_Base64In")
}

function _Base64In(data) 
{
    misty.DisplayImage("e_Joy.jpg");
    misty.MoveHeadDegrees(-20, 0, 0, 100);
    misty.Pause(500);

    misty.Debug(JSON.stringify(data));
    misty.SaveAudio("tts.wav", JSON.parse(data.Result.ResponseObject.Data).audioContent, true, true);

    
    misty.DisplayImage("e_DefaultContent.jpg", 1.0, 5000);
    misty.MoveHeadDegrees(0, null, null, 40);
}

// ============================ SUPPORTED LANGUAGES ON GOOGLE TRANSLATOR AND TTS ========================

let languageCode = 
{
    "Afrikaans": "af",
    "Albanian": "sq",
    "Amharic": "am",
    "Arabic": "ar",
    "Armenian": "hy",
    "Azerbaijani": "az",
    "Basque": "eu",
    "Belarusian": "be",
    "Bengali": "bn",
    "Bosnian": "bs",
    "Bulgarian": "bg",
    "Catalan": "ca",
    "Cebuano": "ceb",
    "Chinese": "zh",
    "Corsican": "co",
    "Croatian": "hr",
    "Czech": "cs",
    "Danish": "da",
    "Dutch": "nl",
    "English": "en",
    "Esperanto": "eo",
    "Estonian": "et",
    "Finnish": "fi",
    "French": "fr",
    "Frisian": "fy",
    "Galician": "gl",
    "Georgian": "ka",
    "German": "de",
    "Greek": "el",
    "Gujarati": "gu",
    "Haitian": "Creole",
    "Hausa": "ha",
    "Hawaiian": "haw",
    "Hebrew": "he",
    "Hindi": "hi",
    "Hmong": "hmn",
    "Hungarian": "hu",
    "Icelandic": "is",
    "Igbo": "ig",
    "Indonesian": "id",
    "Irish": "ga",
    "Italian": "it",
    "Japanese": "ja",
    "Javanese": "jw",
    "Kannada": "kn",
    "Kazakh": "kk",
    "Khmer": "km",
    "Korean": "ko",
    "Kurdish": "ku",
    "Kyrgyz": "ky",
    "Lao": "lo",
    "Latin": "la",
    "Latvian": "lv",
    "Lithuanian": "lt",
    "Luxembourgish": "lb",
    "Macedonian": "mk",
    "Malagasy": "mg",
    "Malay": "ms",
    "Malayalam": "ml",
    "Maltese": "mt",
    "Maori": "mi",
    "Marathi": "mr",
    "Mongolian": "mn",
    "Nepali": "ne",
    "Norwegian": "no",
    "Nyanja": "ny",
    "Pashto": "ps",
    "Persian": "fa",
    "Polish": "pl",
    "Portuguese": "pt",
    "Punjabi": "pa",
    "Romanian": "ro",
    "Russian": "ru",
    "Samoan": "sm",
    "Scots": "Gaelic",
    "Serbian": "sr",
    "Sesotho": "st",
    "Shona": "sn",
    "Sindhi": "sd",
    "Sinhala": "si",
    "Slovak": "sk",
    "Slovenian": "sl",
    "Somali": "so",
    "Spanish": "es",
    "Sundanese": "su",
    "Swahili": "sw",
    "Swedish": "sv",
    "Tagalog": "tl",
    "Tajik": "tg",
    "Tamil": "ta",
    "Telugu": "te",
    "Thai": "th",
    "Turkish": "tr",
    "Ukrainian": "uk",
    "Urdu": "ur",
    "Uzbek": "uz",
    "Vietnamese": "vi",
    "Welsh": "cy",
    "Xhosa": "xh",
    "Yiddish": "yi",
    "Yoruba": "yo",
    "Zulu": "zu"
}

misty.Set("languageCode", JSON.stringify(languageCode), false);


let knownLanguages = 
{
    'languageList': ["Arabic", "Czech", "Danish", "Dutch", "English", "Filipino", "Finnish", "French", "German", "Greek", "Hindi", "Hungarian", "Indonesian ", "Italian", "Japanese", "Korean", "Chinese", "Norwegian", "Polish", "Portuguese", "Russian", "Slovak", "Spanish", "Swedish", "Turkish", "Ukrainian", "Vietnamese "]
};

misty.Set("knownLanguages", JSON.stringify(knownLanguages), false);