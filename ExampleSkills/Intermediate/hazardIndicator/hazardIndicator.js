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

misty.AddReturnProperty("Hazard", "BumpSensorsHazardState");
misty.AddReturnProperty("Hazard", "TimeOfFlightSensorsHazardState");
// misty.AddReturnProperty("Hazard", "CurrentSensorsHazard");
// misty.AddReturnProperty("Hazard", "DriveStopped");
// misty.AddReturnProperty("Hazard", "MotorStallHazard");
misty.RegisterEvent("Hazard", "HazardNotification", 0, true);

function _Hazard(data) {
    var safe = false;
    misty.Debug(JSON.stringify(data));
    misty.Debug(JSON.stringify(data.AdditionalResults));
    const dataIn = data.AdditionalResults;

    var triggers = [];
    dataIn.forEach(sensor => {
        sensor.forEach(sensorData => {
            sensorData.InHazard ? triggers.push(sensorData.SensorName) : {}
        });
    });

    triggers.length ? {} : safe = true;
    safe ? misty.ChangeLED(255, 255, 255) : misty.ChangeLED(255, 0, 0);
    misty.Debug(safe);
    misty.Debug(triggers);
}