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

// Centering Misty to IMU 0   
// -- Checkout Intermediate skills to figure out how to start with current pose as home
// Misty drives in a circle of radius 0.5m 

misty.DriveArc(0, 0.0, 4000, false);
misty.Pause(4000);

function circle_drive() 
{

    for (var i = 1; i <= 4; i += 1) 
    {
        misty.DriveArc(i*90, 0.5, 3000, false);
        misty.Pause(2900);
    }
    circle_drive();
}
circle_drive();
