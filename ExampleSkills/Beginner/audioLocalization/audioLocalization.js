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

misty.ChangeLED(0, 0, 255);
misty.MoveHeadDegrees(-15.0, 0.0, 0.0, 70);
// Audio Localization is available only if Misty is recording an Audio
// so we just start recording audio.
misty.StartRecordingAudio("deleteThis.wav");
misty.Pause(3000);
misty.ChangeLED(0, 255, 0);
registerAudioLocalisation();

function registerAudioLocalisation() 
{
    misty.AddReturnProperty("soundIn", "DegreeOfArrivalSpeech");
    misty.RegisterEvent("soundIn", "SourceTrackDataMessage", 100, true);
}

function _soundIn(data) 
{
    misty.Debug(data.AdditionalResults[0].toString() + " <- Audio in Degrees");
}
