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

misty.Debug("Hazard Indicator SKill");

// White LED Safe to Drive 
// Red LED indiactes hazard was triggered

misty.ChangeLED(255, 255, 255);

//misty.AddReturnProperty("Hazard", "BumpSensorsHazardState");
//misty.AddReturnProperty("Hazard", "TimeOfFlightSensorsHazardState");
// misty.AddReturnProperty("Hazard", "CurrentSensorsHazard");
misty.AddReturnProperty("Hazard", "DriveStopped");
// misty.AddReturnProperty("Hazard", "MotorStallHazard");
misty.RegisterEvent("Hazard", "HazardNotification", 0, true);

function _Hazard(data) 
{
//     const region = 
//     {
//         "TOF_Back" : "Back",
//         "TOF_Right" : "FrontRight",
//         "TOF_Left" : "FrontLeft",
//         "TOF_Center" : "Centre",
//         "TOF_DownBackLeft" : "RearLeft",
//         "TOF_DownBackRight": "RearRight",
//         "TOF_DownFrontLeft" : "FrontLeft",
//         "TOF_DownFrontRight" : "FrontRight",
//         "Bump_FrontRight": "FrontRight",
//         "Bump_FrontLeft": "FrontLeft",
//         "Bump_RearLeft": "RearLeft",
//         "Bump_RearRight": "RearRight"
//     }

    var safe = false;
//     misty.Debug(JSON.stringify(data));
    misty.Debug(JSON.stringify(data.AdditionalResults));
    const dataIn = data.AdditionalResults;

    var triggers = [];
    dataIn.forEach(sensor => {
        sensor.forEach(sensorData => {
            sensorData.InHazard ? triggers.push(sensorData.SensorName) : {}
        });
    });

    triggers.length ? misty.Debug(triggers) : safe = true;

    safe ? misty.ChangeLED(255, 255, 255) : misty.ChangeLED(255, 0, 0);
    // misty.Debug(safe);
    // misty.Debug(triggers);
}

// Each Message Looks like this
// Start--------------------

// BumpSensorsHazardState: Array(4)
// 0: {SensorName: “Bump_FrontRight”, InHazard: false}
// 1: {SensorName: “Bump_FrontLeft”, InHazard: false}
// 2: {SensorName: “Bump_RearRight”, InHazard: false}
// 3: {SensorName: “Bump_RearLeft”, InHazard: false}

// CriticalInternalError: 0

// CurrentSensorsHazard: Array(7)
// 0: {SensorName: “CurrentSensor_RightTrack”, InHazard: false}
// 1: {SensorName: “CurrentSensor_LeftTrack”, InHazard: false}
// 2: {SensorName: “CurrentSensor_RightArm”, InHazard: false}
// 3: {SensorName: “CurrentSensor_LeftArm”, InHazard: false}
// 4: {SensorName: “CurrentSensor_HeadPitch”, InHazard: false}
// 5: {SensorName: “CurrentSensor_HeadRoll”, InHazard: false}
// 6: {SensorName: “CurrentSensor_HeadYaw”, InHazard: false}

// DriveStopped: Array(6)
// 0: {SensorName: “Front right hazard”, InHazard: false}
// 1: {SensorName: “Front center hazard”, InHazard: false}
// 2: {SensorName: “Front left hazard”, InHazard: false}
// 3: {SensorName: “Back right hazard”, InHazard: false}
// 4: {SensorName: “Back center hazard”, InHazard: true}
// 5: {SensorName: “Back left hazard”, InHazard: false}

// MotorStallHazard: Array(7)
// 0: {SensorName: “RightDrive”, InHazard: false}
// 1: {SensorName: “LeftDrive”, InHazard: false}
// 2: {SensorName: “RightArm”, InHazard: false}
// 3: {SensorName: “LeftArm”, InHazard: false}
// 4: {SensorName: “HeadPitch”, InHazard: false}
// 5: {SensorName: “HeadRoll”, InHazard: false}
// 6: {SensorName: “HeadYaw”, InHazard: false}

// TimeOfFlightSensorsHazardState: Array(8)
// 0: {SensorName: “TOF_Right”, InHazard: false}
// 1: {SensorName: “TOF_Center”, InHazard: false}
// 2: {SensorName: “TOF_Left”, InHazard: false}
// 3: {SensorName: “TOF_Back”, InHazard: true}
// 4: {SensorName: “TOF_DownFrontRight”, InHazard: false}
// 5: {SensorName: “TOF_DownFrontLeft”, InHazard: false}
// 6: {SensorName: “TOF_DownBackRight”, InHazard: false}
// 7: {SensorName: “TOF_DownBackLeft”, InHazard: false}
// End--------------------
