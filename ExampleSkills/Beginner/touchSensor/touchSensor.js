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


// Misty Registers for event TouchSensor with Event Name "Touched"
// You could change event name ("Touched") to anything you like while the event "TouchSensor" cannot be changed 
misty.AddReturnProperty("Touched", "sensorPosition");
misty.AddReturnProperty("Touched", "IsContacted");
misty.RegisterEvent("Touched", "TouchSensor", 50 ,true);

function _Touched(data)
{
    var sensor = data.AdditionalResults[0];
    var isPressed = data.AdditionalResults[1];
	isPressed ? misty.Debug(sensor+" is Touched") : misty.Debug(sensor+" is Released");
    
    if (isPressed)
    {
        if (sensor == "Chin")
        {            
            misty.PlayAudio("s_PhraseOwwww.wav");   
        } 
        else if (sensor == "HeadRight")
        {
            misty.PlayAudio("s_PhraseEvilAhHa.wav");   
        } 
        else if (sensor == "HeadLeft")
        {
            misty.PlayAudio("s_Distraction.wav");   
        } 
        else if (sensor == "HeadFront")
        {
            misty.PlayAudio("s_Acceptance.wav");
        } 
        else if (sensor == "HeadBack")
        {
            misty.PlayAudio("s_Disapproval.wav");
        } 
        else if (sensor == "Scruff")
        {
            misty.PlayAudio("s_Grief.wav");
        } 
        else 
        {
            misty.Debug("Sensor Name Unknown");
        }
    }
} 

// Other things to explore
//  misty.DisplayImage("Angry.png");
//  misty.ChangeLED(0, 0, 0);  // R, G, B
