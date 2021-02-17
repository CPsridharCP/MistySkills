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

// Required Build Version 1.18 or greater 

// Misty can detect 70 obejcts. You can use this code to track and follow all the 70 objects. 
// Scroll down all the way for the complete list.
// In this example I have made Misty follow just 1 object - "person". 
// This is a first pass. Lots more tunings and improvements can be made. Feel free to play with it.

// Three modes are available. Change the below parameters in the .json file to select mode
// "turnInPlace", "followHuman"
// The head moves to look at person in all 3 modes
// Mode 1: No driving ("turnInPlace" : false, "followHuman" : false)
// Mode 2: Allow turning in place, but not driving forward/backward ("turnInPlace" : true, "followHuman" : false)
// Mode 3: Allow full driving ("turnInPlace" : true/false, "followHuman" : true)

// Note:
// Hazards triggered might stop Misty. The skill will play an "Uhoh" audio when that happens.
// Make sure the ToF covers are clean. And if you would like Misty to not play the audio, set "silentMode" to true in the .json file
// You could also turn off Hazard System from stopping the robot through the API Explorer by setting all ToF values to 0 (sdk.mistyrobotics.com)

// Turning:
// There are lots of magic numbers in _personDetection() function.. Play with it!

// Things to improve:
// Prioritize tracking of the closest person when there are multiple people in the FOV.


misty.Debug("Follow Human Skill Started");

function start() {
    registerHeadPitch();
    registerHeadYaw();
    registerSystemHazardNotification();
    // misty.Set("nowTracking", -1, false);
    // registerRobotYaw();
    misty.Pause(1000);
    _ = initiateHeadPhysicalLimitVariables(forceCalibration = _params.forceHeadCalibration);
    startHumanTracking();
}
start();

function startHumanTracking() {
    misty.AddPropertyTest("personDetection", "Description", "==", "person", "string");
    // misty.AddPropertyTest("personDetection", "Confidence", ">", 0.6, "double");
    misty.RegisterEvent("personDetection", "ObjectDetection", 500, true);
    misty.StartObjectDetector(0.5, 0, 15);
}

/*
Confidence: 0.6656214
Created: "2020-07-23T14:02:34.8795248Z"
Description: "laptop"
Id: 0
ImageLocationBottom: 275.450775
ImageLocationLeft: 81.9578247
ImageLocationRight: 249.462738
ImageLocationTop: 101.051857
LabelId: 73
Pitch: 0.119271189
SensorId: "cv"
Yaw: 0.00674471259
*/

function _personDetection(data) {
    // misty.Debug(data.PropertyTestResults[0].PropertyParent);
    if (data.PropertyTestResults[0].PropertyParent.Confidence >= 0.6) {
        // misty.Debug(data.PropertyTestResults[0].PropertyParent.Id);
        // misty.Debug(data.PropertyTestResults[0].PropertyParent.Confidence);
        // misty.Debug(data.PropertyTestResults[0].PropertyParent.Description);
        // misty.Debug(data.PropertyTestResults[0].PropertyParent.Yaw);
        // misty.Debug(data.PropertyTestResults[0].PropertyParent.Pitch);
        // misty.Debug(data.PropertyTestResults[0].PropertyParent.ImageLocationLeft);
        // misty.Debug(data.PropertyTestResults[0].PropertyParent.ImageLocationRight);
        // misty.Debug(data.PropertyTestResults[0].PropertyParent.ImageLocationTop);
        // misty.Debug(data.PropertyTestResults[0].PropertyParent.ImageLocationBottom);

        // Pixel width of the bounding box. To be used as a measure of distance to the person.
        var widthOfHuman = data.PropertyTestResults[0].PropertyParent.ImageLocationRight - data.PropertyTestResults[0].PropertyParent.ImageLocationLeft;

        // 0 is Left 320 is Right  - Convert it ==>  L:1 to R:-1
        var X_Error = (160.0 - ((data.PropertyTestResults[0].PropertyParent.ImageLocationLeft + data.PropertyTestResults[0].PropertyParent.ImageLocationRight)/2.0))/160.0;
        
        // Use this for non human tracking
        // For Object Tracking is best to look at the center of the object ...
        // 0 is Top  320 is Bottom - Convert it ==>  T:1 to B:-1
        // var Y_Error = (160.0 - ((data.PropertyTestResults[0].PropertyParent.ImageLocationTop + data.PropertyTestResults[0].PropertyParent.ImageLocationBottom) / 2.0)) / 160.0;

        // Use this for human tracking
        // ... But for Human Tracking we need to make Misty look towards the face of the person - so we choose to follow the face of the person 
        // assuming the face is located at 20% the ht of person, offset from the top of the bounding box
        var Y_Error = (160.0 - 0.8 * data.PropertyTestResults[0].PropertyParent.ImageLocationTop - 0.2 * data.PropertyTestResults[0].PropertyParent.ImageLocationBottom ) / 160.0;

        // misty.Debug(X_Error);
        // misty.Debug(Y_Error);

        // Objective is to get move Misty's head to get X and Y Errors to be close to 0.0

        // Head moves only if error is greater than threshold ; Error range is 1 to -1
        var threshold = Math.max((_params.turnInPlace || _params.followHuman) ? 0.3 : 0.2, (321.0 - widthOfHuman) / 1000.0);

        // Higher the number higher the damping - 0 damping at 1.0
        var damperGain = (_params.turnInPlace || _params.followHuman) ? 5.0 : 7.0;

        var actuateToYaw = (Math.abs(X_Error) > threshold) ? misty.Get("headYaw") + X_Error * ((misty.Get("yawLeft") - misty.Get("yawRight")) / damperGain) : null;
        var actuateToPitch = (Math.abs(Y_Error) > threshold) ? misty.Get("headPitch") - Y_Error * ((misty.Get("pitchDown") - misty.Get("pitchUp")) / 3.0) - (misty.Get("pitchDown") + misty.Get("pitchUp")) : null;
        var linearVelocity = 0;
        var angularVelocity = 0;

        // Body turns only if angle offset to human from Misty mean center-out vector is > 15 degrees else only the head looks at human
        if (Math.abs(actuateToYaw) > 15 && (_params.turnInPlace || _params.followHuman)) {
            angularVelocity = Math.sign(actuateToYaw) * Math.min(Math.abs(actuateToYaw) * 0.6, 25)
        }

        if (angularVelocity != 0) {

            // While the body is turning we dampen the head further as it is attached to the body.
            // Damp head only when  moving towards human and avoid damping on overshoot correction.
            
            // +ve => delta head change is moving left | -ve => delta head change is moving right
            // Math.sign(actuateToYaw - misty.Get("headYaw")) == Math.sign(angularVelocity)

            // Both head delta change and body angular velocity is in same direction
            if (Math.sign(actuateToYaw - misty.Get("headYaw")) == Math.sign(angularVelocity)) {
                if (Math.abs(actuateToYaw) > 40) actuateToYaw /= 1.5;
            }
            // Both head delta change and body angular velocity is in opposite direction indicating overshoot correction phase
            else {
                // actuateToYaw /= 0.8; // Reward correction
                actuateToYaw = 0; // alternate to reward correction
                angularVelocity = 0;
                if (!_params.followHuman) misty.Stop();
            }
        }

        if (_params.followHuman) {
            if (angularVelocity == 0) {
                // Change the 130 here to change the distance between Misty and the person.
                linearVelocity = (130 - widthOfHuman) * 0.5;
                // linearVelocity = (Math.abs(linearVelocity) > 5) ? Math.min(Math.abs(linearVelocity),20) * Math.sign(linearVelocity) : 0;
                linearVelocity = Math.min(Math.abs(linearVelocity), 20) * Math.sign(linearVelocity);
                linearVelocity = (Math.abs(linearVelocity) > 5) ? linearVelocity : 0 ;
            }
        }

        // DEBUG
        // misty.Debug(linearVelocity);
        // misty.Debug(angularVelocity);
        // misty.Debug(actuateToYaw);
        // misty.Debug(" ");
        
        misty.MoveHead(actuateToPitch, null, actuateToYaw, null, (actuateToYaw == 0) ? 0.75 : 0.25);
        if (_params.turnInPlace || _params.followHuman) misty.Drive(linearVelocity, angularVelocity);
        misty.RegisterTimerEvent("lostPerson", 8000, false);
    }
}

function _lostPerson() {
    misty.Debug("LOST PERSON");
    // misty.Debug(misty.Get("nowTracking"));
    // misty.Set("nowTracking", -1, false);
    misty.Stop();
    
}

// ============================ Head Calibrate =============================

// Register listener for head yaw position from ActuatorPosition events
function registerHeadYaw() {
    misty.AddReturnProperty("headYaw", "SensorId");
    misty.AddReturnProperty("headYaw", "Value");
    misty.AddPropertyTest("headYaw", "SensorId", "==", "ahy", "string");
    misty.RegisterEvent("headYaw", "ActuatorPosition", 100, true);
}

function _headYaw(data) {
    misty.Set("headYaw", data.AdditionalResults[1], false);
}

// Register listener for pitch position from ActuatorPosition events
function registerHeadPitch() {
    misty.AddReturnProperty("headPitch", "SensorId");
    misty.AddReturnProperty("headPitch", "Value");
    misty.AddPropertyTest("headPitch", "SensorId", "==", "ahp", "string");
    misty.RegisterEvent("headPitch", "ActuatorPosition", 100, true);
}

function _headPitch(data) {
    misty.Set("headPitch", data.AdditionalResults[1], false);
}

function initiateHeadPhysicalLimitVariables(forceCalibration = false) {

    if (!forceCalibration) {
        var allLongTermVariables = misty.Keys();
        if (allLongTermVariables.includes("yawright") && allLongTermVariables.includes("yawleft") && allLongTermVariables.includes("pitchdown") && allLongTermVariables.includes("pitchup")) {
            misty.Debug("Head calibration limits loaded from Long Term Memory");
        } else {
            misty.Debug("Head calibration data is unavailable and now initiating calibrating");
            _ = calibrate();
        }
    } else {
        _ = calibrate();
    }
    misty.Pause(500);
    return 0;
}

function calibrate() {
    _ = moveHeadAndRecordPosition(0, 0, -90, "yawRight", "headYaw");
    _ = moveHeadAndRecordPosition(0, 0, 90, "yawLeft", "headYaw");
    _ = moveHeadAndRecordPosition(90, 0, 0, "pitchDown", "headPitch");
    _ = moveHeadAndRecordPosition(-90, 0, 0, "pitchUp", "headPitch");

    misty.Debug("CALIBRATION COMPLETE");
    misty.MoveHead(0, 0, 0, null, 2);
    return 0;
}

function moveHeadAndRecordPosition(pitch, roll, yaw, outputSetTo, inputFrom) {
    misty.MoveHead(pitch, roll, yaw, null, 2);
    misty.Pause(4000);
    misty.Set(outputSetTo, misty.Get(inputFrom), true);
    misty.Debug(outputSetTo + " Recorded :" + misty.Get(outputSetTo).toString());
    return 0;
}

// function registerRobotYaw() {
//     misty.RegisterEvent("robotYaw", "IMU", 100, true);
// }

// function _robotYaw() {
//     var yaw = data.PropertyTestResults[0].PropertyParent.Yaw;
//     if (yaw > 180) yaw -= 360;
//     misty.Set("robotYaw", yaw);
// }

// function offsetHeading(to_offset) {
//     var heading = (misty.Get("robotYaw") + to_offset) % 360;
//     return heading > 180 ? heading - 360 : (heading < -180 ? heading + 360 : heading);
// }
// var angle = 30;
// var targetRobotYaw = offsetHeading(angle);
// var duration = Math.abs(angle) * 60;
// misty.DriveArc(targetRobotYaw, 0.0, duration, false);

function registerSystemHazardNotification() {
    misty.AddReturnProperty("HazardNotification", "DriveStopped");
    misty.RegisterEvent("HazardNotification", "HazardNotification", 10, true);
}

function _HazardNotification(data) {
    
    var safe = true;
    data.AdditionalResults.forEach(sensor => {
        sensor.forEach(sensorData => {
            if (sensorData.InHazard) safe = false;
        });
    });

    if (!safe) misty.PlayAudio("s_PhraseUhOh.wav");
}

/* Other Objects Misty can Track
person
bicycle
car
motorcycle
airplane
bus
train
truck
boat
traffic light
fire hydrant
stop sign
parking meter
bench
bird
cat
dog
horse
sheep
cow
elephant
bear
zebra
giraffe
backpack
umbrella
handbag
tie
suitcase
frisbee
skis
snowboard
sports ball
kite
baseball bat
baseball glove
skateboard
surfboard
tennis racket
bottle
wine glass
cup
fork
knife
spoon
bowl
banana
apple
sandwich
orange
broccoli
carrot
hot dog
pizza
donut
cake
chair
couch
potted plant
bed
dining table
toilet
tv
laptop
mouse
remote
keyboard
cell phone
microwave
oven
toaster
sink
refrigerator
book
clock
vase
scissors
teddy bear
hair drier
toothbrush
*/
