// Blinking

misty.Set("eyeMemory", "Homeostasis.png");
function _blink_now(repeat = true) 
{
    misty.DisplayImage("blinkMisty.png");
    misty.Pause(200);
    misty.DisplayImage(misty.Get("eyeMemory"));
    if (repeat) misty.RegisterTimerEvent("blink_now", getRandomInt(2, 8) * 1000, false);
}
misty.RegisterTimerEvent("blink_now", getRandomInt(2, 8) * 1000, false);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Head Movements

function _look_around(repeat = true) 
{
    misty.MoveHeadPosition(getRandomInt(-5, 5), getRandomInt(-5, 5), getRandomInt(-5, 5), 300);
    if (repeat) misty.RegisterTimerEvent("look_around", getRandomInt(5, 10) * 1000, false);
}
misty.RegisterTimerEvent("look_around", getRandomInt(5, 10) * 1000, false);

// Breathing LED

function _breathingLED() 
{
    var red = 140 / 10.0;
    var green = 0 / 10.0;
    var blue = 220 / 10.0;
    for (var i = 10; i >= 0; i = i - 1) 
    {
        misty.ChangeLED(Math.floor(i * red), Math.floor(i * green), Math.floor(i * blue));
        misty.Pause(50);
    }
    for (var i = 0; i <= 10; i = i + 1) 
    {
        misty.ChangeLED(0, Math.floor(i * 20), 0);
        misty.Pause(50);
    }
    misty.RegisterTimerEvent("breathingLED", 0, false);
}
misty.RegisterTimerEvent("breathingLED", 0, false);

// Play an Audio File

misty.PlayAudio("<file_name.wav>", 100);
misty.Pause(3000);

// Driving Misty

misty.DriveTime(0, 30, 5000);
misty.Pause(5000);
misty.DriveTime(0, -30, 5000);
misty.Pause(5000);

// Move Hands - Wave Hi

misty.MoveArmPosition("left", 0, 45);
misty.Pause(50);
misty.MoveArmPosition("right", 0, 45);
misty.Pause(3000);
misty.MoveArmPosition("right", 10, 45);
misty.Pause(5000);
misty.MoveArmPosition("right", 0, 45);

// Face Recognition

function registerFaceRec() 
{
    misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
    misty.RegisterEvent("FaceRec", "FaceRecognition", 1000, false);
}

function _FaceRec(data) 
{
    var faceDetected = data.PropertyTestResults[0].PropertyValue;
    misty.Debug("Misty sees " + faceDetected);

    if (faceDetected == "unknown person") 
    {   
        misty.ChangeLED(255, 0, 0);
        misty.DisplayImage("Disdainful.png");
        misty.PlayAudio("angry.wav");
        misty.TakePicture(false, "Intruder", 1200, 1600, false, true);
        misty.MoveArmPosition("left", 5, 45);
        misty.Pause(50);
        misty.MoveArmPosition("right", 5, 45);
    } 
    else if (faceDetected == "<Your Name>") 
    {
        misty.ChangeLED(148, 0, 211);
        misty.DisplayImage("Happy.png");
        misty.PlayAudio("<happySoundAsset.wav>");
        misty.MoveArmPosition("left", 10, 45);
        misty.Pause(50);
        misty.MoveArmPosition("right", 10, 45);
    } 
    else 
    {
        misty.ChangeLED(148, 0, 211);
        misty.DisplayImage("Wonder.png");
        misty.PlayAudio("<greetingSoundAsset.wav>");
        misty.MoveArmPosition("left", 10, 45);
        misty.Pause(50);
        misty.MoveArmPosition("right", 10, 45);
    }

    misty.RegisterTimerEvent("registerFaceRec", 7000, false);
}

