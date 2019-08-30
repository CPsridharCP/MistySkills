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

// Misty Drives forwards and stops on seieng an obstacle 15cm or closer

// Filtering Front Centre Time Of Flight Data and triggering callback only if
// range measured is less than 15cm

misty.AddPropertyTest("FrontTOF", "SensorPosition", "==", "Center", "string"); 
misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.15, "double"); 
misty.RegisterEvent("FrontTOF", "TimeOfFlight", 0, false);

misty.ChangeLED(144, 0, 230);
misty.Pause(1000);

// UNCOMMENT the below line to see Misty drive straight and stop at an obstacle encounter
// misty.Drive(20, 0);

// All possible sensor positions would be
// Center
// Left
// Right
// Back
// DownFrontRight
// DownFrontLeft
// DownBackRight
// DownBackLeft

function _FrontTOF(data) 
{
    misty.Debug(data.PropertyTestResults[0].PropertyParent.DistanceInMeters);
    misty.Stop();
    misty.ChangeLED(255, 0, 0);
    misty.PlayAudio("<audio_file_with_extension>");
}

