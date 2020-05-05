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


// Misty Registers for event TouchSensor with Event Name "Touched"
// You could change event name ("Touched") to anything you like while the event "TouchSensor" cannot be changed 
misty.AddReturnProperty("Touched", "SensorPosition");
misty.AddReturnProperty("Touched", "IsContacted");
misty.RegisterEvent("Touched", "TouchSensor", 50 ,true);

function _Touched(data)
{
    var sensor = data.AdditionalResults[0];
    var isPressed = data.AdditionalResults[1];
	isPressed ? misty.Debug(sensor+" is Touched") : misty.Debug(sensor+" is Released");
    
    if (isPressed)
    {
        if (sensor == "Chin")
        {            
            misty.PlayAudio("s_PhraseOwwww.wav");   
        } 
        else if (sensor == "HeadRight")
        {
            misty.PlayAudio("s_PhraseEvilAhHa.wav");   
        } 
        else if (sensor == "HeadLeft")
        {
            misty.PlayAudio("s_Distraction.wav");   
        } 
        else if (sensor == "HeadFront")
        {
            misty.PlayAudio("s_Acceptance.wav");
        } 
        else if (sensor == "HeadBack")
        {
            misty.PlayAudio("s_Disapproval.wav");
        } 
        else if (sensor == "Scruff")
        {
            misty.PlayAudio("s_Grief.wav");
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
