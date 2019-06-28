// Misty Registers for event BumpSensor with Event Name "Bumped"
// You could change event name ("Bumped") to anything you like while the event "BumpSensor" cannot be changed 
misty.AddReturnProperty("Bumped", "sensorName");
misty.AddReturnProperty("Bumped", "IsContacted");
misty.RegisterEvent("Bumped", "BumpSensor", 50 ,true);


function _Bumped(data) 
{
    var sensor = data.AdditionalResults[0];
    var isPressed = data.AdditionalResults[1];
	isPressed ? misty.Debug(sensor+" is Pressed") : misty.Debug(sensor+" is Released");
    
    if (isPressed)
    {
        if (sensor == "Bump_FrontRight")
        {
            misty.PlayAudio("003-Screetch.wav");   
        } 
        else if (sensor == "Bump_FrontLeft")
        {
            misty.PlayAudio("020-Whoap.wav");   
        } 
        else if (sensor == "Bump_RearLeft")
        {
            misty.PlayAudio("015-Meow.wav");   
        } 
        else if (sensor == "Bump_RearRight")
        {
            misty.PlayAudio("031-Psspewpew.wav");
        } 
        else 
        {
            misty.Debug("Sensor Name Unknown");
        }
    }
 }

// Other things to explore
//  misty.DisplayImage("Angry.png");
//  misty.ChangeLED(0, 0, 0);  // R, G, B
