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

/*
In this skill Misty used two onboard AI Capabilities 
1. Object Detection 
2. Human Pose Estimation

Object Detection is used to make Misty look at the closest person. Misty can detect 
about 70 objects and provide bounding box data for each. For this specific skill I only
wanted Misty to find Human. Hence I specifically look for the 1 human object and ignore 
the rest.

Human pose estimation is used to detect the ~waving arm gesture. The event provides 16 
keypoints per message like nose, eye, ear, shoulder, elbow, wrist, hip, ankle etc.. 
Using these keypoints, logic can be built to detect specific gestures. I wrote a very simple
one to detect a waving action so that Misty can wave back when someone stop to say hi to her,

My simplpest logic: 
Elbow is lower than Shoulder && Shoulder is lower than Wrist

^ Feel free to modify this and play with more keypoints

Audio:
- You can use the rear two bump sensors to increase/decrease volume
- In the JSON, set parameter "silent_mode" to true if you do not want Misty to play audio. 
*/

misty.Debug("Wave Back Skill Start!!");
start();

function start() {

    default_body();
    misty.GetVolume();

    // Head calibration and events
    register_head_pitch();
    register_head_yaw();
    misty.Pause(1000);
    _ = initiate_head_physical_limit_variables(forceCalibration = _params.forceHeadCalibration);

    // Person Detection
    misty.Set("person_width_history", JSON.stringify([0, 0, 0, 0]), false)
    misty.Set("last_person_update_at", (new Date()).toUTCString());
    start_person_tracking();

    // Human Pose Estimation
    misty.Set("waving_now", false, false);
    start_human_pose_estimation();

    // Bump Sensors for volume change
    if (!_params.silent_mode) register_bump_sensors();

    misty.Set("next_look_side", "right", false);
    misty.RegisterTimerEvent("look_side_to_side", 12000, true);
    misty.RegisterTimerEvent("move_arms_random", 6000, true);
}

// Human Pose Estimation
function start_human_pose_estimation() {
    misty.RegisterEvent("human_pose_estimation", "PoseEstimation", 100, true);
    // Arguments: Minimum Confidence (float) 0.0 to 1.0, ModelId (int) 0 or 1, DelegateType (int) - 0 (CPU), 1 (GPU), 2 (NNAPI), 3 (Hexagon)  
    misty.StartPoseEstimation(0.2, 0, 1);
}

function _human_pose_estimation(data) {
    // misty.Debug(JSON.stringify(data.PropertyTestResults[0].PropertyParent));

    // Not doing any fancy Math here.. Just checking a simple condition
    // if elbow is below shoulder and shoulder is below wrist

    var keypoints = data.PropertyTestResults[0].PropertyParent.keypoints;

    // 5,6- Shoulder; 7,8- Elbow ; 9,10- Wrist ;

    if (!misty.Get("waving_now")) {
        // Left Hand
        if (confident(keypoints[7]) && confident(keypoints[5]) && confident(keypoints[9])) {
            if (pair_correlation(keypoints[7],keypoints[5]) && pair_correlation(keypoints[5],keypoints[9])) {
                if (scale_valid(keypoints[7],keypoints[5])) {
                    wave_back("left");
                }
            }
        }
        // Right Hand
        else if (confident(keypoints[8]) && confident(keypoints[6]) && confident(keypoints[10])) {
            if (pair_correlation(keypoints[8],keypoints[6]) && pair_correlation(keypoints[6],keypoints[10])) {
                if (scale_valid(keypoints[8],keypoints[6])) {
                    wave_back("right");
                }
            }
        }
    }
}

function scale_valid(keypoint_one, keypoint_two) {
    var x_offset = keypoint_one.imageX - keypoint_two.imageX;
    var y_offset = keypoint_one.imageY - keypoint_two.imageY;
    var scaled_distance = Math.sqrt( x_offset*x_offset + y_offset*y_offset );
    if (scaled_distance > 60) return true;
    return false;
    // misty.Debug("SCLAED DISTANCE : " + scaled_distance.toString());
}

function confident(data, threshold=0.6) {
    if (data.confidence >= threshold) return true;
    return false;
} 

function pair_correlation(keypoint_one, keypoint_two) {
    if (keypoint_one.imageY > keypoint_two.imageY) return true;
    return false;
}

function wave_back(arm) {
    misty.Set("waving_now", true, false);
    misty.Set("last_wave_at", (new Date()).toUTCString());
    animate_wave_back(arm);
}

function animate_wave_back(arm) {
    misty.Debug("Waving Back!!!!");
    // Audio
    if (!_params.silent_mode) misty.PlayAudio((Math.random() >= 0.5) ? "s_Acceptance.wav" : "s_Awe.wav");

    // Display
    if ((Math.random() >= 0.5)) {
        misty.DisplayImage("e_Joy2.jpg");
        misty.TransitionLED(0, 90, 0, 0, 255, 0, "Breathe", 800);
    }
    else {
        misty.DisplayImage("e_Love.jpg");
        misty.TransitionLED(90, 0, 0, 255, 0, 0, "Breathe", 800);
    }
    
    // Arms
    if (arm == "left") {
        misty.MoveArms(80, -89, null, null, .75, null);
        misty.Pause(1000);
        misty.MoveArms(80, 0, null, null, .75, null);
        misty.Pause(750);
        misty.MoveArms(80, -89, null, null, .75, null);
    } else {
        misty.MoveArms(-89, 80, null, null, .75, null);
        misty.Pause(1000);
        misty.MoveArms(0, 80, null, null, .75, null);
        misty.Pause(750);
        misty.MoveArms(-89, 80, null, null, .75, null);
    }

    misty.Pause(2000);
    default_body();
    misty.Pause(2000);
    misty.Set("waving_now", false, false);
}

function default_body() {
    misty.DisplayImage("e_DefaultContent.jpg");
    misty.TransitionLED(0, 40, 90, 0, 130, 255, "Breathe", 1200);
    misty.MoveArms(get_random_int(70, 89), get_random_int(70, 89), null, null, 1, null);
}

// Person Tracking
function start_person_tracking() {
    misty.AddPropertyTest("person_detection", "Description", "==", "person", "string");
    misty.RegisterEvent("person_detection", "ObjectDetection", 500, true);
    misty.StartObjectDetector(0.5, 0, 15);
}

function _person_detection(data) {

    if (data.PropertyTestResults[0].PropertyParent.Confidence >= 0.6) {

        let width_of_human = data.PropertyTestResults[0].PropertyParent.ImageLocationRight - data.PropertyTestResults[0].PropertyParent.ImageLocationLeft;
        // misty.Debug(width_of_human);

        // Attempt to look just at the closest person when multiplpe people are in the FoV
        var person_width_history = JSON.parse(misty.Get("person_width_history"));
        person_width_history.shift()
        person_width_history.push(Math.floor(width_of_human))
        misty.Set("person_width_history", JSON.stringify(person_width_history), false);
        // misty.Debug(person_width_history); // DEBUG
        // misty.Debug(std_deviation(person_width_history)); // DEBUG

        // First part checks if this measurement is the closest person and second part checks if there is only one person that Misty can see
        if (Math.abs(width_of_human - Math.min(...person_width_history)) > Math.abs(width_of_human - Math.max(...person_width_history)) || std_deviation(person_width_history) <= 40) {
            // Act - This is the closest person
            // misty.Debug("Closer Person"); // DEBUG

            // 0 is Left 320 is Right  - Convert it ==>  L:1 to R:-1
            var x_error = (160.0 - ((data.PropertyTestResults[0].PropertyParent.ImageLocationLeft + data.PropertyTestResults[0].PropertyParent.ImageLocationRight) / 2.0)) / 160.0;
            var y_error = (160.0 - 1.4 * data.PropertyTestResults[0].PropertyParent.ImageLocationTop + 0.2 * data.PropertyTestResults[0].PropertyParent.ImageLocationBottom) / 160.0;
            var threshold = Math.max(0.1, (341.0 - width_of_human) / 1000.0); // WAS 321 -
            // misty.Debug("Threshold: " + threshold.toString());
            // misty.Debug("x_error: " + x_error.toString());

            var damper_gain = 6.0; // WAS 7
            var actuate_to_yaw = (Math.abs(x_error) > threshold) ? misty.Get("head_yaw") + x_error * ((misty.Get("yaw_left") - misty.Get("yaw_right")) / damper_gain) : null;
            var actuate_to_pitch = (Math.abs(y_error) > threshold) ? misty.Get("head_pitch") - y_error * ((misty.Get("pitch_down") - misty.Get("pitch_up")) / 3.0) - (misty.Get("pitch_down") + misty.Get("pitch_up")) : null;

            if ((Math.abs(misty.Get("head_pitch") - Math.round(actuate_to_pitch)) > 7  || Math.abs(misty.Get("head_yaw") - Math.round(actuate_to_yaw)) > 7)) {
                // misty.MoveHead(actuate_to_pitch, null, actuate_to_yaw, null, (actuate_to_yaw == 0) ? 0.75 : 0.25);
                misty.MoveHead(actuate_to_pitch, null, actuate_to_yaw, null, .5);
            }

        } else {
            // Measurement belongs to the not very close person
            // misty.Debug("Farther Person"); // DEBUG
        }
        misty.Set("last_person_update_at", (new Date()).toUTCString());
    }
}

// Math helpers
function mean(array) {
    return array.reduce((a, b) => a + b) / array.length;
}

function std_deviation(array) {
    const meanValue = mean(array);
    var numerator = 0; // sum(sqr(value-mean))
    for (let index = 0; index < array.length; index++) {
        numerator += Math.pow(array[index] - meanValue, 2)
    }
    return Math.abs(Math.sqrt(numerator / array.length));
}

function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Head Calibrate
// Register listener for head yaw position from ActuatorPosition events
function register_head_yaw() {
    misty.AddReturnProperty("head_yaw", "SensorId");
    misty.AddReturnProperty("head_yaw", "Value");
    misty.AddPropertyTest("head_yaw", "SensorId", "==", "ahy", "string");
    misty.RegisterEvent("head_yaw", "ActuatorPosition", 100, true);
}

function _head_yaw(data) {
    misty.Set("head_yaw", data.AdditionalResults[1], false);
}

// Register listener for pitch position from ActuatorPosition events
function register_head_pitch() {
    misty.AddReturnProperty("head_pitch", "SensorId");
    misty.AddReturnProperty("head_pitch", "Value");
    misty.AddPropertyTest("head_pitch", "SensorId", "==", "ahp", "string");
    misty.RegisterEvent("head_pitch", "ActuatorPosition", 100, true);
}

function _head_pitch(data) {
    misty.Set("head_pitch", data.AdditionalResults[1], false);
}

function initiate_head_physical_limit_variables(forceCalibration = false) {

    if (!forceCalibration) {
        var allLongTermVariables = misty.Keys();
        if (allLongTermVariables.includes("yaw_right") && allLongTermVariables.includes("yaw_left") && allLongTermVariables.includes("pitch_down") && allLongTermVariables.includes("pitch_up")) {
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
    _ = move_head_and_record_position(0, 0, -90, "yaw_right", "head_yaw");
    _ = move_head_and_record_position(0, 0, 90, "yaw_left", "head_yaw");
    _ = move_head_and_record_position(90, 0, 0, "pitch_down", "head_pitch");
    _ = move_head_and_record_position(-90, 0, 0, "pitch_up", "head_pitch");

    misty.Debug("CALIBRATION COMPLETE");
    misty.MoveHead(0, 0, 0, null, 2);
    return 0;
}

function move_head_and_record_position(pitch, roll, yaw, outputSetTo, inputFrom) {
    misty.MoveHead(pitch, roll, yaw, null, 2);
    misty.Pause(4000);
    misty.Set(outputSetTo, misty.Get(inputFrom), true);
    misty.Debug(outputSetTo + " Recorded :" + misty.Get(outputSetTo).toString());
    return 0;
}

// Random head motion when Misty does not already see a person
function _look_side_to_side() {
    if (!misty.Get("waving_now") && (new Date() - new Date(misty.Get("last_person_update_at"))) / 1000 > 4) {
        if (misty.Get("next_look_side") == "right") {
            misty.MoveHead(get_random_int(-25, -10), 0, get_random_int(-40, -20), null, 4);
            misty.Set("next_look_side", "left", false);
        } else {
            misty.MoveHead(get_random_int(-25, -10), 0, get_random_int(20, 40), null, 4);
            misty.Set("next_look_side", "right", false);
        }
    }
}

// Random arm motion
function _move_arms_random() {
    if (!misty.Get("waving_now")) misty.MoveArms(get_random_int(22, 89), get_random_int(22, 89), null, null, 1, null);
}

// Bump Sensors
// Rear two are used to adjust volume
function register_bump_sensors() {
    misty.AddReturnProperty("bump_sensor_message", "SensorName");
    misty.AddReturnProperty("bump_sensor_message", "IsContacted");
    misty.RegisterEvent("bump_sensor_message", "BumpSensor", 50, true);
}

function _bump_sensor_message(data) {
    let sensor = data.AdditionalResults[0];
    let isPressed = data.AdditionalResults[1];
    isPressed ? misty.Debug(sensor + " is Pressed") : misty.Debug(sensor + " is Released");

    if (isPressed) {
        if (sensor == "Bump_RearRight") lower_volume(true);
        else if (sensor == "Bump_RearLeft") increase_volume(true);
    }
}

// Volume
function _GetVolume(data) {
    misty.Set("current_volume", data.Result, false);
}

function lower_volume(need_feedback=true) {
    misty.Set("current_volume", Math.min(misty.Get("current_volume") + 20, 100), false);
    misty.Debug("Volume Set to : " + misty.Get("current_volume").toString());
    misty.SetDefaultVolume(misty.Get("current_volume"));
    if (need_feedback) misty.PlayAudio("s_SystemSuccess.wav");
}

function increase_volume(need_feedback=true) {
    misty.Set("current_volume", Math.max(misty.Get("current_volume") - 20, 20), false);
    misty.Debug("Volume Set to : " + misty.Get("current_volume").toString());
    misty.SetDefaultVolume(misty.Get("current_volume"));
    if (need_feedback) misty.PlayAudio("s_SystemSuccess.wav");
}

/* Notes:

Keypoints - Index Map
NOSE(0),
LEFT_EYE(1),
RIGHT_EYE(2),
LEFT_EAR(3),
RIGHT_EAR(4),
LEFT_SHOULDER(5),
RIGHT_SHOULDER(6),
LEFT_ELBOW(7),
RIGHT_ELBOW(8),
LEFT_WRIST(9),
RIGHT_WRIST(10),
LEFT_HIP(11),
RIGHT_HIP(12),
LEFT_KNEE(13),
RIGHT_KNEE(14),
LEFT_ANKLE(15),
RIGHT_ANKLE(16);

Example of Data Received under each KeyPoint
bodyPart: 0
confidence: 0.3205725
imageX: 191
imageY: 253
pitch: 0.003858468
yaw: -0.126723886
*/