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

misty.Debug("Text To Control Misty Skill");

misty.DisplayImage("e_DefaultContent.jpg");
misty.Set("lastUpdate", "Some Date", false);
misty.Set("robotYaw", 0.0);
misty.Set("base64", "someAudio", false);

registerIMU();
misty.ChangeLED(140, 0, 255);

misty.RegisterTimerEvent("keepActive", 18000, true);

function _keepActive() {
    misty.SendExternalRequest("POST", "https://ps.pndsn.com/publish/<publish-key>/<subscribe-key>/0/<pubnub-channel>/myCallback", null, null, null, false, false, "", "application/json");
}

misty.SendExternalRequest("GET", "https://ps.pndsn.com/subscribe/<subscribe-key>/<pubnub-channel>/0/0?uuid=<any-user-name>", null, null, null, false, false, "", "application/json", "_pubNubSubscribe");

function _pubNubSubscribe(data) 
{
    outputExt(data.Result.ResponseObject.Data);
}

function outputExt(dataIn) 
{
    var Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        decode: function (e) {
            var t = "";
            var n, r, i;
            var s, o, u, a;
            var f = 0;
            // e = e.replace(/[^\[{]*[a-zA-Z0-9_]/g, "");
            // e = e.replace(/++[++^A-Za-z0-9+/=]/g, "");
            while (f < e.length) {
                s = this._keyStr.indexOf(e.charAt(f++));
                o = this._keyStr.indexOf(e.charAt(f++));
                u = this._keyStr.indexOf(e.charAt(f++));
                a = this._keyStr.indexOf(e.charAt(f++));
                n = s << 2 | o >> 4;
                r = (o & 15) << 4 | u >> 2;
                i = (u & 3) << 6 | a;
                t = t + String.fromCharCode(n);
                if (u != 64) {
                    t = t + String.fromCharCode(r)
                }
                if (a != 64) {
                    t = t + String.fromCharCode(i)
                }
            }
            t = Base64._utf8_decode(t);
            return t
        },
        _utf8_decode: function (e) {
            var t = "";
            var n = 0;
            var r = c1 = c2 = 0;
            while (n < e.length) {
                r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r);
                    n++
                } else if (r > 191 && r < 224) {
                    c2 = e.charCodeAt(n + 1);
                    t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                    n += 2
                } else {
                    c2 = e.charCodeAt(n + 1);
                    c3 = e.charCodeAt(n + 2);
                    t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                    n += 3
                }
            }
            return t
        }
    }

    var decoded = Base64.decode(dataIn);
    decoded = JSON.parse(decoded.split(","));

    var timestamp = decoded.pop();
    var data = decoded.pop();
    data = data[data.length - 1] || [];

    misty.Debug(JSON.stringify(data));
    misty.Debug(timestamp);

    if (data != [] && data != {}) {
        if (data.type == 'color') misty.ChangeLED(data.red, data.green, data.blue);

        else if (data.type == 'head') misty.MoveHeadPosition(data.pitch, data.roll, data.yaw, 25);

        else if (data.type == 'drive') misty.DriveHeading(misty.Get("robotYaw"), data.distance / 100.0, data.distance * 80, data.reverse);

        else if (data.type == 'turn') misty.DriveArc(offset_heading(data.degrees), 0.0, Math.abs(data.degrees) * 100 / 3, false);

        else if (data.type == 'say') 
        {

            var base64 = data.say;
            var next = data.next;
            misty.Debug(next);
            misty.Debug(typeof next);

            if (next == "None") 
            {
                misty.Debug(data.text);
                misty.SaveAudio("tts.wav", (misty.Get("base64") == "someAudio") ? base64 : misty.Get("base64") + base64, true, true);
                misty.Set("base64", "someAudio", false);
                misty.Set("base64", "someAudio", false);
                misty.Set("base64", "someAudio", false);
            } 
            else 
            {
                (next == 1) ? misty.Set("base64", base64, false): misty.Set("base64", misty.Get("base64") + base64, false);
            }

        } 
        
        else if (data.type == 'hands') 
        {
            misty.Debug(data.left);
            misty.Debug(data.right);
            misty.MoveArmDegrees("left", data.left, 15);
            misty.Pause(50);
            misty.MoveArmDegrees("right", data.right, 15);
        } 
        
        else if (data.type == 'mood') 
        {
            changeMood(data.mood);
        }

        else if (data.type == 'stop') 
        {
            misty.ChangeLED(140,0,0);
            misty.Stop();
        }

    }
    misty.Debug("Subscribed to Pubnub");
    misty.SendExternalRequest("GET", "https://ps.pndsn.com/subscribe/<subscribe-key>/<pubnub-channel>/0/" + timestamp.toString() + "?uuid=<any-user-name>", null, null, null, false, false, "", "application/json", "_pubNubSubscribe");
}

function changeMood(mood) 
{
    if (mood == "happy") 
    {
        misty.DisplayImage("e_Joy2.jpg");
        misty.Pause(100);
        misty.PlayAudio("s_Joy2.wav", 100);
        misty.ChangeLED(0, 255, 0);
        misty.MoveHeadDegrees(-45, 0, 0, 50);
        misty.MoveArmDegrees("right", -45, 50);
        misty.Pause(100);
        misty.MoveArmDegrees("left", -45, 50);

    } 
    else if (mood == "sad") 
    {
        misty.DisplayImage("e_Sadness.jpg");
        misty.Pause(100);
        misty.PlayAudio("s_Sadness6.wav", 100);
        misty.ChangeLED(0, 0, 255);
        misty.MoveHeadDegrees(20, 0, 0, 20);
        misty.MoveArmDegrees("right", 90, 10);
        misty.Pause(100);
        misty.MoveArmDegrees("left", 90, 10);
    } 
    else if (mood == "angry") 
    {
        misty.DisplayImage("e_Anger.jpg");
        misty.Pause(100);
        misty.PlayAudio("s_Annoyance3.wav", 100);
        misty.ChangeLED(255, 0, 0);
        misty.MoveHeadDegrees(0, 0, 0, 70);
        misty.MoveArmDegrees("right", 0, 60);
        misty.Pause(100);
        misty.MoveArmDegrees("left", -45, 60);

    } 
    else if (mood == "sleepy" || mood == "sleep")
    {
        misty.DisplayImage("e_SleepingZZZ.jpg");
        misty.Pause(100);
        misty.PlayAudio("s_SleepySnore.wav", 100);
        misty.ChangeLED(40, 0, 155);
        misty.MoveHeadDegrees(45, -35, 45, 20);
        misty.MoveArmDegrees("right", 90, 60);
        misty.Pause(100);
        misty.MoveArmDegrees("left", 90, 60);

    } 
    else if (mood == "suspicious" || mood == "curious")
    {
        misty.DisplayImage("e_Contempt.jpg");
        misty.Pause(100);
        misty.PlayAudio("s_DisorientedConfused4.wav", 100);
        misty.ChangeLED(255, 165, 0);
        misty.MoveHeadDegrees(-10, 0, 50, 70);
        misty.MoveArmDegrees("right", 90, 60);
        misty.Pause(100);
        misty.MoveArmDegrees("left", -45, 60);
        misty.Pause(1000);
        misty.MoveHeadDegrees(-10, 0, -50, 20);

    }
    misty.RegisterTimerEvent("resetMood", 5000, false);
}

function _resetMood()
{
    misty.DisplayImage("e_DefaultContent.jpg");
    misty.ChangeLED(140, 0, 255);
    misty.Pause(100);
}

function registerIMU() 
{
    misty.RegisterEvent("heading", "IMU", 100, true);
}


function _heading(data) {
    var yaw = data.PropertyTestResults[0].PropertyParent.Yaw;
    if (yaw > 180) yaw -= 360;
    misty.Set("robotYaw", yaw);
    // misty.Debug(yaw.toString()+" <-- Yaw");
}


function offset_heading(to_offset) {
    var heading = misty.Get("robotYaw") + to_offset;
    return (360.0 + (heading % 360)) % 360.0;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

