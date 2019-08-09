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

// Head movements speeds have been recently updated in a Build. 
// Do not use this skill until it has been updated

misty.ChangeLED(200, 0, 255);

misty.Set("eyeMemory", "Homeostasis.png");
misty.RegisterTimerEvent("blink_now", getRandomInt(2, 8) * 1000, false);
misty.RegisterTimerEvent("look_around", getRandomInt(5, 10) * 1000, false);

misty.Set("faceFollow", false);

misty.StartFaceDetection();
_registerFaceFollow();
registerActuatorPosition();

misty.Set("headYaw", 0.0);
misty.Set("headPitch", 0.0);

function _FaceFollow(data) 
{
    if (data.PropertyTestResults[0].PropertyParent.Distance < 70) 
    {
        if (!misty.Get("faceFollow")) 
        {
            // misty.RegisterTimerEvent("leaveFaceFollow", 7000, false);
            misty.Set("faceFollow", true);
            misty.Set("eyeMemory", "Happy.png");
            misty.DisplayImage("Happy.png");
            misty.Pause(50);
            // _blink_now(false);
        } else {}

        // misty.Set("eyeMemory", "Happy.png");
        var bearing = data.PropertyTestResults[0].PropertyParent.Bearing * 0.1 * 45.0;
        var elevation = data.PropertyTestResults[0].PropertyParent.Elevation * 45.0 * 0.1;
        misty.Debug(bearing.toString() + "   " + elevation.toString());

        var rawFinalHeadYaw = misty.Get("headYaw") + (bearing / 2.0);
        var actuateToY = rawFinalHeadYaw;
        var rawFinalHeadPitch = misty.Get("headPitch") + (elevation / 4.0);
        var actuateToP = rawFinalHeadPitch;

        actuateToY = actuateToY < -45.0 ? -45.0 : actuateToY;
        actuateToY = actuateToY > 45 ? 45.0 : actuateToY;
        actuateToP = actuateToP < -45.0 ? -45.0 : actuateToP;
        actuateToP = actuateToP > 45 ? 45.0 : actuateToP;
        misty.Debug(actuateToP.toString() + " <- Head to move to pitch");
        misty.Debug(actuateToY.toString() + " <- Head to move to yaw");

        misty.MoveHeadDegrees(actuateToP, 0.5, actuateToY, 100);
        try {
            misty.UnregisterEvent("turnOffFaceFollow");
        } catch (error) {}
        misty.RegisterTimerEvent("turnOffFaceFollow", 2000, false);
    }

}

function _turnOffFaceFollow() {
    misty.Set("faceFollow", false);
    misty.Set("eyeMemory", "Homeostasis.png");
    _blink_now(false);
    _look_around(false);
}

function _leaveFaceFollow() {
    misty.UnregisterEvent("FaceFollow");
    misty.RegisterTimerEvent("registerFaceFollow", 7000, false);
    _turnOffFaceFollow();
}

function _registerFaceFollow() {
    misty.RegisterEvent("FaceFollow", "FaceRecognition", 200, true);
}


function registerActuatorPosition() {
    misty.AddReturnProperty("Positions", "SensorId");
    misty.AddReturnProperty("Positions", "Value");
    misty.AddPropertyTest("Positions", "SensorId", "==", "ahy", "string"); //////////// ahy //////////
    misty.AddPropertyTest("Positions", "SensorId", "==", "ahp", "string"); //////////// ahy //////////
    misty.RegisterEvent("Positions", "ActuatorPosition", 100, true);
}

function _Positions(data) {
    if (data.AdditionalResults[0] == "ahy") // should be ahy ////////////////////////////////////////
    {
        // misty.Debug(data.AdditionalResults[0]+" "+(data.AdditionalResults[1]).toString())
        var headYaw = data.AdditionalResults[1]; //*180.0/Math.PI;
        headYaw = headYaw < -45.0 ? -45.0 : headYaw;
        headYaw = headYaw > 45.0 ? 45.0 : headYaw;
        misty.Set("headYaw", headYaw);
    } else if (data.AdditionalResults[0] == "ahp") {
        var headPitch = data.AdditionalResults[1]; //*180.0/Math.PI;
        headPitch = headPitch < -45.0 ? -45.0 : headPitch;
        headPitch = headPitch > 45.0 ? 45.0 : headPitch;
        misty.Set("headPitch", headPitch);
    }
}


function _blink_now(repeat = true) {
    misty.DisplayImage("blinkMisty.png");
    misty.Pause(200);
    misty.DisplayImage(misty.Get("eyeMemory"));
    misty.ChangeLED(255, 0, 255);
    if (repeat) {
        misty.RegisterTimerEvent("blink_now", getRandomInt(2, 8) * 1000, false);
    } else {
        try {
            misty.UnregisterEvent("blink_now");
        } catch (e) {}
        misty.RegisterTimerEvent("blink_now", getRandomInt(2, 8) * 1000, false);
    }
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function _look_around(repeat = true) {
    if (!misty.Get("faceFollow")) {
        misty.MoveHeadPosition(gaussianRandom(-5, 5), gaussianRandom(-5, 5), gaussianRandom(-5, 5), 100);
    } else {}
    if (repeat) misty.RegisterTimerEvent("look_around", getRandomInt(5, 10) * 1000, false);
}

function gaussianRand() {
    var u = 0.0,
        v = 0.0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random(); //(max - min + 1)) + min
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
    return num;
}

function gaussianRandom(start, end) {
    return Math.floor(start + gaussianRand() * (end - start + 1));
}

