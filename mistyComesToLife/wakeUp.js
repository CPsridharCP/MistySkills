/******************
Moving Misty's Head

This part of Misty's Hello World tutorial teaches how to code
Misty to move her head in a lifelike way.
******************/

// Sends a message to debug listeners
misty.Debug("The HelloWorld skill is starting!")

// Returns a random integer between min and max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// The look_around timer event invokes this callback function. Change
// the value of repeat to false if Misty should only move her head once.
function _look_around(repeat = true) {

    // Moves Misty's head to a random position. Adjust the min/max
    // values passed into getRandomInt() to change Misty's range of
    // motion when she calls this method.
    misty.MoveHeadPosition(
        getRandomInt(-5, 5), // Random pitch position between -5 and 5
        getRandomInt(-5, 5), // Random roll position between -5 and 5
        getRandomInt(-5, 5), // Random yaw position between -5 and 5
        300); // Head movement velocity. Decrease for slower movement.

        // If repeat is set to true, re-registers for the look_around
        // timer event, and Misty moves her head until the skill ends.
        if (repeat) misty.RegisterTimerEvent(
        "look_around",
        getRandomInt(5, 10) * 1000,
        false);
}

// Registers for a timer event with called look_around, and invokes the
// _look_around() callback every 5000 - 10000 milliseconds.
misty.RegisterTimerEvent("look_around", getRandomInt(5, 10) * 1000, false);

// // Breathing LED

// function _breathingLED() 
// {
//     var red = 140 / 10.0;
//     var green = 0 / 10.0;
//     var blue = 220 / 10.0;
//     for (var i = 10; i >= 0; i = i - 1) 
//     {
//         misty.ChangeLED(Math.floor(i * red), Math.floor(i * green), Math.floor(i * blue));
//         misty.Pause(50);
//     }
//     for (var i = 0; i <= 10; i = i + 1) 
//     {
//         misty.ChangeLED(0, Math.floor(i * 20), 0);
//         misty.Pause(50);
//     }
//     misty.RegisterTimerEvent("breathingLED", 0, false);
// }
// misty.RegisterTimerEvent("breathingLED", 0, false);

// // Play an Audio File

// misty.PlayAudio("<file_name.wav>", 100);
// misty.Pause(3000);

// // Driving Misty

// misty.DriveTime(0, 30, 5000);
// misty.Pause(5000);
// misty.DriveTime(0, -30, 5000);
// misty.Pause(5000);

// // Move Hands - Wave Hi

// misty.MoveArmPosition("left", 0, 45);
// misty.Pause(50);
// misty.MoveArmPosition("right", 0, 45);
// misty.Pause(3000);
// misty.MoveArmPosition("right", 10, 45);
// misty.Pause(5000);
// misty.MoveArmPosition("right", 0, 45);

// // Face Recognition

// function registerFaceRec() 
// {
//     misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
//     misty.RegisterEvent("FaceRec", "FaceRecognition", 1000, false);
// }

// function _FaceRec(data) 
// {
//     var faceDetected = data.PropertyTestResults[0].PropertyValue;
//     misty.Debug("Misty sees " + faceDetected);

//     if (faceDetected == "unknown person") 
//     {   
//         misty.ChangeLED(255, 0, 0);
//         misty.DisplayImage("Disdainful.png");
//         misty.PlayAudio("angry.wav");
//         misty.TakePicture(false, "Intruder", 1200, 1600, false, true);
//         misty.MoveArmPosition("left", 5, 45);
//         misty.Pause(50);
//         misty.MoveArmPosition("right", 5, 45);
//     } 
//     else if (faceDetected == "<Your Name>") 
//     {
//         misty.ChangeLED(148, 0, 211);
//         misty.DisplayImage("Happy.png");
//         misty.PlayAudio("<happySoundAsset.wav>");
//         misty.MoveArmPosition("left", 10, 45);
//         misty.Pause(50);
//         misty.MoveArmPosition("right", 10, 45);
//     } 
//     else 
//     {
//         misty.ChangeLED(148, 0, 211);
//         misty.DisplayImage("Wonder.png");
//         misty.PlayAudio("<greetingSoundAsset.wav>");
//         misty.MoveArmPosition("left", 10, 45);
//         misty.Pause(50);
//         misty.MoveArmPosition("right", 10, 45);
//     }

//     misty.RegisterTimerEvent("registerFaceRec", 7000, false);
// }

