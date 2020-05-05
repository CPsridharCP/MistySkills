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
