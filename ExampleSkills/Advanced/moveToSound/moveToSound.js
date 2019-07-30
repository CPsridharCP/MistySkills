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

// Misty turn to look at the person who is speaking
// It is intended to be slow and not super responsive - Feel free to play with latencey and make it faster 

misty.ChangeLED(0, 0, 255);
misty.Set("lookedAt",(new Date()).toUTCString());
misty.MoveHeadDegrees(-15.0, 0.0, 0.0, 70);
misty.StartRecordingAudio("deleteThis.wav");
misty.Pause(4000);
misty.ChangeLED(0, 255, 0);


// Setting some global variables as normal var <variable_name> cannot be accessed in event callbacks
misty.Set("headYaw", 0.0); 
misty.Set("robotYaw", 0.0); 

// Used for smoothening data - barely helps :D - Gotta do more layers for better softening
misty.Set("1b", 0.0);
misty.Set("2b",0.0);

misty.Set("inProgress", false);

registerAudioLocalisation();
registerIMU();
registerActuatorPosition();


// -------------------------------------- Audio Localization --------------------------------------------------

function registerAudioLocalisation(){
    misty.AddReturnProperty("sound", "DegreeOfArrivalSpeech");
    misty.RegisterEvent("sound", "SourceTrackDataMessage", 100 ,true); 
}

function _sound(data)
{   
    // We get the location of the Audio Speech in 0-360 degrees wrt Local Frame of Head
    // Using the function toRobotFrame() it is mapped to Robots local frame
    var vector = 0.4*toRobotFrame(data.AdditionalResults[0]) + 0.35*misty.Get("1b") + 0.25*misty.Get("2b") ;
    // misty.Debug(data.AdditionalResults[0]);
    if (!misty.Get("inProgress")) misty.Debug(vector+" <-- soundIn");

    if (secondsPast(misty.Get("lookedAt"))>5.0 && !misty.Get("inProgress"))
    {   
        misty.UnregisterEvent("sound");   
        misty.Set("inProgress", true);
        misty.Debug(vector.toString()+" <-- Look At Input Global");
        // misty.Pause(300);
        lookAt(vector,misty.Get("robotYaw"),misty.Get("headYaw"));
        registerAudioLocalisation();
    }

    misty.Set("2b",misty.Get("1b"));
    misty.Set("1b",vector);
}

// -------------------------------------- Robot Control - MAIN -----------------------------------------------

function lookAt(heading,robotYawAtStart,headYawAtStart)
{
    misty.Set("inProgress", true);
    
    // Head Motion 
    var rawFinalHeadPose = misty.Get("headYaw")+(heading/2.0);
    var actuateTo = rawFinalHeadPose;
    actuateTo = actuateTo <-45.0 ? -45.0 : actuateTo;
    actuateTo = actuateTo >45 ? 45.0 : actuateTo;
    misty.Debug(actuateTo.toString()+" <- Head to move to");
    misty.MoveHeadDegrees(-15.0, 0.5, actuateTo, 50);
    
    
    // Body Motion
    if (Math.abs(rawFinalHeadPose)>=45)
    {   
        misty.Pause(1000);
        var globalHeading = offset_heading(heading+(headYawAtStart*2.0));
        if (globalHeading>180) globalHeading-=360;
        AngleDifference(robotYawAtStart,globalHeading)>=0 ? misty.Drive(0, 30) : misty.Drive(0, -30);// use speed 30
        // misty.MoveHeadDegrees(-14.0, 0.0, 0.0,5);
        misty.Debug(globalHeading.toString()+" <- Body to move to");
        var initialError = Math.abs(AngleDifference(robotYawAtStart,globalHeading));
        var currentAbsError = initialError;
        var headResetDone = false;
        while (Math.abs(misty.Get("robotYaw")-globalHeading)>=10)
        { 
            // misty.Debug(currentAbsError/initialError);
            currentAbsError = Math.abs(AngleDifference(misty.Get("robotYaw"),globalHeading));
            if (currentAbsError/initialError <0.45 && !headResetDone)
            {
                headResetDone = true;
                misty.MoveHeadDegrees(-15.0, 0.0, 0.0,50);
            }
            else {}
            misty.Pause(10);
            // misty.Debug(misty.Get("robotYaw").toString()+" , " + globalHeading.toString());
        }
        // misty.Drive(0, 0);
        misty.Stop();
    } else {
        //misty.Pause(3000);
    }
    misty.Debug("DONE");
    misty.Set("lookedAt",(new Date()).toUTCString());
    misty.Set("inProgress", false);
}

// ------------------------------------ Head Current Position Updater --------------------------------------

function registerActuatorPosition()
{   
    misty.AddReturnProperty("Positions", "SensorId");
    misty.AddReturnProperty("Positions", "Value");
    misty.AddPropertyTest("Positions", "SensorId", "==", "ahy", "string"); 
    misty.RegisterEvent("Positions", "ActuatorPosition", 100 ,true); 
}

function _Positions(data) 
{   
    if (data.AdditionalResults[0] == "ahy" ) 
    {
        // misty.Debug(data.AdditionalResults[0]+" "+(data.AdditionalResults[1]).toString())
        var headYaw = data.AdditionalResults[1];//*180.0/Math.PI;
        headYaw = headYaw <-45.0 ? -45.0 : headYaw;
        headYaw = headYaw >45.0 ? 45.0 : headYaw;
        misty.Set("headYaw", headYaw);
    }
}

// ------------------------------------ Robot Heading Updater --------------------------------------------

function registerIMU() 
{
	misty.RegisterEvent("Heading", "IMU",100 ,true); 
}

function _Heading(data)
{   
    var yaw = data.PropertyTestResults[0].PropertyParent.Yaw;
    if (yaw > 180) yaw -= 360;
    misty.Set("robotYaw", yaw);
    // misty.Debug(yaw.toString()+" <-- Yaw");
}

// ----------------------------------- Support Functions ------------------------------------------

function AngleDifference(now, to)
{
    var diff = ( to - now + 180 ) % 360 - 180;
    return diff < -180 ? diff + 360 : diff;
}

function secondsPast(value)
{
    var timeElapsed = new Date() - new Date(value);
    timeElapsed /= 1000;
    return timeElapsed; // seconds
}

function toRobotFrame(data)
{
    var soundIn = data;
    if (soundIn>180) soundIn -= 360;
    return (soundIn)
}

function offset_heading(to_offset){
	var heading = misty.Get("robotYaw")+to_offset;
	return (360.0+(heading%360))%360.0;
}


