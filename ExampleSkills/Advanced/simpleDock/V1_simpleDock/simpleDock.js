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

// Version 1 - Assuming the mapping brings you close to the location of the charger and Misty is somwhat facing towards the charger

// An experimntal skill based dock using ToFs
// The charging station has to be placed flat on the wall and we need some space to the right / left of charger with the flat wall. Check video for optimal placement.
// This is in no way simlar/part of the actual AutocDocking process that would use the feducials and IR reflectore on the charging pad

// When charging has started you would hear the fans come up and the chest LED will breath orange

misty.Debug("Simple Dock");
misty.ChangeLED(0, 0, 245);
misty.ChangeLED(0, 0, 255);

misty.Set("leftToF", 10.0, false);
misty.Set("rightToF", 10.0, false);
misty.Set("backToF", 0.0, false);
misty.Set("robotYaw", 0.0, false);

function startTofStream()
{
    misty.AddPropertyTest("LeftToF", "SensorPosition", "==", "Left", "string");
    misty.RegisterEvent("LeftToF", "TimeOfFlight", 0, true);

    misty.AddPropertyTest("RightToF", "SensorPosition", "==", "Right", "string");
    misty.RegisterEvent("RightToF", "TimeOfFlight", 0, true);
}

function stopTofStream()
{
    misty.UnregisterEvent("LeftToF");
    misty.UnregisterEvent("RightToF");
}

// I tried using the downward facing Tofs to once on the charger.
// Realised using info from the battery data seemed better.
// function startDownTofStream() {
    
//     misty.AddPropertyTest("LeftToF", "SensorPosition", "==", "DownFrontLeft", "string");
//     misty.RegisterEvent("LeftToF", "TimeOfFlight", 0, true);

//     misty.AddPropertyTest("RightToF", "SensorPosition", "==", "DownFrontRight", "string");
//     misty.RegisterEvent("RightToF", "TimeOfFlight", 0, true);
// }

// function stopDownTofStream() {
//     misty.UnregisterEvent("DownLeftToF");
//     misty.UnregisterEvent("DownRightToF");
// }

function _LeftToF(data) 
{
    // misty.Debug(data.PropertyTestResults[0].PropertyParent.DistanceInMeters);
    misty.Set("leftToF", data.PropertyTestResults[0].PropertyParent.DistanceInMeters, false);
}

function _RightToF(data) 
{
    // misty.Debug(data.PropertyTestResults[0].PropertyParent.DistanceInMeters);
    misty.Set("rightToF", data.PropertyTestResults[0].PropertyParent.DistanceInMeters, false);
}

function startIMUStream() 
{
    misty.RegisterEvent("Heading", "IMU", 100, true);
}

function stopIMUStream() 
{
    misty.UnregisterEvent("Heading");
}

function _Heading(data) 
{
    var yaw = data.PropertyTestResults[0].PropertyParent.Yaw;
    if (yaw > 180) yaw -= 360;
    misty.Set("robotYaw", yaw);
}

// Helper function - So we don't really have to keep track of robot heading all the time.
// Translated offset required to Global Roboot Heading
function offset_heading(to_offset) 
{
    var heading = misty.Get("robotYaw") + to_offset;
    return (360.0 + (heading % 360)) % 360.0;
}

function streamBatteryStatus() 
{
    misty.RegisterEvent("BatteryStatus", "BatteryCharge", 10, true);
}

function stopBatteryStatusStream()
{
    misty.UnregisterEvent("BatteryStatus");
}

function moveTowardsWall()
{
    misty.Drive(10, 0);
    while ((misty.Get("leftToF") > 0.30) && (misty.Get("rightToF") > 0.30)) 
    {
        misty.Pause(10);
    }
    misty.Stop();
    return 0;
}

function angleCorrect()
{
    misty.Pause(2500);
    const leftToF = misty.Get("leftToF");
    const rightToF = misty.Get("rightToF");
    
    const theta = Math.atan2(rightToF - leftToF, 0.15) * 180.0 / Math.PI;
    misty.Debug(leftToF.toString() + " " + rightToF.toString() + " " + theta.toString());
    // misty.Debug(theta);
    misty.DriveArc(offset_heading(theta), 0.0, Math.abs(theta) * 100 / 3, false);
    misty.Pause((Math.abs(theta) * 100 / 3) + 1000);
    return 0;
}

function correctDistance()
{
    misty.Pause(2500);
    const distanceOffset = ((misty.Get("leftToF") + misty.Get("rightToF"))/2.0 - 0.14)*100;
    misty.Debug(distanceOffset);
    misty.DriveHeading(misty.Get("robotYaw"), Math.abs(distanceOffset) / 100.0, Math.abs(distanceOffset) * 80, (distanceOffset<0)  ? true : false);
    misty.Pause(Math.abs(distanceOffset) * 80 +2000);
    // misty.Pause(2000);
    return 0;
}

// You may choose to turn right too if you have space on the left side of the charger
function turnLeft(slow = false)
{
    misty.Pause(2500);
    misty.DriveArc(offset_heading(90), 0.0, slow ? 8000 : 90 * 100 / 3, false);
    misty.Pause((slow ? 8000 : 9000/3) + 1000);
    return 0;
}

function streamBackToF() 
{
    misty.AddPropertyTest("BackToF", "SensorPosition", "==", "Back", "string");
    misty.RegisterEvent("BackToF", "TimeOfFlight", 0, true);
}

function _BackToF(data) 
{
    misty.Set("backToF", data.PropertyTestResults[0].PropertyParent.DistanceInMeters, false);
}

function stopBackToFStream() 
{
    misty.UnregisterEvent("BackToF");
}

function backIn() 
{
    misty.Pause(2500);
    const distanceOffset = (0.027 - misty.Get("backToF")) * 100;
    misty.Debug(distanceOffset);
    misty.DriveHeading(misty.Get("robotYaw"), Math.abs(distanceOffset) / 100.0, Math.abs(distanceOffset) * 80, (distanceOffset < 0) ? true : false);
    misty.Pause(Math.abs(distanceOffset) * 80 + 2000);
    // misty.Pause(2000);
    return 0;
}

function _BatteryStatus(data) 
{
    misty.Debug(JSON.stringify(data.PropertyTestResults[0].PropertyParent.IsCharging));
    // var voltage = data.PropertyTestResults[0].PropertyParent.IsCharging
    if (data.PropertyTestResults[0].PropertyParent.IsCharging) 
    {
        misty.Stop();
        stopBatteryStatusStream();
        misty.Pause(1000);
        _ = turnLeft(slow = true);
        misty.Pause(1000);
        _ = backIn();
        stopBackToFStream();
        stopIMUStream();
    }
}

startTofStream();
startIMUStream();
misty.Pause(1000);
_ = moveTowardsWall();
_ = angleCorrect();
_ = correctDistance();
_ = turnLeft();
stopTofStream();
misty.Pause(1000);
streamBatteryStatus();
misty.Pause(1000);  
streamBackToF();
misty.Drive(2, 0);