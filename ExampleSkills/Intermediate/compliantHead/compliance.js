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


// This skill makes Mistys head compliant!
// By compliant - dis-engaging Misty's head motots on touch sensor activation 
// re-engaging Misty's head motots on touch sensor release
registerActuatorPosition();

registerCapTouch();

misty.Set("Chin", false);
misty.Set("HeadRight", false);
misty.Set("HeadLeft", false);
misty.Set("HeadFront", false);
misty.Set("HeadBack", false);
misty.Set("Scruff", false);
misty.Set("inTouch", false);
misty.Set("roll", 0.0);
misty.Set("pitch", 0.0); 
misty.Set("yaw", 0.0);

// Event to handle any Capacitive Touch Event
function registerCapTouch(){

    misty.AddReturnProperty("Touched", "sensorPosition");
    misty.AddReturnProperty("Touched", "IsContacted");
    misty.RegisterEvent("Touched", "TouchSensor", 0 ,true);

}

// We are disengaging Mistys head on any capTouch event trigger
function _Touched(data)
{
    var sensor = data.AdditionalResults[0];
    var isPressed = data.AdditionalResults[1];
	isPressed ? misty.Debug(sensor+" is Touched") : misty.Debug(sensor+" is Released");
    
    if (isPressed )
    {

        misty.Set("inTouch", true);
        disengage(); 
        if (sensor == "Chin") misty.Set("Chin", true);
        else if (sensor == "HeadRight") misty.Set("HeadRight", true);
        else if (sensor == "HeadLeft") misty.Set("HeadLeft", true);
        else if (sensor == "HeadFront") misty.Set("HeadFront", true);
        else if (sensor == "HeadBack") misty.Set("HeadBack", true);
        else if (sensor == "Scruff") misty.Set("Scruff", true);
        else misty.Debug("Sensor Name Unknown");

    } else {

        if (sensor == "Chin") misty.Set("Chin", false);
        else if (sensor == "HeadRight") misty.Set("HeadRight", false);
        else if (sensor == "HeadLeft") misty.Set("HeadLeft", false);
        else if (sensor == "HeadFront") misty.Set("HeadFront", false);
        else if (sensor == "HeadBack") misty.Set("HeadBack", false);
        else if (sensor == "Scruff") misty.Set("Scruff", false);
        else {}   

    }

    // This block of code below, reengages Mistys head back to where she was looking 
    if ( !misty.Get("Chin") && !misty.Get("HeadRight") && !misty.Get("HeadLeft") && !misty.Get("HeadFront") && !misty.Get("HeadBack") && !misty.Get("Scruff"))
    {   
        misty.Debug("Reengaging");
        // Next four lines are temporary and is needed today to handle a bug in our effective action runner
        var p = misty.Get("pitch")>=0.0 ? misty.Get("pitch")-10.0 : misty.Get("pitch")+10.0
        var r = misty.Get("roll")>=0.0 ? misty.Get("roll")-10.0 : misty.Get("roll")+10.0;
        var y = misty.Get("yaw")>=0.0 ? misty.Get("yaw")-10.0 : misty.Get("yaw")+10.0;
        misty.MoveHeadDegrees(p, r, y, 300);
        misty.Pause(100);
        misty.MoveHeadDegrees(misty.Get("pitch"), misty.Get("roll"), misty.Get("yaw"), 300);
        misty.Set("inTouch", false);
    } else {}

} 

function disengage()
{

    misty.Halt();
    misty.Debug("Halting");

}

// Event to track Misty's Head Position
function registerActuatorPosition()
{   

    misty.AddReturnProperty("Positions", "SensorId");
    misty.AddReturnProperty("Positions", "Value");
    misty.RegisterEvent("Positions", "ActuatorPosition", 400 ,true); 

}

// Updates Misty's Head Position in the skill - Needed to reengage
function _Positions(data) 
{   
    if (!misty.Get("inTouch"))
    {

        if (data.AdditionalResults[0] == "ahy" ) misty.Set("yaw", data.AdditionalResults[1]);
        else if (data.AdditionalResults[0] == "ahp" ) misty.Set("pitch", data.AdditionalResults[1]);
        else if (data.AdditionalResults[0] == "ahr" ) misty.Set("roll", data.AdditionalResults[1]);
        else {}

    } else {}
}


// Use the Below Function for Debug Purposes
// misty.RegisterTimerEvent("test", 100, true);

// function _test()
// {
//     if (misty.Get("Chin")) misty.Debug("CHIN ON");
//     if (misty.Get("HeadRight")) misty.Debug("HeadRight ON");
//     if (misty.Get("HeadLeft")) misty.Debug("HeadLeft ON");
//     if (misty.Get("HeadFront")) misty.Debug("HeadFront ON");
//     if (misty.Get("HeadBack")) misty.Debug("HeadBack ON");
//     if (misty.Get("Scruff")) misty.Debug("Scruff ON");
// }
