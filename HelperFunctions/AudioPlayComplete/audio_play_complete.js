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
Copyright 2021 Misty Robotics Licensed under the Apache License, Version 2.0 
http://www.apache.org/licenses/LICENSE-2.0
***************************************************************************/

register_audio_play_complete();

// Audio play complete
function register_audio_play_complete() {

    // Find when an audio file ends playing
    misty.RegisterEvent("audio_play_complete_message", "AudioPlayComplete", 100, true);

    // Find when Local TTS ends playing
    misty.RegisterEvent("tts_play_complete_message", "TextToSpeechComplete", 100, true);
    // Note: 
    // Local TTS audio play complete events will be triggered only if UtteranceId is passed with the call
    // misty.Speak(msg, 0.88, 0.88, null, false, "local_tts");
    // The "local_tts" here is the UtteranceId
}

function _audio_play_complete_message(data) {
    if (data.PropertyTestResults[0].PropertyParent.MetaData.Name == "<your_audio_file_name.extension>") {    
        // Perform action 
        // Example: Start Key Phrase Recognition / Start recording audio
    }
}

function _tts_play_complete_message(data) {
    misty.Debug(JSON.stringify(data));
    // Perform action
    // Example: Start Key Phrase Recognition / Start recording audio   
}