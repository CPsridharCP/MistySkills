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

// Misty turn to look at the person who is speaking
// It is intended to be slow and not super responsive - Feel free to play with latencey and make it faster 

function start() {
    misty.ChangeLED(0, 0, 255);
    misty.Set("lookedAt",(new Date()).toUTCString());
    misty.MoveHead(-15.0, 0.0, 0.0, null, 1);
    misty.StartRecordingAudio("deleteThis.wav");
    misty.Pause(4000);
    misty.ChangeLED(0, 255, 0);
    if (_params.turn_off_hazards) misty.UpdateHazardSettings(false, false, false, null, null, false, 0);

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
}
start()

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
    var rawFinalHeadPose = misty.Get("headYaw")+(heading);
    var actuateTo = rawFinalHeadPose;
    actuateTo = actuateTo <-45.0 ? -45.0 : actuateTo;
    actuateTo = actuateTo >45 ? 45.0 : actuateTo;
    misty.Debug(actuateTo.toString()+" <- Head to move to");
    misty.MoveHead(-15.0, 0.5, actuateTo, null, 1);
    
    
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
                misty.MoveHead(-15.0, 0.0, 0.0, null,2.5);
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


