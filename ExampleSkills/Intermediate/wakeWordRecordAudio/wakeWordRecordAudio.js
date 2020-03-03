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