// The Heading Misty Faces on Boot up is her Zero. Or you could use the reset IMU before starting to drive
function sq_drive() 
{
    var i;
    for (i = 0; i < 360; i+=90) 
    {
        misty.DriveHeading(i, 1.0, 3000, false);
        misty.Pause(3000);
        misty.DriveArc(i+90, 1.0, 2000, false);
        misty.Pause(2000);
    }
    sq_drive();
}

// Getting Misty to Zero Heading
misty.DriveArc(0, 0.0, 4000, false);
misty.Pause(4000);

sq_drive();