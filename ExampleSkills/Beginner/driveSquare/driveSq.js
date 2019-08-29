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


// The Heading Misty Faces on Boot up is her Zero. Or you could use the reset IMU before starting to drive
function sq_drive() 
{
    var i;
    for (i = 0; i < 360; i+=90) 
    {
        misty.DriveHeading(i, 0.5, 3000, false);
        misty.Pause(3500); // Play with this to a non  stop Square Drive
        misty.DriveArc(i+90, 0.5, 3000, false);
        misty.Pause(3500); // Play with this to a non  stop Square Drive
    }
    sq_drive();
}

// Getting Misty to Zero Heading
misty.DriveArc(0, 0.0, 5000, false);
misty.Pause(5000);

sq_drive();