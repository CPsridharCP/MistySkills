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

// Stop Misty's default blinking
misty.SetBlinking(false);

// Turn on Misty's default blinking
// misty.SetBlinking(true);

// Your Custom Blink
misty.Set("eyeMemory", "my_eye_image.jpg");

function _blink_now(repeat = true) 
{
    misty.DisplayImage("my_blink_image.jpg");
    misty.Pause(200);
    misty.DisplayImage(misty.Get("eyeMemory"));
    if (repeat) misty.RegisterTimerEvent("blink_now", getRandomInt(2, 8) * 1000, false);
}
_blink_now();

function getRandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
