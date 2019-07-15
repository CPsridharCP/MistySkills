/**********************************************************************
Moving Misty's Head

This part of Misty's Hello World tutorial teaches how to code
Misty to move her head in a lifelike way.
**********************************************************************/

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

// Registers for a timer event  called look_around, and invokes the
// _look_around() callback after 5000 - 10000 milliseconds.
misty.RegisterTimerEvent("look_around", getRandomInt(5, 10) * 1000, false);

/**********************************************************************
Changing Misty's LED

This part of Misty's Hello World tutorial teaches how to write code to
have Misty's LED fade between green and yellow.
**********************************************************************/

// The breathingLED timer event invokes this callback function.
function _breathingLED() {
    // Values used to modify the RGB intensity of Misty's chest LED.
    // Change these to use a different starting color for the LED.
    var red = 140 / 10.0;
    var green = 0 / 10.0;
    var blue = 220 / 10.0;

    // Incrementally DECREASES the intensity of each color in the LED
    for (var i = 10; i >= 0; i = i - 1) {
        misty.ChangeLED(
            Math.floor(i * red), // red intensity
            Math.floor(i * green), // green intensity
            Math.floor(i * blue)); // red intensity
        // Pause before next iteration. Increase value for slower
        // breathing; decrease for faster breathing.
        misty.Pause(150);
    }

    // Incrementally INCREASES the intensity of each color in the LED
    for (var i = 0; i <= 10; i = i + 1) {
        misty.ChangeLED(
            Math.floor(i * red), // red intensity
            Math.floor(i * green), // green intensity
            Math.floor(i * blue)); // blue intensity
        // Pause before next iteration. Increase value for slower
        // breathing; decrease for faster breathing.
        misty.Pause(150);
    }
    // Re-registers for the breathingLED timer event, so Misty's LED
    // continues breathing until the skill ends.
    misty.RegisterTimerEvent("breathingLED", 1, false);
}

// Registers for a timer event called breathingLED, and invokes the
// _breathingLED() callback after 1 millisecond.
misty.RegisterTimerEvent("breathingLED", 1, false);

/**********************************************************************
Playing Sounds

This part of Misty's Hello World tutorial teaches how to write code to
have Misty play a sound
**********************************************************************/

// Plays an audio file at max volume.
misty.PlayAudio("001-EeeeeeE.wav", 100);
// Pauses for 3000 milliseconds before executing the next command.
misty.Pause(3000);

/**********************************************************************
Driving Misty
**********************************************************************/

misty.DriveTime(0, 30, 5000);
misty.Pause(5000);
misty.DriveTime(0, -30, 5000);
misty.Pause(5000);


/**********************************************************************
Moving Misty's Arms
**********************************************************************/

// misty.MoveArmPosition("left", 0, 45);
// misty.Pause(50);
// misty.MoveArmPosition("right", 0, 45);
// misty.Pause(3000);
// misty.MoveArmPosition("right", 10, 45);
// misty.Pause(5000);
// misty.MoveArmPosition("right", 0, 45);

/**********************************************************************
Playing Sounds
**********************************************************************/

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

