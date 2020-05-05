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

// This example shows how to reads/write data from/to Misty with Switch Position in D89

// With Switch in position D89 we can upload program to Arduino Backpack even when it is attached to Misty. 

// In this example 
// READ : if Misty sends Arduino the character "2" the Debug LED connected to Pin 13 will turn on
// READ : if Misty sends Arduino the character "3" the Debug LED connected to Pin 13 will turn off
// WRITE: The Arduino will also send a messge to Misty about the state of the LED

// Using software serial to switch serial interface from default pins 0 & 1 to pins 8 & 9
#include <SoftwareSerial.h>
SoftwareSerial MistySerial(8, 9); // RX, TX

void setup() 
{
    // put your setup code here, to run once:
    MistySerial.begin(9600);
    pinMode(13,OUTPUT);
}

void loop() 
{
    // put your main code here, to run repeatedly:
    if (MistySerial.available()) 
    {
        int state = MistySerial.parseInt();
        if (state == 2)
        {
            MistySerial.println("LED ON");
            digitalWrite(13,HIGH);
        }
        else if (state == 3)
        {
            MistySerial.println("LED OFF");
            digitalWrite(13,LOW);
        }
    }
}
