speak("CP testing Google Text To Speech");

// Function calls Google Cloud Text to Speech Service
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

    misty.Debug("Sending Data to Google");
    misty.SendExternalRequest("POST", "https://texttospeech.googleapis.com/v1beta1/text:synthesize", "Bearer", "<Your-Access-Token>", arguments, false, false, null, "application/json", "_Base64In")
}

// Callback - Saves and Plays the Audio 
function _Base64In(data)
{
    // misty.Debug(JSON.stringify(data));
    misty.SaveAudio("tts.wav", JSON.parse(data.Result.ResponseObject.Data).audioContent, true, true);
}