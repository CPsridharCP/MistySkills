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

// The most alive dead-reckoning skill
try{misty.UnregisterAllEvents();} catch (e) {}
_ = initializeRequiredSensorCallbacks();

// Enter drive sequence using drive and turn functions.  
// _ = drive(<distance-in-meter>);  // Misty drives straight
// _ = turn(<angle>); // Misty pivot turns - angle in degrees CCW
// Misty can also stop, pause and resume path drive when Misty encounters an obstacle 

// Example Path
function drivePath()
{
    // misty.Set("globalYawCorrection", misty.Get("robotYaw"), false);
    // CP table to almost front door
    _ = drive(1.9);
    _  = turn(-90); // Right
    _ = drive(3.0);
    _ = turn(-90); // Right
    _ = drive(4.2);
    _ = turn(90); // Left
    _ = drive(4.2);
    _ = turn(-90); // Right
    _ = drive(1.2);
    _ = turn(90); // Left
    _ = drive(5.5);
}
drivePath();

function bodyHomeState()
{   
    misty.MoveHead(-10, 0, 0, null, 1);
    misty.DisplayImage("e_joy.jpg");
    misty.ChangeLED(0, 255, 0);
    misty.MoveArm("both", -30, 40);
    return 0;
}

function initializeGlobalVariables()
{
    _ = bodyHomeState();
    misty.Set("encStartLeft", 0, false);
    misty.Set("encStartRight", 0, false);
    misty.Set("encLeft", 0, false);
    misty.Set("encRight", 0, false);
    misty.Set("robotYaw", 0.0, false);
    misty.Set("robotYawVelocity", 0.0, false);
    misty.Set("hazardDetected", false, false);
    misty.Set("globalYawCorrection", 0.0, false);
    return 0;
}

function initializeRequiredSensorCallbacks()
{
    _ = initializeGlobalVariables();
    registerEncoder();
    registerIMU();
    registerHazard();
    misty.Pause(1000);
    return 0;
}

function registerEncoder()
{
    misty.AddReturnProperty("DriveEncodersMessage", "LeftDistance");
    misty.AddReturnProperty("DriveEncodersMessage", "RightDistance");
    misty.RegisterEvent("DriveEncodersMessage", "DriveEncoders", 25, true);
}

function _DriveEncodersMessage(data)
{
    misty.Set("encLeft", data.AdditionalResults[0], false);
    misty.Set("encRight", data.AdditionalResults[1], false);
    // misty.Debug(data.AdditionalResults[0]);
    // misty.Debug(data.AdditionalResults[1]); //154 90 deg
}

function registerIMU()
{
    misty.AddReturnProperty("IMUMessage", "Yaw");
    misty.AddReturnProperty("IMUMessage", "yawVelocity");
    misty.RegisterEvent("IMUMessage", "IMU", 25, true);
}

function _IMUMessage(data)
{
    misty.Set("robotYaw", data.AdditionalResults[0], false);
    misty.Set("robotYawVelocity", data.AdditionalResults[1], false);
    // misty.Debug(JSON.stringify(data.AdditionalResults[0]));
}

function registerHazard() 
{
    misty.AddReturnProperty("HazardNotificationMessage", "DriveStopped");
    misty.AddReturnProperty("HazardNotificationMessage", "TimeOfFlightSensorsHazardState");
    misty.AddReturnProperty("HazardNotificationMessage", "BumpSensorsHazardState");
    misty.RegisterEvent("HazardNotificationMessage", "HazardNotification", 10, true);
}

function _HazardNotificationMessage(data) 
{
    var driveStopHazardActive = screenHazard(data.AdditionalResults[0]);
    var tofHazardActive = screenHazard(data.AdditionalResults[1]);
    var bumpHazardActive = screenHazard(data.AdditionalResults[2]);
    
    // If hazard is not engaged we kep checking DriveStopped-HazardData to engage Hazard
    if (!misty.Get("hazardDetected"))
    {
        if (driveStopHazardActive)// || (tofHazardActive && robotVelocity))
        {
            misty.Set("hazardDetected", true, false);
            misty.Debug("Hazard Detected");
            misty.ChangeLED(255, 0, 0);
            // misty.PlayAudio("s_.wav", 100);
        }
    }

    // If hazard is engaged we kep checking BumpSensors and ToF HazardData to clear Hazard
    else //if (misty.Get("hazardDetected")) 
    {
        misty.Debug("tof hazard: " + tofHazardActive.toString());
        misty.Debug("bump hazard: " + bumpHazardActive.toString());
        if (!tofHazardActive && !bumpHazardActive)
        {
            misty.Set("hazardDetected", false, false);
            misty.Debug("Hazard Cleared");
            misty.ChangeLED(0, 255, 0);
        }
    }
}

// Helper function to iterate through each sensors hazard state
function screenHazard(eventMessage)
{
    var hazardDetected = false;
    eventMessage.forEach(sensor => {
        // sensor.forEach(sensorData => {
            if (sensor.InHazard) hazardDetected = true
            // });
    });
    return hazardDetected;
}

// Main drive straight method
function drive(distance) 
{
    misty.Debug("Driving " + distance.toString() +  " m");

    misty.Debug("Yaw at start of drive :" + misty.Get("robotYaw").toString());
    const startEncYaw = misty.Get("robotYaw");

    // Trim correction  
    //Forward 1m reads 1036 encoder distance and Reverse 1m reads 973 encoder ticks 
    if (distance < 0) distance *= 1.063; 
    
    // Calculate time taken to complete drive 
    // 5000 here determines speed in  inverse proportion, Feel free to change it 
    var duration = Math.abs(distance) * 5000;
    var reverse = distance < 0;

    // Issue drive command
    misty.DriveHeading(misty.Get("robotYaw"), Math.abs(distance), duration, reverse);
    
    // Check if any obstacle got in the way and stopped drive before target destination was reached
    if (checkIfDriveCompleted(distance, duration + 1000))
    {
        // Drive completed 
        misty.Debug("Yaw at end of drive :" + misty.Get("robotYaw").toString());

        // Correct any angle offsets
        _ = performAngleCorrectionIfNecessary(startEncYaw);

        // End drive sequence
        misty.Debug("Drive Successfully Completed!");
        misty.Pause(1000);
        return true;
    }
    else
    {
        // Wait for hazard to clear
        misty.Debug("Waiting for Hazard to clear");
        while (misty.Get("hazardDetected")) misty.Pause(500);
        // Drive the remaining distance
        reAttemptDrive(distance);
    }
}

// Method checks if any obstacle got in the way and stopped drive before target destination was reached
function checkIfDriveCompleted(distance, time)
{
    misty.Pause(500);

    var driveComplete = true;
    for (var index = 0; index < time / 50; index++) 
    {
        if (!misty.Get("hazardDetected"))misty.Pause(50)
        else 
        {
            driveComplete = false;
            break;
        }
    }
    if (!encoderDataAcceptable(distance) && driveComplete) driveComplete = false;
    return driveComplete;
}

// At the end of path checks if encoders read aboout the expected value
function encoderDataAcceptable(distance) 
{
    misty.Debug("Encoder Error: " + getEncoderError(distance).toString());
    if (Math.abs(getEncoderError(distance)) <= 50) return true
    else return false;
}

// An obstacle was encounter in path, Misty uses this Method to complete the rest of the path when obstacle clears
function reAttemptDrive(distance)
{
    misty.Debug("Re-attemptinig to complete rest of " + (Math.sign(distance) * getEncoderError(distance) / 1000.0).toString() + " m");
    drive(Math.sign(distance) * getEncoderError(distance) / 1000.0);
}

// Helper function that calculates offset between estimated encoder position and actual encoder position
function getEncoderError(distance)
{
    var desiredEncoderDistance = Math.abs((distance >= 0) ? distance : distance / 1.063) * 1036;
    var actualEncoderDistanceCompleted = Math.abs(misty.Get("encLeft") + misty.Get("encRight")) / 2.0;
    return desiredEncoderDistance - actualEncoderDistanceCompleted;
}

// Correct minor yaw drifts at the end of motion
function performAngleCorrectionIfNecessary(desiredYaw) 
{
    if (Math.abs(headingError(desiredYaw)) > 0.15) misty.Drive(0, Math.sign(headingError(desiredYaw)) * 1);
    while ((Math.abs(headingError(desiredYaw)) > 0.15)) misty.Pause(10);
    misty.Stop();
    misty.Debug("Yaw at end of fine correction :" + misty.Get("robotYaw").toString());
    return 0;
}

// Main turn angle method
function turn(angle) 
{
    misty.Debug("Turning " + angle.toString());
    // misty.Set("globalYawCorrection", ((360.0 + ((misty.Get("globalYawCorrection") + angle) % 360)) % 360.0), false);

    // Converting angle offset to global robot frame yaw
    var targetRobotYaw = offsetHeading(angle);
    // Change 60 to change speed of turn
    var duration = Math.abs(angle) * 60;  

    // Issue turn command
    misty.DriveArc(targetRobotYaw, 0.0, duration, false);

    // Check if any obstacle got in the way and stopped drive before target angle was reached
    if (checkIfTurnCompleted(targetRobotYaw, duration)) 
    {
        // _ = performAngleCorrectionIfNecessary(misty.Get("globalYawCorrection"));
        misty.Debug("Turn Successfully Completed!");
        misty.Pause(1000);
        return true;
    } 
    else 
    {
        // Wait for hazard to clear
        misty.Debug("Waiting for Hazard to clear");
        while (misty.Get("hazardDetected")) misty.Pause(500);
    
        // Drive the remaining distance
        reAttemptTurn(targetRobotYaw);
    }
}

// Check if any obstacle got in the way and stopped drive before target angle was reached
function checkIfTurnCompleted(targetRobotYaw, duration) 
{
    misty.Pause(500);

    var turnCompleted = false;
    for (let index = 0; index < (duration + 12000) / 50; index++) {
        // Check if IMU reads desirred yaw with a tolerance of 3 degrees
        // Convert target yaw from 0 to +-180 range => 0  to 360 range
        
        // Successfully reached target angle
        if (Math.abs(headingError(targetRobotYaw)) <= 0.15) 
        {
            misty.Stop();
            turnCompleted = true;
            break;
        }
        // Small enough error and cannot move - Brute Force correction
        else if (Math.abs(headingError(targetRobotYaw)) < 5 && misty.Get("robotYawVelocity") == 0) 
        {
            misty.Pause(1000);
            misty.Drive(0, Math.sign(headingError(targetRobotYaw)) * 1);
        } 
        else{}
        // Hazard activated mid-way in turn
        if (misty.Get("hazardDetected")) 
        {
            turnCompleted = false;
            break;
        }
        misty.Pause(50);
    }
    return turnCompleted;
}

// On an obstacle was encounter during, Misty uses this Method to complete the rest of the turn when obstacle clears
function reAttemptTurn(targetRobotYaw) 
{
    // Convert target yaw from 0 to +-180 range => 0  to 360 range
    var angleToReattempt = headingError(targetRobotYaw);
    misty.Debug("Re-attempting to turn " + angleToReattempt + "degrees");
    turn(angleToReattempt);
}

function headingError(targetRobotYaw)
{
    // Convert target yaw from 0 to +-180 range => 0  to 360 range
    var delta = ((360.0 + (targetRobotYaw % 360)) % 360.0) - misty.Get("robotYaw");
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    return delta;
}

// Converting angle offset to global robot frame yaw
function offsetHeading(to_offset) 
{
    var heading = (misty.Get("robotYaw") + to_offset) % 360;
    return heading > 180 ? heading - 360 : (heading < -180 ? heading + 360 : heading);
}