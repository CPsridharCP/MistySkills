// This example shows how to reads/write data from/to Misty with Switch Position in D01

// With Switch in position D01 we cannot upload program to Arduino Backpack that attached to Misty. 
// Pull the magnetically attached Arduino Backpack from Misty, upload program and them place it back on Misty.

// In this example 
// READ : if Misty sends Arduino the character "2" the Debug LED connected to Pin 13 will turn on
// READ : if Misty sends Arduino the character "3" the Debug LED connected to Pin 13 will turn off
// WRITE: The Arduino will also send a messge to Misty about the state of the LED

void setup() 
{
    // put your setup code here, to run once:
    Serial.begin(9600);
    pinMode(13,OUTPUT);
}

void loop() 
{
    // put your main code here, to run repeatedly:
    if (Serial.available()) 
    {
        int state = Serial.parseInt();
        if (state == 2)
        {
            Serial.println("LED ON");
            digitalWrite(13,HIGH);
        }
        else if (state == 3)
        {
            Serial.println("LED OFF");
            digitalWrite(13,LOW);
        }
    }
}
