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
misty.MoveHeadDegrees(0, 0, 0, 40);
misty.MoveArmDegrees("right", 70, 10);
misty.Pause(50);
misty.MoveArmDegrees("left", 70, 10);
misty.ChangeLED(148, 0, 211);

misty.StartFaceRecognition();

function registerFaceRec() 
{
    misty.RegisterEvent("FaceRec", "FaceRecognition", 1000, false);
}

function _FaceRec(data) 
{
    var faceDetected = data.PropertyTestResults[0].PropertyParent.PersonName;

    if (faceDetected == "unknown person") {
        misty.ChangeLED(255, 0, 0);
        misty.DisplayImage("e_Disgust.jpg");
        misty.MoveArmDegrees("right", 70, 50);
        misty.Pause(50);
        misty.MoveArmDegrees("left", 70, 50);
    } else if (faceDetected == "<Your Name>") {
        misty.ChangeLED(148, 0, 211);
        misty.DisplayImage("e_Joy.jpg");
        misty.MoveArmDegrees("right", -80, 50);
        misty.Pause(50);
        misty.MoveArmDegrees("left", -80, 50);
    }
}

registerFaceRec();
