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

// LED is green if Misty Has Pose
// LED is red if Misty Lost Pose
// LED is blue if Misty has not received any SlamStatus messgae yet

misty.RegisterEvent("poseStatus", "SlamStatus", 100, true);

function _poseStatus(data)
{
    var localised = data.PropertyTestResults[0].PropertyParent.SlamStatus.StatusList;
    misty.Debug(localised);
    if (localised.includes("HasPose"))
    {
        misty.ChangeLED(0, 255, 0);
    }
    else 
    {
        misty.ChangeLED(255, 0, 0);
    }
}
