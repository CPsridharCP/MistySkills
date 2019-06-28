misty.Set("eyeMemory", "Homeostasis.png");

function _blink_now(repeat = true) 
{
    misty.DisplayImage("blinkMisty.png");
    misty.Pause(200);
    misty.DisplayImage(misty.Get("eyeMemory"));
    if (repeat) misty.RegisterTimerEvent("blink_now", getRandomInt(2, 8) * 1000, false);
}
misty.RegisterTimerEvent("blink_now", getRandomInt(2, 8) * 1000, false);

function getRandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}