/**************************************************************************
WARRANTY DISCLAIMER.

General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS
PROVIDES THIS SAMPLE SOFTWARE “AS-IS” AND DISCLAIMS ALL WARRANTIES AND 
CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES 
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, 
ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES 
NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. 
MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, 
FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE. 
Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN 
DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) 
ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, 
PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, 
RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT. 

Please refer to the Misty Robotics End User License Agreement for further information 
and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/

Copyright 2020 Misty Robotics Licensed under the Apache License, Version 2.0 
http://www.apache.org/licenses/LICENSE-2.0
***************************************************************************/

// The SKill : Misty tries to look at a persons face and follow the face as it moves

misty.MoveHead(0, 0, 0, null, 1);
misty.Set("findFace", false);
misty.ChangeLED(255, 255, 255);

// Global variable to store current pitch and yaw position of the head
misty.Set("headYaw", 0.0, false);
misty.Set("headPitch", 0.0, false);

// ========================= Reading Head Yaw and Pitch ==========================

function registerYaw() 
{
    misty.AddReturnProperty("headYaw", "SensorId");
    misty.AddReturnProperty("headYaw", "Value");
    misty.AddPropertyTest("headYaw", "SensorId", "==", "ahy", "string");
    misty.RegisterEvent("headYaw", "ActuatorPosition", 100, true);
}
registerYaw();

function registerPitch() 
{
    misty.AddReturnProperty("headPitch", "SensorId");
    misty.AddReturnProperty("headPitch", "Value");
    misty.AddPropertyTest("headPitch", "SensorId", "==", "ahp", "string");
    misty.RegisterEvent("headPitch", "ActuatorPosition", 100, true);
}
registerPitch();

function _headYaw(data) 
{
    var headYaw = data.AdditionalResults[1];
    // misty.Debug(headYaw);
    misty.Set("headYaw", headYaw, false);
}

function _headPitch(data) 
{
    var headPitch = data.AdditionalResults[1];
    // misty.Debug(headPitch);
    misty.Set("headPitch", headPitch, false);
}

// ================================ Calibrate =================================
// Misty moves the head right left down up and records the max reachable angles.

// The calibration is not mandatory everytime. Run this once and look at the debug console 
// for the pitch and yaw min max range limits. Update the four global variables 
// listed below with the limits and comment out the call to calibrate funtion 
// "_ = caliberate();"

misty.Set("yawRight", -90.0, false);
misty.Set("yawLeft", 90.0, false);
misty.Set("pitchUp", -90.0, false);
misty.Set("pitchDown", 90.0, false);

misty.Pause(2000);
function caliberate()
{
    misty.MoveHead(0, 0, -90, null, 2);
    misty.Pause(4000);
    misty.Set("yawRight", misty.Get("headYaw"), false);
    misty.Debug("Yaw Right Recorded :" + misty.Get("yawRight").toString());

    misty.MoveHead(0, 0, 90, null, 2);
    misty.Pause(4000);
    misty.Set("yawLeft", misty.Get("headYaw"), false);
    misty.Debug("Yaw Left Recorded :" + misty.Get("yawLeft").toString());

    misty.MoveHead(90, 0, 0, null, 2);
    misty.Pause(4000);
    misty.Set("pitchDown", misty.Get("headPitch"), false);
    misty.Debug("Pitch Down Recorded :" + misty.Get("pitchDown").toString());

    misty.MoveHead(-90, 0, 0, null, 2);
    misty.Pause(4000);
    misty.Set("pitchUp", misty.Get("headPitch"), false);
    misty.Debug("Pitch Up Recorded :" + misty.Get("pitchUp").toString());

    misty.Debug("CALIBRATION COMPLETE");
    misty.MoveHead(0, 0, 0, null, 2);
    
    return 0;
}
_ = caliberate();

// ============================ Face Recognition Data and Face Follow =========================

misty.StopFaceRecognition();
misty.StartFaceRecognition();

function registerFaceRec() 
{
    misty.RegisterEvent("FaceRec", "FaceRecognition", 1300, true);
    misty.RegisterTimerEvent("findFace", 6000, false);
}

function _FaceRec(data) 
{

    if (misty.Get("findFace"))
    {
        misty.Set("findFace", false);
        misty.ChangeLED(0, 255, 0);
        misty.DisplayImage("e_Love.jpg");
    }
    
    const faceDetected = data.PropertyTestResults[0].PropertyParent.Label; //PersonName 
    const bearing = data.PropertyTestResults[0].PropertyParent.Bearing;  // -13 right and +13 left
    const elevation = data.PropertyTestResults[0].PropertyParent.Elevation;  // -13 up and +13 down
    misty.Debug(JSON.stringify(faceDetected));

    const headYaw = misty.Get("headYaw");
    const headPitch = misty.Get("headPitch");
    const yawRight = misty.Get("yawRight");
    const yawLeft = misty.Get("yawLeft");
    const pitchUp = misty.Get("pitchUp");
    const pitchDown = misty.Get("pitchDown");


    if (bearing != 0 && elevation != 0)
    {
        misty.MoveHead(headPitch + ((pitchDown - pitchUp) / 33) * elevation, 0, headYaw + ((yawLeft - yawRight) / 66) * bearing, null, 7 / Math.abs(bearing));
    }
    else if (bearing != 0)
    {
        misty.MoveHead( null, 0, headYaw + ((yawLeft - yawRight) / 66) * bearing, null, 7 / Math.abs(bearing));
    }
    else 
    {
        misty.MoveHead(headPitch + ((pitchDown - pitchUp) / 33) * elevation, 0, null, null, 5 / Math.abs(elevation));
    }

    misty.RegisterTimerEvent("findFace", 6000, false);

}
registerFaceRec();

// ========================== Lost Face - Search Mode =======================

function _findFace()
{
    misty.Set("findFace", true);
    misty.ChangeLED(0, 0, 255);
    misty.DisplayImage("e_DefaultContent.jpg");
}

function _lookSidetoSide()
{   
    if (misty.Get("findFace"))
    {
        if (misty.Get("headYaw") > 0) misty.MoveHead(getRandomInt(-20, 0), 0, -40, null, 4);
        else misty.MoveHead(getRandomInt(-20, 0), 0, 40, null, 4);
    }
}
misty.RegisterTimerEvent("lookSidetoSide", 6500, true);

function getRandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
