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

// This skill lets Misty drive about randomly inide an imaginary 
// bounding box on the floor ... assuming no obstacles and driving only 
// forward and turning only in pivots

// Set split range in cm - X axis right side to Misty, Y forward to Misty
// CHANGE PARAMETER HERE
misty.Set("roamX", 100, false);
misty.Set("roamY", 50, false);

registerIMU();
startRoaming();

function startRoaming() 
{
    misty.Set("roamStatus", true, false);
    misty.Set("robotYaw", 0.0, false);
    misty.Set("robotStartYaw", 0.0, false);
    misty.Set("x", 0.0, false);
    misty.Set("y", 0.0, false);
    misty.RegisterTimerEvent("recordRobotStartYaw", 2000, false);
    misty.RegisterTimerEvent("driveRegion", 5000, false);
}

function stopRoaming() 
{
    misty.Set("roamStatus", false, false);
}

function _recordRobotStartYaw() 
{
    misty.Set("robotStartYaw", misty.Get("robotYaw"), false);
}


function newPosition(xRange, yRange) 
{
    return [getRandomInt(-1 * xRange, xRange), getRandomInt(-1 * yRange, yRange)];
}

function getRandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function registerIMU() 
{
    misty.RegisterEvent("heading", "IMU", 100, true);
}

function _heading(data) 
{
    var yaw = data.PropertyTestResults[0].PropertyParent.Yaw;
    if (yaw > 180) yaw -= 360;
    misty.Set("robotYaw", yaw);
    // misty.Debug(yaw.toString()+" <-- Yaw");
}

function offset_heading(to_offset) 
{
    var heading = misty.Get("robotYaw") + to_offset;
    return (360.0 + (heading % 360)) % 360.0;
}

function driveDistance(distance) 
{
    if (misty.Get("roamStatus")) 
    {
        misty.DriveHeading(misty.Get("robotYaw"), distance / 100.0, distance * 80, false);
        misty.Pause(distance * 80 + 1000);
    }
    return 0;
}

function turnAngle(degrees) 
{
    if (misty.Get("roamStatus")) 
    {
        misty.DriveArc(offset_heading(degrees), 0.0, Math.abs(degrees) * 100 / 3, false);
        misty.Pause((Math.abs(degrees) * 100 / 3) + 1000);
    }
    return 0;
}

function AngleDifference(now, to) 
{
    var diff = (to - now + 180 + misty.Get("robotStartYaw")) % 360 - 180;
    return diff < -180 ? diff + 360 : diff;
}

function _driveRegion() 
{
    var [x, y] = newPosition(misty.Get("roamX"), misty.Get("roamY"));
    misty.Debug(x);
    misty.Debug(y);

    var delX = x - misty.Get("x");
    var delY = y - misty.Get("y");

    misty.Debug(delX);
    misty.Debug(delY);
    misty.Debug("------");

    var distance = Math.sqrt(delX * delX + delY * delY);
    var absAngleDeg = ((-1.0 * Math.atan2(delX, delY) * 180 / Math.PI)); // - misty.Get("robotStartYaw"))%360;
    var angleError = AngleDifference(misty.Get("robotYaw"), absAngleDeg);

    _ = turnAngle(angleError);
    _ = driveDistance(distance);

    misty.Set("x", x, false);
    misty.Set("y", y, false);

    if (misty.Get("roamStatus")) misty.RegisterTimerEvent("driveRegion", 1000, false);
}
