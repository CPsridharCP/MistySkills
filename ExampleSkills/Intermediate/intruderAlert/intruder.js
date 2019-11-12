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
misty.MoveHeadDegrees(0, 0, 0, 100);
misty.MoveArmDegrees("left", 89, 45); misty.Pause(50);
misty.MoveArmDegrees("right", 89, 45);
misty.ChangeLED(148, 0, 211);


function registerFaceRec() 
{
    misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
    misty.RegisterEvent("FaceRec", "FaceRecognition", 1000, false);
}

function _FaceRec(data) 
{
    misty.Drive(0, 0);
    var faceDetected = data.PropertyTestResults[0].PropertyValue;
    if (faceDetected == "unknown person") 
    {
        misty.ChangeLED(255, 0, 0);
        misty.DisplayImage("e_Disgust.jpg");
        misty.PlayAudio("s_DisorientedConfused5.wav");
        misty.TakePicture(false, "Intruder", 1200, 1600, false, true);
        misty.MoveArmDegrees("left", 30, 45);
        misty.Pause(50);
        misty.MoveArmDegrees("right", 30, 45);
    } 
    else if (faceDetected == "<Your Name>") 
    {
        misty.ChangeLED(148, 0, 211);
        misty.DisplayImage("e_Joy.jpg");
        misty.PlayAudio("s_Joy3.wav"); // This line could be replaced with an api to call google voics / mistys text to speech
        misty.MoveArmDegrees("left", -89, 45);
        misty.Pause(50);
        misty.MoveArmDegrees("right", -89, 45);
    } 
    else 
    {
        misty.ChangeLED(148, 0, 211);
        misty.DisplayImage("e_Surprise.jpg");
        misty.PlayAudio("s_Awe.wav");
        misty.MoveArmDegrees("left", -89, 45);
        misty.Pause(50);
        misty.MoveArmDegrees("right", 89, 45);
    }

    misty.RegisterTimerEvent("resumeDriving", 7000, false);
    
}


function _resumeDriving()
{
    misty.DisplayImage("e_DefaultContent.jpg");
    misty.Set("Initiated", false);
    misty.MoveArmDegrees("left", 89, 45);
    misty.Pause(50);
    misty.MoveArmDegrees("right", 89, 45);
    misty.Drive(15, 20);
    misty.Pause(1000);
    registerFaceRec();
    misty.ChangeLED(0, 255, 0);
}

misty.Drive(15, 20);
registerFaceRec();
