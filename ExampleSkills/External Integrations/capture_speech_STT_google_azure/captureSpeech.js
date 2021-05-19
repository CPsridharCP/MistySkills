// Register to VoiceRecord Event to follow up with what happens after the recording is complete
register_voice_record_complete();
misty.Pause(1000);


// SELECT BETWEEN PLAIN CAPTURE SPEECH, GOOGLE AND AZURE STT CAPTURE SPEECH HERE
_run_example = "google"; // plain ,  google , azure


if (_run_example == "google")  {
    // parameters: overwriteExisting, silenceTimeout, maxSpeechLength, requireKeyPhrase, captureFile, speechRecognitionLanguage, key
    misty.CaptureSpeechGoogle(false, 4000, 6500, false, true, "en-us", "__YOUR_KEY_HERE__");
} 

else if (_run_example == "azure") {
    // parameters: overwriteExisting, silenceTimeout, maxSpeechLength, requireKeyPhrase, captureFile, speechRecognitionLanguage, key, speechRegion
    misty.CaptureSpeechAzure(false, 4000, 6500, false, true, "en-us", "__YOUR_KEY_HERE__", "eastus");
} 

else {
    // parameters: requireKeyPhrase, overwriteExisting, maxSpeechLength, silenceTimeout
    misty.CaptureSpeech(false, true, 6500, 4000);
}


function _voice_record_complete_message(data) {

    misty.Debug(JSON.stringify(data));
    var filename = data.AdditionalResults[0];
    let success = data.AdditionalResults[1];
    let error_code = data.AdditionalResults[2];
    let error_message = data.AdditionalResults[3];
    let stt_result = data.AdditionalResults[4];

    if (success) {
        misty.Debug("Info: Audio recording successful.");
        misty.Debug(filename);
        if (_run_example == "google" || _run_example == "azure") misty.Debug("Misty Heard: " + stt_result);  
        else misty.GetAudioFile(filename, "use_audio");   // Send audio to your preferred cloud service
    }
    else {
        misty.Debug("Error: Recording Audio");
        misty.Debug(error_message);
        misty.Debug(error_code);
    }
}


function use_audio(data) {
    // misty.Debug(JSON.stringify(data));
    let base64 = data.Result.Base64;
    misty.Debug(base64);
    // You can chooose to send the base64 any of your preferred cloud service here using misty.SendExternalRequest() command
}


function register_voice_record_complete() {
    misty.AddReturnProperty("voice_record_complete_message", "Filename");
    misty.AddReturnProperty("voice_record_complete_message", "Success");
    misty.AddReturnProperty("voice_record_complete_message", "ErrorCode");
    misty.AddReturnProperty("voice_record_complete_message", "ErrorMessage");
    misty.AddReturnProperty("voice_record_complete_message", "SpeechRecognitionResult");
    misty.RegisterEvent("voice_record_complete_message", "VoiceRecord", 100, true);
}