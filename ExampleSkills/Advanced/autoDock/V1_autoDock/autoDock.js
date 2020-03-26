/*
*    Copyright 2020 Misty Robotics, Inc.
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

// This skill enables you to drive Misty on a specific path and dock on the wirless charger. 
// Most of the math is handled by the skill and you can directly jump in on writing code for your path.

// The 4 commands you need: ( ? indicates optional parameter )
// _ = drive()    parameters:  (float_distance_in_m, slow? = bool_default_false , hazardFree? = bool_default_false )
// _ = turn()     parameters:  (int_angle_in_degrees , hazardFree? = bool_default_false)
// _ = dock()     parameters:  (hasGuideRail? = bool_default_false)
// _ = undock()   parameters:  None

// Skip the next 4 lines and start writing your code
try {
    misty.UnregisterAllEvents();
} catch (e) {}
_ = initializeRequiredSensorCallbacks();

// USER INPUT (more info in readme)
// Enter Pitch, Roll, Yaw values in the same order for your robot that makes the glass plane
// on Misty's visor look almost parallel to the docking station wall that has the 4 passive IR 
// reflectors; make pitch value slightly higher to make Misty look slightly downwards (maybe +2)
// Hint: Use moveHead option in the API explorer from SDK webpage to play around these values. 
// http://sdk.mistyrobotics.com/api-explorer/index.html
headCenterIdentified(enter_pitch_value, enter_roll_value, enter_yaw_value);
// Example:
// headCenterIdentified(6, 0, 4);

// ADD YOUR CODE HERE - START ===================================

// This is the same code used in the Dock and Circuit video
// Feel free to remove this use it as you like ; This could 
// even be a skill you call just to dock Misty on the charger
function loop() {
    _ = undock();
    _ = circuit();
    _ = dock();
    misty.Pause(3000);
    loop();
}
loop();

function circuit() {
    _ = drive(2.3);
    _ = turn(-90);
    _ = drive(0.9);
    _ = turn(90);
    _ = drive(0.5);
    _ = turn(90);
    _ = drive(0.9);
    _ = turn(90);
    _ = drive(2.2);
    return 0;
}

// ADD YOUR CODE HERE - END ======================================

// This function docks Misty on the docking station 
// Use 3D printed block for very accurate docking ; not mandatory 
function dock(hasGuideRail = false) {

    // Look Straight
    misty.MoveHead(misty.Get("HP"), misty.Get("HR"), misty.Get("HY"), null, .5);

    // Start Docker Tracking Sensor
    misty.StartLocatingDockingStation();

    // Check if Misty can see docker or try to find it
    _ = findDocker();
    
    // Turm to look at Docker with goal of makeing xOffset = 0
    _ = lookAtCharger();

    // Wait for measurement data to stabilize
    misty.Pause(2000);
    _ = letDockerTrackerStabilize();

    // Get updated zOffset xOffset lookAtChargerOffset and yRotation measurements
    var yRotation = misty.Get("yRotation");
    var xOffset = misty.Get("xOffset");
    var zOffset = Math.abs(misty.Get("zOffset"));
    var lookAtChargerOffset = misty.Get("lookAtChargerOffset");

    // Calculate inner angle between Misty Z axis and the XY plane of the docking station
    var angleInside = -1.0 * Math.sign(yRotation) * 90.0 + yRotation;
    
    // Calculate Ground Plane distances along Docking Station X and Z axis to Misty
    var hDrive = Math.abs(xOffset) + 0.035; // 3.5cm correction accounts for offset of Misty Camera frame along X axis from the centre of Misty 
    var vDrive = Math.abs(zOffset); 
    
    // Debug
    // misty.Debug("X: " + xOffset.toFixed(2).toString() + " Z:" + zOffset.toFixed(2).toString() + " Yrot:" + yRotation.toFixed(2).toString() + " Look@:" + lookAtChargerOffset.toFixed(2).toString())
    misty.Debug("Angle Inside Cone");
    misty.Debug(angleInside);
    misty.Debug("HDrive");
    misty.Debug(hDrive);
    misty.Debug("VDrive");
    misty.Debug(vDrive);

    // Drive to a point in line with docker z axis and face the docker
    if (!(Math.abs(xOffset) < 0.15)) {
        _ = turn(angleInside);
        _ = drive(hDrive);
        _ = turn(Math.sign(angleInside) * -90.0);
        _ = lookAtCharger();
    }
    
    // Look down and Drive close to docking station 
    misty.MoveHead(misty.Get("HP") + 18, misty.Get("HR"), misty.Get("HY"), null, 1);
    misty.MoveHead(misty.Get("HP") + 18, misty.Get("HR"), misty.Get("HY"), null, 1);
    misty.MoveHead(misty.Get("HP") + 18, misty.Get("HR"), misty.Get("HY"), null, 1);
    // _ = drive(vDrive - .20); // original dock code - works without guide rail

    // Mod - remove after gaining ability to get close
    if (vDrive - .50 > 0) {
        _ = drive(vDrive - .50);
        _ = lookAtCharger();
    }

    // Turn off hazards so we can dock
    turnOffHazard();

    // Make a final correction and dock 
    // _ = lookAtCharger(); // original dock code - works without guide rail
    misty.Drive(5, 0);
    misty.Drive(5, 0);

    _ = waitForContact();
    if (!hasGuideRail) {
        _ = alighToDock();
        misty.Pause(2000);
        _ = drive(-0.06);
    }
    unregisterBumpSensors();
    
    // Check of Charging 
    registerChargeStatus();
    if (!checkIfCharging()) {
        unregisterChargeStatus();
        _ = retryDocking(hasGuideRail);
    }
    unregisterChargeStatus();

    // If charge successful stop chager locating sensor
    misty.StopLocatingDockingStation();
    
    // Turn on hazard system back to default
    turnOnHazard();

    // Look Straight
    misty.MoveHead(misty.Get("HP"), misty.Get("HR"), misty.Get("HY"), null, .5);

    misty.Debug("Docking Successful");
    return 0
}

function undock() {
    turnOffHazard();
    _ = drive(-0.4, slow = true);
    _ = turn(90);
    _ = turn(90);
    turnOnHazard();
    return 0;
}

// Misty reattempts to dock if charging check fails
function retryDocking(hasGuideRail) {
    misty.Debug("Reattempting Docking - Misty was not charging at the end of procedure");
    _ = drive(-0.4, slow = true);
    _ = drive(-0.7);
    _ = dock(hasGuideRail);
    return 0;
}

function turnOnHazard() {
    misty.UpdateHazardSettings(true, false, false, null, null);
}

function turnOffHazard() {
    misty.UpdateHazardSettings(false, true, true, null, null);
}

// Docking - subfunction 
// After final drive into the charging pad initiated, 
// wait till one of the front bump sensor hit the wall of the charger 
function waitForContact() {

    misty.Debug("Waiting for contact with Dockers");
    registerBumpSensors();
    
    misty.Set("bumpFL", false, false);
    misty.Set("bumpFR", false, false);

    // wait until contact is made
    while (!misty.Get("bumpFL") && !misty.Get("bumpFR")) {
        misty.Pause(500);
    }

    return 0;
}

// Docking - subfunction - without guide rail
// Corrects alignment by making sure both bump sensors touch 
// the wall of the charging pad
function alighToDock() {

    misty.Debug("Aligning Misty to Docker");

    if (misty.Get("bumpFL")) {
        misty.Debug("Forcing FR contact");
        misty.DriveTrack(0, 100);
        misty.DriveTrack(0, 100);
        while (!misty.Get("bumpFR")) {
            misty.Pause(500);
        }
        misty.Stop();
        misty.Pause(1000);
    } else if (misty.Get("bumpFR")) {
        misty.DriveTrack(100, 0);
        misty.DriveTrack(100, 0);
        misty.Debug("Forcing FL contact");
        while (!misty.Get("bumpFL")) {
            misty.Pause(500);
        }
        misty.Stop();
        misty.Pause(1000);
    } else {
        misty.Debug("ERROR in recording intial contact with Dock");
    }
    return 0;
}

// NEEDS WORK
// Docking - subfunction
// Once docking procedure is requested this function looks to check if 
// docker is already in view; if not, look around to find it
function findDocker() {

    // Waits max 5 seconds to let sensor start and stream docker location data
    misty.Debug("Checking if docker is in view");    
    dockerInView = checkIfDockerInView(5); 
    
    // Docker is in view
    if (dockerInView) {
        // Wait for data to stabilize
        _ = letDockerTrackerStabilize();
    }
    // Docker is not in view
    else {

        misty.Debug("Trying to find docker");
        misty.Drive(0, 10);

        while (secondsSinceDockerUpdate > 2.0) {
            misty.Pause(500);
        }
        misty.Stop();
        misty.Pause(1000);
        misty.Debug("Found the docking station");
        // Wait for data to stabilize
        _ = letDockerTrackerStabilize();
    }

    return 0;
}

function checkIfDockerInView(timeoutInSeconds = 5) {
    _ = resetDockerParameters();
    var counter = 0;
    while (secondsSinceDockerUpdate() > 3 || !misty.Get("dockerTrackerIsConfident")) {
        misty.Pause(1000);
        counter += 1;
        if (counter >= timeoutInSeconds) {
            misty.Debug("Docker not in View");
            break;
        }
    }
    return !(counter >= timeoutInSeconds); 
}

// A check to make sure we are not looking at old data
function secondsSinceDockerUpdate() {
    return Math.round((new Date() - new Date(misty.Get("lastDockerUpdate"))) / 1000)
}

// The docker tracker measuremnts boounces with anomalies
// This function waits until measurements fall inside the desired std deviation 
function letDockerTrackerStabilize() {
    
    _ = resetDockerParameters();
    misty.Debug("Waiting for tracker values to stabilize");

    while (!misty.Get("dockerTrackerIsConfident")) {
        // misty.Debug("X: " + misty.Get("xOffset").toFixed(2).toString() + " Z:" + misty.Get("zOffset").toFixed(2).toString() + " Yrot:" + misty.Get("yRotation").toFixed(2).toString() + " Look@:" + misty.Get("lookAtChargerOffset").toFixed(2).toString() + " " + misty.Get("lastDockerUpdate"));
        misty.Pause(1000);
    }
    return 0;

}

// This function turns Misty to look straight at the docking station
function lookAtCharger() {
    
    _ = letDockerTrackerStabilize();

    var scanRange = 50.0 // In degrees
    var startHeading = misty.Get("robotYaw");
    // (Math.abs( headingError(startHeading) ) < scanRange) ? 1.0 : -1.0 )

    do {
        var offset = misty.Get("lookAtChargerOffset");
        misty.Debug(offset);
        misty.Drive(0, Math.sign(offset) * 2 );
        misty.Pause(50);
    }

    while (Math.abs(misty.Get("lookAtChargerOffset")) > 0.01); // 0.03 accounts for camera offset from the centre of the robot
    misty.Stop();
    misty.Pause(1000);
    misty.Debug("Facing charger phase complete!");
    return 0;
}

// Checks is Misty is charging at the end of dock procedure
function checkIfCharging() {
    misty.Debug("Checking if charging");
    var counter = 0;
    while (counter < 6) {
        if (misty.Get("isCharging")) {
            break;
        }
        counter += 1;
        misty.Pause(1000);
    }
    return (counter >= 6) ? false : true;
}

function registerChargerPoseMessage() {
    misty.RegisterEvent("ChargerPose", "ChargerPoseMessage", 10, true);
}

function unRegisterChargerPoseMessage() {
    misty.UnregisterEvent("ChargerPose");
}

// Estimates robot offset from charging station
function _ChargerPose(data) {

    // The matrix is returned as an array following column first indexing
    let arrayT = data.PropertyTestResults[0].PropertyParent.HomogeneousMatrix;

    // Inverse Kinematics: (Input: MistyTransformCharger mTc) -> (Output: ChargerTransformMisty cTm)
    // Euler Rotation Order: XYZ

    // Calculating rotation of Misty's Camera frame alone X Y and Z axis of the docking startion coordinate frame
    // xRotation = radToDeg(Math.atan2(arrayT[9], arrayT[10]));
    let yRotation = radToDeg(Math.atan2(-1.0 * arrayT[8], Math.sqrt((arrayT[0] * arrayT[0]) + (arrayT[4] * arrayT[4]))));
    // zRotation = radToDeg(Math.atan2(arrayT[4], arrayT[0]));
    
    // Calculating offset in distance (unit m) of Misty's Camera frame alone X Y and Z axis of the docking startion coordinate frame
    let xOffset = ((arrayT[12] + 0.03) * -arrayT[0]) + (arrayT[13] * -arrayT[1]) + (arrayT[14] * -arrayT[2]);// * Math.sin(DegToRad(90 - yRotation));
    // yOffset =  (arrayT[12] * -arrayT[4])         + (arrayT[13] * -arrayT[5]) + (arrayT[14] * -arrayT[6]);
    let zOffset =  (arrayT[12] * -arrayT[8])         + (arrayT[13] * -arrayT[9]) + (arrayT[14] * -arrayT[10]) ;//* Math.sin(DegToRad(90 - xRotation));

    // Calculate the X offset from the origing of the docking stations frame to Z axis of Misty's camera frame along a projected Misty Camera XY plane passing through 0,0,0 of Docker Frame
    // Used to make Misty straight at docking station 
    let lookAtChargerOffset = -1.0 * (arrayT[12] + 0.035) * (arrayT[0] + arrayT[1] + arrayT[2]) * Math.sin(DegToRad(90 - yRotation)); 

    // Pull history of tracker measurementss
    var distanceHistory = JSON.parse(misty.Get("distanceHistory"))["data"];
    var yrotHistory = JSON.parse(misty.Get("yrotHistory"))["data"];

    // update history with new measurements
    distanceHistory.shift();
    distanceHistory.push(xOffset * zOffset);
    yrotHistory.shift();
    yrotHistory.push(yRotation);

    // Push updated history into global memory
    misty.Set("distanceHistory", JSON.stringify({
        "data": distanceHistory
    }), false);
    misty.Set("yrotHistory", JSON.stringify({
        "data": yrotHistory
    }), false);

    // Check if data looks consistent and update global confidence on Tracker Measurements 
    if (stdDeviation(distanceHistory) < 0.02 && stdDeviation(yrotHistory) < 1.0 && zOffset != 0.0 && yRotation != 0.0) {

        // if (!misty.Get("dockerTrackerIsConfident")){
            misty.Set("dockerTrackerIsConfident", true, false);
        // }

    } else 
    {
        // if (misty.Get("dockerTrackerIsConfident")) {
            misty.Set("dockerTrackerIsConfident", false, false);
        // }
    }

    // Update Global Values
    misty.Set("lookAtChargerOffset", lookAtChargerOffset, false);
    misty.Set("xOffset", xOffset, false);
    misty.Set("zOffset", zOffset, false);
    misty.Set("yRotation", yRotation, false);
    misty.Set("lastDockerUpdate", (new Date()).toUTCString());
    
    // DEBUG
    // misty.Debug("Conf: " + (stdDeviation(distanceHistory) < 0.02 && stdDeviation(yrotHistory) < 1.0).toString() + " Dist: " + stdDeviation(distanceHistory).toFixed(2).toString() + " Yrot: " + stdDeviation(yrotHistory).toFixed(2).toString());
    // misty.Debug("X: " + xOffset.toFixed(2).toString() + " Z:" + zOffset.toFixed(2).toString() + " Yrot:" + yRotation.toFixed(2).toString() + "Look@:" + lookAtChargerOffset.toFixed(2).toString());
    // misty.Debug("Translation -> X:"+xOffset.toFixed(2).toString() + " Y:" + yOffset.toFixed(2).toString() + " Z:" + zOffset.toFixed(2).toString());
    // misty.Debug("Rotation    -> R:" +zRotation.toFixed(2).toString() + " Y:" + yRotation.toFixed(2).toString() + " P:" + xRotation.toFixed(2).toString());
}

// Converts degrees to radians.
function DegToRad(degrees) {
    return degrees * Math.PI / 180;
};

// Converts radians to degrees.
function radToDeg(radians) {
    return radians * 180 / Math.PI;
};

// Returns mean value of a number array
function mean(array) {
    var sum = 0
    for (let index = 0; index < array.length; index++) {
        sum += array[index]
    }
    return sum / array.length;
}

// Returns the standard deviation fo a number array
function stdDeviation(array) {
    const meanValue = mean(array);
    var numerator = 0; // sum(sqr(value-mean))
    for (let index = 0; index < array.length; index++) {
        numerator += Math.pow(array[index] - meanValue, 2)
    }
    return Math.abs(Math.sqrt(numerator / array.length));
}

// Due to some calibration mismatch each robot's head 0,0,0 position 
// is slightly different. For a perfect docking we need the camera plane
// on the head visor to be parallel with the charger wall with IR reflectors.
// Enter the values for pitch roll yaw that best works to get Misty's head 
// to look stright ahead.
function headCenterIdentified(pitch, roll, yaw) 
{
    misty.Set("HP", pitch, false);
    misty.Set("HR", roll, false);
    misty.Set("HY", yaw, false);
}

// Resets head, arm, LED and puts a Joy face on Misty
function bodyHomeState() {
    misty.MoveHead(misty.Get("HP"), misty.Get("HR"), misty.Get("HY"), null, .5);
    misty.DisplayImage("e_joy.jpg");
    misty.ChangeLED(0, 255, 0);
    misty.MoveArm("both", 80, 40);
    return 0;
}

function initializeGlobalVariables() {
    _ = bodyHomeState();
    misty.Set("encStartLeft", 0, false);
    misty.Set("encStartRight", 0, false);
    misty.Set("encLeft", 0, false);
    misty.Set("encRight", 0, false);
    misty.Set("robotYaw", 0.0, false);
    misty.Set("robotYawVelocity", 0.0, false);
    misty.Set("hazardDetected", false, false);
    misty.Set("globalYawCorrection", 0.0, false);
    _ = resetDockerParameters();
    return 0;
}

// Global parameters just specific to docking
function resetDockerParameters()  {
    misty.Set("dockerTrackerIsConfident", false, false);
    var tPlus10s = new Date();
    tPlus10s.setSeconds(tPlus10s.getSeconds() + 10);
    misty.Set("lastDockerUpdate", tPlus10s.toUTCString());
    misty.Set("xOffset", 0.0, false);
    misty.Set("zOffset", 0.0, false);
    misty.Set("yRotation", 0.0, false);
    misty.Set("lookAtChargerOffset", 0.0, false);
    misty.Set("distanceHistory", JSON.stringify({"data": [0.0, 0.0, 0.0, 0.0, 0.0]}), false);
    misty.Set("yrotHistory", JSON.stringify({"data": [0.0, 0.0, 0.0, 0.0, 0.0]}), false);
    misty.Set("bumpFL", false, false);
    misty.Set("bumpFR", false, false);
    misty.Set("isCharging", false, false);
    return 0;
}

function initializeRequiredSensorCallbacks() {
    _ = initializeGlobalVariables();
    registerEncoder();
    registerIMU();
    registerHazard();
    registerChargerPoseMessage();
    misty.Pause(1000);
    return 0;
}

function registerBumpSensors() {
    misty.AddReturnProperty("BumpSensorMessage", "sensorName");
    misty.AddReturnProperty("BumpSensorMessage", "IsContacted");
    misty.RegisterEvent("BumpSensorMessage", "BumpSensor", 10, true);
}

function unregisterBumpSensors() {
    misty.UnregisterEvent("BumpSensorMessage");
}

// Used only to correct and align Misty with docker 
function _BumpSensorMessage(data) {

    var sensor = data.AdditionalResults[0];
    var isPressed = data.AdditionalResults[1];
    isPressed ? misty.Debug(sensor + " is Pressed") : misty.Debug(sensor + " is Released");

    if (isPressed) {
        if (sensor == "Bump_FrontRight") {
            misty.Stop();
            misty.Pause(1000);
            misty.Set("bumpFR", true, false);
        } else if (sensor == "Bump_FrontLeft") {
            misty.Stop();
            misty.Pause(1000);
            misty.Set("bumpFL", true, false);
        } else {
            misty.Debug("Sensor Name Unknown");
        }
    }
}

function registerChargeStatus() {
    misty.AddReturnProperty("BatteryChargeMessage", "isCharging");
    misty.RegisterEvent("BatteryChargeMessage", "BatteryCharge", 500, true);
}

function unregisterChargeStatus() {
    misty.UnregisterEvent("BatteryChargeMessage");
}

function _BatteryChargeMessage(data) {
    misty.Set("isCharging", data.AdditionalResults[0], false);
}

function registerEncoder() {
    misty.AddReturnProperty("DriveEncodersMessage", "LeftDistance");
    misty.AddReturnProperty("DriveEncodersMessage", "RightDistance");
    misty.RegisterEvent("DriveEncodersMessage", "DriveEncoders", 25, true);
}

function _DriveEncodersMessage(data) {
    misty.Set("encLeft", data.AdditionalResults[0], false);
    misty.Set("encRight", data.AdditionalResults[1], false);
    // misty.Debug(data.AdditionalResults[0]);
    // misty.Debug(data.AdditionalResults[1]); //154 90 deg
}

function registerIMU() {
    misty.AddReturnProperty("IMUMessage", "Yaw");
    misty.AddReturnProperty("IMUMessage", "yawVelocity");
    misty.RegisterEvent("IMUMessage", "IMU", 25, true);
}

function _IMUMessage(data) {
    misty.Set("robotYaw", data.AdditionalResults[0], false);
    misty.Set("robotYawVelocity", data.AdditionalResults[1], false);
    // misty.Debug(JSON.stringify(data.AdditionalResults[0]));
}

function registerHazard() {
    misty.AddReturnProperty("HazardNotificationMessage", "DriveStopped");
    misty.AddReturnProperty("HazardNotificationMessage", "TimeOfFlightSensorsHazardState");
    misty.AddReturnProperty("HazardNotificationMessage", "BumpSensorsHazardState");
    misty.RegisterEvent("HazardNotificationMessage", "HazardNotification", 10, true);
}

function _HazardNotificationMessage(data) {
    var driveStopHazardActive = screenHazard(data.AdditionalResults[0]);
    var tofHazardActive = screenHazard(data.AdditionalResults[1]);
    var bumpHazardActive = screenHazard(data.AdditionalResults[2]);

    // On drive-stop because of hazard we update the global state of hazardDetected
    if (!misty.Get("hazardDetected")) {
        if (driveStopHazardActive) // || (tofHazardActive && robotVelocity))
        {
            misty.Set("hazardDetected", true, false);
            misty.Debug("Hazard Detected");
            misty.ChangeLED(255, 0, 0);
        }
    }

    // On hazard clearing we update the global state of hazardDetected 
    else //if (misty.Get("hazardDetected")) 
    {
        misty.Debug("tof hazard: " + tofHazardActive.toString());
        misty.Debug("bump hazard: " + bumpHazardActive.toString());
        if (!tofHazardActive && !bumpHazardActive) {
            misty.Set("hazardDetected", false, false);
            misty.Debug("Hazard Cleared");
            misty.ChangeLED(0, 255, 0);
        }
    }
}

// Helper function to iterate through each sensors hazard state
function screenHazard(eventMessage) {
    var hazardDetected = false;
    eventMessage.forEach(sensor => {
        // sensor.forEach(sensorData => {
        if (sensor.InHazard) hazardDetected = true
        // });
    });
    return hazardDetected;
}

// Main drive straight method
function drive(distance, slow = false, hazardFree = false) {
    
    // Turn off hazard if driving in hazard free mode
    if (hazardFree) {
        turnOffHazard();
    }

    misty.Debug("Driving " + distance.toString() + " m");

    misty.Debug("Yaw at start of drive :" + misty.Get("robotYaw").toString());
    const startEncYaw = misty.Get("robotYaw");

    // Trim correction  
    //Forward 1m reads 1036 encoder distance and Reverse 1m reads 973 encoder ticks 
    if (distance < 0) distance *= 1.063;

    // Calculate time taken to complete drive 
    // 5000 here determines speed in  inverse proportion, Feel free to change it 
    var duration = Math.abs(distance) * slow ? 10000 : 5000;
    var reverse = distance < 0;

    // Issue drive command
    misty.DriveHeading(misty.Get("robotYaw"), Math.abs(distance), duration, reverse);

    // Check if any obstacle got in the way and stopped drive before target destination was reached
    if (checkIfDriveCompleted(distance, duration + 1000)) {
        // Drive completed 
        misty.Debug("Yaw at end of drive :" + misty.Get("robotYaw").toString());

        // Correct any angle offsets
        _ = performAngleCorrectionIfNecessary(startEncYaw);

        // End drive sequence
        misty.Debug("Drive Successfully Completed!");
        misty.Pause(1000);

        // Turn on hazard if driving in Hazard Free mode
        if (hazardFree) {
            turnOnHazard();
        }
        return true;
    } else {
        // Wait for hazard to clear
        misty.Debug("Waiting for Hazard to clear");
        while (misty.Get("hazardDetected")) misty.Pause(500);
        // Drive the remaining distance
        reAttemptDrive(distance);
    }
}

// Method checks if any obstacle got in the way and stopped drive before target destination was reached
function checkIfDriveCompleted(distance, time) {
    misty.Pause(500);

    var driveComplete = true;
    for (var index = 0; index < time / 50; index++) {
        if (!misty.Get("hazardDetected")) misty.Pause(50)
        else {
            driveComplete = false;
            break;
        }
    }
    if (!encoderDataAcceptable(distance) && driveComplete) driveComplete = false;
    return driveComplete;
}

// At the end of path checks if encoders read aboout the expected value
function encoderDataAcceptable(distance) {
    misty.Debug("Encoder Error: " + getEncoderError(distance).toString());
    if (Math.abs(getEncoderError(distance)) <= 50) return true
    else return false;
}

// An obstacle was encounter in path, Misty uses this Method to complete the rest of the path when obstacle clears
function reAttemptDrive(distance) {
    misty.Debug("Re-attemptinig to complete rest of " + (Math.sign(distance) * getEncoderError(distance) / 1000.0).toString() + " m");
    drive(Math.sign(distance) * getEncoderError(distance) / 1000.0);
}

// Helper function that calculates offset between estimated encoder position and actual encoder position
function getEncoderError(distance) {
    var desiredEncoderDistance = Math.abs((distance >= 0) ? distance : distance / 1.063) * 1036;
    var actualEncoderDistanceCompleted = Math.abs(misty.Get("encLeft") + misty.Get("encRight")) / 2.0;
    return desiredEncoderDistance - actualEncoderDistanceCompleted;
}

// Correct minor yaw drifts at the end of motion
function performAngleCorrectionIfNecessary(desiredYaw) {
    if (Math.abs(headingError(desiredYaw)) > 0.15) misty.Drive(0, Math.sign(headingError(desiredYaw)) * 1);
    while ((Math.abs(headingError(desiredYaw)) > 0.15)) misty.Pause(10);
    misty.Stop();
    misty.Pause(1000);
    misty.Debug("Yaw at end of fine correction :" + misty.Get("robotYaw").toString());
    return 0;
}

// Main turn angle method
function turn(angle, hazardFree = false) {

    // Turn off hazard if driving in hazard free mode
    if (hazardFree) {
        turnOffHazard();
    }

    misty.Debug("Turning " + angle.toString());
    // misty.Set("globalYawCorrection", ((360.0 + ((misty.Get("globalYawCorrection") + angle) % 360)) % 360.0), false);

    // Converting angle offset to global robot frame yaw
    var targetRobotYaw = offsetHeading(angle);
    // Change 60 to change speed of turn
    var duration = Math.abs(angle) * 60;

    // Issue turn command
    misty.DriveArc(targetRobotYaw, 0.0, duration, false);

    // Check if any obstacle got in the way and stopped drive before target angle was reached
    if (checkIfTurnCompleted(targetRobotYaw, duration)) {
        // _ = performAngleCorrectionIfNecessary(misty.Get("globalYawCorrection"));
        misty.Debug("Turn Successfully Completed!");
        misty.Pause(1000);

        // Turn on hazard if driving in Hazard Free mode
        if (hazardFree) {
            turnOnHazard();
        }
        return true;
    } else {
        // Wait for hazard to clear
        misty.Debug("Waiting for Hazard to clear");
        while (misty.Get("hazardDetected")) misty.Pause(500);

        // Drive the remaining distance
        reAttemptTurn(targetRobotYaw);
    }
}

// Check if any obstacle got in the way and stopped drive before target angle was reached
function checkIfTurnCompleted(targetRobotYaw, duration) {
    misty.Pause(500);

    var turnCompleted = false;
    for (let index = 0; index < (duration + 12000) / 50; index++) {
        // Check if IMU reads desirred yaw with a tolerance of 3 degrees
        // Convert target yaw from 0 to +-180 range => 0  to 360 range

        // Successfully reached target angle
        if (Math.abs(headingError(targetRobotYaw)) <= 0.15) {
            misty.Stop();
            misty.Pause(1000);
            turnCompleted = true;
            break;
        }
        // Small enough error and cannot move - Brute Force correction
        else if (Math.abs(headingError(targetRobotYaw)) < 5 && misty.Get("robotYawVelocity") == 0) {
            misty.Pause(1000);
            misty.Drive(0, Math.sign(headingError(targetRobotYaw)) * 1);
        } else {}
        // Hazard activated mid-way in turn
        if (misty.Get("hazardDetected")) {
            turnCompleted = false;
            break;
        }
        misty.Pause(50);
    }
    return turnCompleted;
}

// On an obstacle was encounter during, Misty uses this Method to complete the rest of the turn when obstacle clears
function reAttemptTurn(targetRobotYaw) {
    // Convert target yaw from 0 to +-180 range => 0  to 360 range
    var angleToReattempt = headingError(targetRobotYaw);
    misty.Debug("Re-attempting to turn " + angleToReattempt + "degrees");
    turn(angleToReattempt);
}

function headingError(targetRobotYaw) {
    // Convert target yaw from 0 to +-180 range => 0  to 360 range
    var delta = ((360.0 + (targetRobotYaw % 360)) % 360.0) - misty.Get("robotYaw");
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    return delta;
}

// Converting angle offset to global robot frame yaw
function offsetHeading(to_offset) {
    var heading = (misty.Get("robotYaw") + to_offset) % 360;
    return heading > 180 ? heading - 360 : (heading < -180 ? heading + 360 : heading);
}