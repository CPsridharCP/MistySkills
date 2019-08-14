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

misty.Debug("Homing Head and Arms");
_timeoutToNormal();

misty.StartFaceDetection();

function registerFaceDetection() 
{
    misty.AddPropertyTest("FaceDetect", "PersonName", "exists", "", "string");
    misty.RegisterEvent("FaceDetect", "FaceRecognition", 1000, true);
}

function _FaceDetect(data)
{   
    misty.Debug(JSON.stringify(data));
    misty.ChangeLED(148, 0, 211);
    misty.DisplayImage("e_Joy.jpg");
    misty.MoveArmDegrees("right", -80, 10);
    misty.Pause(50);
    misty.MoveArmDegrees("left", -80, 10);
    misty.RegisterTimerEvent("timeoutToNormal", 5000, false);
}

registerFaceDetection();

function _timeoutToNormal()
{
    registerFaceDetection();
    misty.Pause(100);
    misty.MoveHeadPosition(0.1, 0.1, 0.1, 40);
    misty.MoveArmDegrees("right", 70, 10);
    misty.Pause(50);
    misty.MoveArmDegrees("left", 70, 10);
    misty.ChangeLED(0, 255, 0);
    misty.DisplayImage("e_DefaultContent.jpg");
}