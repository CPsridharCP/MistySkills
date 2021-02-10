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

// This example shows how to use Misty's onboard Human Pose Estimation

// For an advanced implementation example check here:
// https://github.com/CPsridharCP/MistySkills/tree/master/ExampleSkills/Advanced/waveBack

start_human_pose_estimation()

// Human Pose Estimation
function start_human_pose_estimation() {
    // Argument 1: Data from human pose estimation is streamed into the callback function
    // Argument 2: Event Name (do not change this) 
    // Argument 3: Debounce in milliseconds (least time between updates)
    // Argument 4: Live forever
    misty.RegisterEvent("human_pose_estimation", "PoseEstimation", 100, true);
    
    // Argument 1: Minimum confidence required (float) 0.0 to 1.0 
    // Argument 2: ModelId (int) 0 or 1
    // Argument 3: (optional) DelegateType (int) - 0 (CPU), 1 (GPU), 2 (NNAPI), 3 (Hexagon)  
    misty.StartPoseEstimation(0.2, 0, 1);
}

// Event callbacks need to be prefixed with an _
function _human_pose_estimation(data) {
    
    var keypoints = data.PropertyTestResults[0].PropertyParent.keypoints;

    // Keypoints - Index Map
    // 0  : NOSE
    // 1  : LEFT_EYE
    // 2  : RIGHT_EYE
    // 3  : LEFT_EAR
    // 4  : RIGHT_EAR
    // 5  : LEFT_SHOULDER
    // 6  : RIGHT_SHOULDER
    // 7  : LEFT_ELBOW
    // 8  : RIGHT_ELBOW
    // 9  : LEFT_WRIST
    // 10 : RIGHT_WRIST
    // 11 : LEFT_HIP
    // 12 : RIGHT_HIP
    // 13 : LEFT_KNEE
    // 14 : RIGHT_KNEE
    // 15 : LEFT_ANKLE
    // 16 : RIGHT_ANKLE

    // Each message contains info on all these keypoints
    // If you would like to look at data about left shoulder's position which is it index 5

    misty.Debug(JSON.stringify(keypoints[5]));

    // {
    // bodyPart: 5
    // confidence: 0.8205725
    // imageX: 191
    // imageY: 253
    // pitch: 0.003858468
    // yaw: -0.126723886 
    // }

    var confidence = keypoints[5].confidence;
    var x_position = keypoints[5].imageX;
    var y_position = keypoints[5].imageY;

}