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
