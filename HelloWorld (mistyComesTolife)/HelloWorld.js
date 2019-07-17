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

This part of the Hello World tutorial series teaches how to use one of
Misty's basic driving commands. The code you write here will have Misty
turn slowly to the left and to the right for a better view of her new
home.
**********************************************************************/

misty.DriveTime(0, 30, 5000);
misty.Pause(5000);
misty.DriveTime(0, -30, 5000);
misty.Pause(5000);
misty.Stop();

/**********************************************************************
Teaching Misty to Wave

This part of the Hello World tutorial series teaches how to
programmatically move Misty's arms. The code in this section has Misty
raise her right arm and wave.
**********************************************************************/

// Waves Misty's right arm!
function waveRightArm() {
    misty.MoveArmPosition("left", 0, 45); // Left arm fully down
    misty.Pause(50);
    misty.MoveArmPosition("right", 0, 45); // Right arm fully down
    misty.Pause(3000); // Pause for 3 seconds
    misty.MoveArmPosition("right", 10, 45); // Right arm fully up
    misty.Pause(5000); // Pause with arm up for 5 seconds (wave!)
    misty.MoveArmPosition("right", 0, 45); // Right arm fully down
}

waveRightArm();

/**********************************************************************
Using Face Recognition

This code has Misty start attempting to detect and recognize faces. If
you've trained Misty on your own face, then Misty waves when she sees
you. If Misty sees a person she doesn't know, she raises her eyebrows
and plays a sound.

If you haven't already trained Misty to recognize your face, use the
Command Center to do so before running the code in this section.
**********************************************************************/

// Invoke this function to start Misty recognizing faces.
function _registerFaceRec() {
    // Cancels any face recognition that's currently underway
    misty.StopFaceRecognition();
    // Starts face recognition
    misty.StartFaceRecognition();
    // If a FaceRecognition event includes a "PersonName" property,
    // then Misty invokes the _FaceRec callback function.
    misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
    // Registers for FaceRecognition events. Sets eventName to FaceRec,
    // debounceMs to 1000, and keepAlive to false.
    misty.RegisterEvent("FaceRec", "FaceRecognition", 1000, false);
}

// FaceRec events invoke this callback function.
function _FaceRec(data) {
    // Stores the value of the detected face
    var faceDetected = data.PropertyTestResults[0].PropertyValue;
    // Logs a debug message with the label of the detected face
    misty.Debug("Misty sees " + faceDetected);

    // Use the Command Center to train Misty to recognize your face.
    // Then, replace <Your-Name> below with your own name! If Misty
    // sees and recognizes you, she waves and looks happy.
    if (faceDetected == "<Your-Name>") {
        misty.DisplayImage("Happy.png");
        misty.PlayAudio("005-Eurra.wav");
        waveRightArm();
    }
    // If misty sees someone she doesn't know, she raises her eyebrow
    // and plays a different sound.
    else if (faceDetected == "unknown person") {
        misty.DisplayImage("Disdainful.png");
        misty.PlayAudio("001-OooOooo.wav");
    };

    // Register for a timer event to invoke the _registerFaceRec
    // callback function loop through the _registerFaceRec() again
    // after 7000 milliseconds pass.
    misty.RegisterTimerEvent("registerFaceRec", 7000, false);
}

// Starts Misty recognizing faces!
_registerFaceRec();
