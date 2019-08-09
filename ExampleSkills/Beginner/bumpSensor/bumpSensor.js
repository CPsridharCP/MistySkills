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


// Misty Registers for event BumpSensor with Event Name "Bumped"
// You could change event name ("Bumped") to anything you like while the event "BumpSensor" cannot be changed 
misty.AddReturnProperty("Bumped", "sensorName");
misty.AddReturnProperty("Bumped", "IsContacted");
misty.RegisterEvent("Bumped", "BumpSensor", 50 ,true);


function _Bumped(data) 
{
    var sensor = data.AdditionalResults[0];
    var isPressed = data.AdditionalResults[1];
	isPressed ? misty.Debug(sensor+" is Pressed") : misty.Debug(sensor+" is Released");
    
    if (isPressed)
    {
        if (sensor == "Bump_FrontRight")
        {
            misty.PlayAudio("s_Joy2.wav");   
        } 
        else if (sensor == "Bump_FrontLeft")
        {
            misty.PlayAudio("s_Awe3.wav");   
        } 
        else if (sensor == "Bump_RearLeft")
        {
            misty.PlayAudio("s_PhraseHello.wav");   
        } 
        else if (sensor == "Bump_RearRight")
        {
            misty.PlayAudio("s_Fear.wav");
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
