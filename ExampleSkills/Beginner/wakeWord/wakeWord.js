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

// Misty plays an audio on hearing "Hey Misty"
// Once Hey Misty is triggered you would need to start it again by calling misty.StartKeyPhraseRecognition(<parameters>);

detectWakeWord();

function detectWakeWord() 
{
    // False indicated we are not recording the audio after Hey Misty is receognized
    misty.StartKeyPhraseRecognition(false);

    // Listening to the Event "KeyphraseRecognized" to take action when Hey Misty is recognized
    // First parameter is the name of the callback function that will be triggered when the event happens (can change)
    // Second parameter is the eventName (fixed)
    // Third parameter is the debounce (can change)
    // Fourth parameter is a boolean that indicates if you want to keep listening to the event trigger continuously
    misty.RegisterEvent("heyMisty", "KeyphraseRecognized", 10, false);
}

function _heyMisty() 
{
    // misty.PlayAudio("s_SystemWakeWord.wav", 100);
    misty.Debug("Wake Work Recognised");
    detectWakeWord();
}