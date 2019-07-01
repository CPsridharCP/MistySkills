misty.Debug("Centering Head");
misty.MoveHeadPosition(0, 0, 0, 100);
misty.ChangeLED(148, 0, 211);

//------------------------- Blink------------------------------------------------------

misty.Set("eyeMemory", "Homeostasis.png");

function _blink_now() 
{
    misty.DisplayImage("blinkMisty.png");
    misty.Pause(200);
    misty.DisplayImage(misty.Get("eyeMemory"));
    misty.RegisterTimerEvent("blink_now", getRandomInt(2, 8) * 1000, false);
}
misty.RegisterTimerEvent("blink_now", getRandomInt(2, 8) * 1000, false);


//------------------------- Hand Movements--------------------------------------------

function _move_hands() 
{
    misty.MoveArmPosition("left", getRandomInt(0, 7), getRandomInt(30, 60)); misty.Pause(50);
    misty.MoveArmPosition("right", getRandomInt(0, 7), getRandomInt(30, 60)); misty.Pause(50);
    misty.RegisterTimerEvent("move_hands", getRandomInt(5, 10) * 1000, false);
}
misty.RegisterTimerEvent("move_hands", getRandomInt(5, 10) * 1000, false);

//------------------------- Head Movements-------------------------------------------------

function _look_around() 
{
    misty.MoveHeadPosition(getRandomInt(-4, 4), getRandomInt(-4, 4), getRandomInt(-4, 4), 100);
    misty.RegisterTimerEvent("look_around", getRandomInt(5, 10) * 1000, false);
}
misty.RegisterTimerEvent("look_around", getRandomInt(5, 10) * 1000, false);

// --------------------------- Random Drive -----------------------------------------------

misty.Set("lastTof", "STRAIGHT");
misty.Set("inCorrecetion", false);
function _drive_random() 
{
    if (Math.random() <= 0.2) 
    {
        drive(0, 0);
        misty.RegisterTimerEvent("drive_random", getRandomInt(10, 20) * 1000, false);
    } 
    else 
    {
        switch (misty.Get("lastTof")) 
        {
            case "LEFT":
                drive(getRandomInt(30, 45), getRandomInt(-20, 0));
                misty.Set("lastTof", "STRAIGHT");
                break;
            case "RIGHT":
                drive(getRandomInt(30, 45), getRandomInt(0, 20));
                misty.Set("lastTof", "STRAIGHT");
                break;
            default:
                drive(getRandomInt(30, 65), getRandomInt(-20, 20));
        }
        misty.RegisterTimerEvent("drive_random", getRandomInt(4, 9) * 1000, false);
    }
}
misty.RegisterTimerEvent("drive_random", getRandomInt(4, 9) * 1000, false); 

function drive(lin, ang) 
{
    if (!misty.Get("inCorrecetion")) 
    {
        misty.Drive(lin, ang);
    }
}




// --------------------------- ToF Bumps in ------------------------------------------------------- 

function registerAllProximitySensors() {

    misty.AddPropertyTest("FrontTOF", "SensorPosition", "==", "Center", "string");
    misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.15, "double"); 
    misty.RegisterEvent("FrontTOF", "TimeOfFlight", 15, true);

    misty.AddPropertyTest("LeftTOF", "SensorPosition", "==", "Left", "string");
    misty.AddPropertyTest("LeftTOF", "DistanceInMeters", "<=", 0.15, "double"); 
    misty.RegisterEvent("LeftTOF", "TimeOfFlight", 15, true);

    misty.AddPropertyTest("RightTOF", "SensorPosition", "==", "Right", "string");
    misty.AddPropertyTest("RightTOF", "DistanceInMeters", "<=", 0.15, "double"); 
    misty.RegisterEvent("RightTOF", "TimeOfFlight", 15, true);

    misty.AddPropertyTest("BackTOF", "SensorPosition", "==", "Back", "string");
    misty.AddPropertyTest("BackTOF", "DistanceInMeters", "<=", 0.15, "double"); 
    misty.RegisterEvent("BackTOF", "TimeOfFlight", 15, true);

    misty.AddReturnProperty("Bumped", "sensorName", );
    misty.RegisterEvent("Bumped", "BumpSensor", 250, true);
}
registerAllProximitySensors();


function _FrontTOF(data) 
{
    if (!misty.Get("inCorrecetion")) 
    {
        misty.Set("inCorrecetion", true);
        misty.Debug("FRONT");    
        misty.Stop();
        updateLED("danger");
        misty.MoveArmPosition("left", 10, 50);
        misty.Pause(50);
        misty.MoveArmPosition("right", 10, 50);
        misty.Pause(2000);
        misty.DriveTime(-35, 0, 300);
        misty.Pause(300);
        misty.DriveTime(-35, -35, 3000);
        misty.Pause(3000);
        misty.Stop();
        updateLED("recovered");
        misty.Set("inCorrecetion", false);
    }
}

function _BackTOF(data) 
{
    if (!misty.Get("inCorrecetion")) 
    {
        misty.Debug("BACK");
        misty.Set("inCorrecetion", true);
        misty.Stop();
        updateLED("danger");
        misty.MoveArmPosition("left", 10, 50);
        misty.Pause(50);
        misty.MoveArmPosition("right", 10, 50);
        misty.Pause(2000);
        misty.DriveTime(35, 0, 3000);
        misty.Pause(3000);
        misty.Stop();
        updateLED("recovered");
        misty.Set("inCorrecetion", false);
    }
}

function _RightTOF(data) 
{
    if (!misty.Get("inCorrecetion")) 
    {
      misty.Debug("RIGHT");
      misty.Set("inCorrecetion", true);
      misty.Set("lastTof", "RIGHT");
      misty.Stop();
      updateLED("danger");
      misty.MoveArmPosition("left", 10, 50);
      misty.Pause(50);
      misty.MoveArmPosition("right", 10, 50);
      misty.Pause(2000);
      misty.DriveTime(-35, 0, 300);
      misty.Pause(300);
      misty.DriveTime(-35, 25, 3000);
      misty.Pause(3000);
      misty.Stop();
      updateLED("recovered");
      misty.Set("inCorrecetion", false);
    }
}

function _LeftTOF(data) 
{
    if (!misty.Get("inCorrecetion")) 
    {
        misty.Debug("LEFT");
        misty.Set("inCorrecetion", true);
        misty.Set("lastTof", "LEFT");
        misty.Stop();
        updateLED("danger");
        misty.MoveArmPosition("left", 10, 50);
        misty.Pause(50);
        misty.MoveArmPosition("right", 10, 50);
        misty.Pause(2000);
        misty.DriveTime(-35, 0, 300);
        misty.Pause(300);
        misty.DriveTime(-35, -25, 3000);
        misty.Pause(3000);
        misty.Stop();
        updateLED("recovered");
        misty.Set("inCorrecetion", false);
    }
}

function _Bumped(data) 
{
    misty.Debug("BUMP SENSOR ");
    var sensor = data.AdditionalResults[0];
    misty.Debug(sensor);

    if (!misty.Get("inCorrecetion")) 
    {
        misty.Set("inCorrecetion", true);

        if (sensor == "Bump_FrontRight") 
        {
            _RightTOF();
        } 
        else if (sensor == "Bump_FrontLeft") 
        {
            _LeftTOF();
        } 
        else if (sensor == "Bump_RearLeft") 
        {
            _BackTOF();
            misty.Set("lastTof", "LEFT");
        } 
        else if (sensor == "Bump_RearRight") 
        {
            _BackTOF();
            misty.Set("lastTof", "RIGHT");
        } 
        else {}
    } 
}

// -------------------------- Support Functions------------------------------------------------

function getRandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateLED(status) 
{
    if (status != "danger") 
    {
        misty.Get("faceRecStatus") ? misty.ChangeLED(0, 255, 0) : misty.ChangeLED(0, 0, 255);
    } 
    else 
    {
        misty.ChangeLED(255, 0, 0);
    }
}


