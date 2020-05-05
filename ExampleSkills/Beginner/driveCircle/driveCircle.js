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

// The Heading Misty Faces on Boot up is her Zero. Or you could use the reset IMU before starting to drive

// Centering Misty to IMU 0   
// -- Checkout Intermediate skills to figure out how to start with current pose as home
// Misty drives in a circle of radius 0.5m 

misty.DriveArc(0, 0.0, 4000, false);
misty.Pause(4000);

function circle_drive() 
{

    for (var i = 1; i <= 4; i += 1) 
    {
        misty.DriveArc(i*90, 0.5, 3000, false);
        misty.Pause(2900);
    }
    circle_drive();
}
circle_drive();
