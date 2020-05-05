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
    var faceDetected = data.PropertyTestResults[0].PropertyParent.Label;

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
