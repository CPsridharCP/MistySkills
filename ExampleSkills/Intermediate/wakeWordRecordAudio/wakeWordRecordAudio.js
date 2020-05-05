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


detectWakeWord();

function detectWakeWord() 
{
    // Start Hey Misty Recognition Service
    // Parameters Explained:
    // capture Speech boolean // overwrite last receording boolean // max record time Integer in ms ; default - 7500; max 20000; min 500 // silence timeout Integere in ms default - 5000; min 500 
    misty.StartKeyPhraseRecognition(true, true, 5000, 2000);

    // Listen to an event KeyphraseRecognized that is called once Hey Misty is recognized
    misty.RegisterEvent("heyMisty", "KeyphraseRecognized", 10, true);
    misty.RegisterEvent("audioIn", "VoiceRecord", 30, true);
}

function _audioIn(data)
{
    // data contains all the info on the audio recording
    // info includes filename, status on whether end of speech recognized to stop audio recording or recording timed-out
    misty.Debug(JSON.stringify(data));

    // You can use misty.GetAudioFile("AudioFileName.mp3"); command to get the audio file and write code on top of it. 
    // The callback for misty.GetAudioFile("AudioFileName.mp3"); would be function _GetAudioFile(data) {}
}

function _heyMisty() 
{
    misty.Debug("Wake Work Recognised");
    // After every Hey Misty recognition you would have to start Hey Misty Recognition service again
    misty.StartKeyPhraseRecognition(true, true, 5000, 2000);
}