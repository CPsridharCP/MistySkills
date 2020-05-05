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

// Misty Drives forwards and stops on seieng an obstacle 15cm or closer

// Filtering Front Centre Time Of Flight Data and triggering callback only if
// range measured is less than 15cm

misty.AddPropertyTest("FrontTOF", "SensorPosition", "==", "Center", "string"); 
misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 0.15, "double"); 
misty.RegisterEvent("FrontTOF", "TimeOfFlight", 0, false);

misty.ChangeLED(144, 0, 230);
misty.Pause(1000);

// UNCOMMENT the below line to see Misty drive straight and stop at an obstacle encounter
// misty.Drive(20, 0);

// All possible sensor positions would be
// Center
// Left
// Right
// Back
// DownFrontRight
// DownFrontLeft
// DownBackRight
// DownBackLeft

function _FrontTOF(data) 
{
    misty.Debug(data.PropertyTestResults[0].PropertyParent.DistanceInMeters);
    misty.Stop();
    misty.ChangeLED(255, 0, 0);
    misty.PlayAudio("<audio_file_with_extension>");
}

