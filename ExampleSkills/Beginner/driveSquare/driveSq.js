// The Heading Misty Faces on Boot up is her Zero. Or you could use the reset IMU before starting to drive
function sq_drive() 
{
    var i;
    for (i = 0; i < 360; i+=90) 
    {
        misty.DriveHeading(i, 0.5, 3000, false);
        misty.Pause(3500); // Play with this to a non  stop Square Drive
        misty.DriveArc(i+90, 0.5, 3000, false);
        misty.Pause(3500); // Play with this to a non  stop Square Drive
    }
    sq_drive();
}

// Getting Misty to Zero Heading
misty.DriveArc(0, 0.0, 5000, false);
misty.Pause(5000);

sq_drive();