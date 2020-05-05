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

misty.Debug("SIGNAL TwilioBooth Photobooth Skill");

misty.Set("contact", "<backupPhoneNumber>", false);
misty.Set("lastUpdate", "Some Date", false);
misty.Set("imageLink", "<some-image-url>", false);
misty.Set("pictureMode", false, false);
misty.Set("touchMode", false, false);

misty.DisplayImage("e_DefaultContent.jpg");

misty.Pause(2000);

misty.ChangeLED(140, 0, 255);

misty.RegisterTimerEvent("keepActive", 18000, true);

function _keepActive() {
    misty.SendExternalRequest("POST", "https://ps.pndsn.com/publish/<publish-key>/<subscribe-key>/0/<pubnub-channel>/myCallback", null, null, null, false, false, "", "application/json");
}

misty.SendExternalRequest("GET", "https://ps.pndsn.com/subscribe/<subscribe-key>/<pubnub-channel>/0/0?uuid=<any-user-name>", null, null, null, false, false, "", "application/json", "_pubNubSubscribe");

function _pubNubSubscribe(data) {
    outputExt(data.Result.ResponseObject.Data);
}

function outputExt(dataIn) {
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

    if (data != [] && data.type == 'photo') {
        misty.Set("contact", (data.phNumber).toString(), false);
        misty.DisplayImage("e_SystemCamera.jpg");
        misty.Pause(100);
        misty.PlayAudio("s_Awe3.wav", 100);
        misty.Set("pictureMode", true, false);
        misty.MoveHeadDegrees(0, 0, 0, 45);
        misty.Pause(3000);
        misty.DisplayImage("e_SystemFlash.jpg");
        misty.ChangeLED(255, 255, 255);
        misty.PlayAudio("s_SystemCameraShutter.wav", 100);
        misty.TakePicture("Photobooth", 375, 812, false, true);
        misty.Pause(200);
        misty.DisplayImage("e_SystemCamera.jpg");
        misty.ChangeLED(140, 0, 255);
        misty.Pause(500);
        misty.DisplayImage("e_Joy2.jpg");
    }
    misty.Debug("Subscribed to Pubnub");
    misty.SendExternalRequest("GET", "https://ps.pndsn.com/subscribe/<subscribe-key>/<pubnub-channel>/0/" + timestamp.toString() + "?uuid=<any-user-name>", null, null, null, false, false, "", "application/json", "_pubNubSubscribe");
}

// ------------------------------ Click, Upload, Get URL -------------------------------
function _TakePicture(data) {
    var base64String = data.Result.Base64;
    misty.Debug("Original Image");
    misty.Debug(base64String.length);
    misty.Debug(base64String.substring(base64String.length - 100, base64String.length));
    uploadImage(base64String);
}

function uploadImage(imageData) {
    var jsonBody = {
        'image': imageData,
        'type': 'base64',
        'album': '<imgur-album-id>'
    };
    misty.SendExternalRequest("POST", "https://api.imgur.com/3/image", "Bearer", "<imgur-key>", JSON.stringify(jsonBody), false, false, "", "application/json", "_imageUploadResponse");
}

function _imageUploadResponse(responseData) {
    misty.Debug(JSON.parse(responseData.Result.ResponseObject.Data).data.link);
    misty.Set("imageLink", JSON.parse(responseData.Result.ResponseObject.Data).data.link, false);
    misty.RegisterTimerEvent("resetEyes", 4000, false);
    misty.Set("pictureMode", false, false);
    misty.Set("pictureMode", false, false);
    sendPicture();
}

function _resetEyes() {
    misty.DisplayImage("e_DefaultContent.jpg");
    misty.Set("pictureMode", false, false);
    misty.Set("pictureMode", false, false);
}

// -------------------------------------------------------------------------------------------

function sendPicture() {
    misty.Debug("Sending Image to User");

    var jsonBody = {
        'Body': '<your-message>',
        'From': '<your-twilio-ph-number>',
        'To': misty.Get("contact"),
        'MediaUrl': misty.Get("imageLink")
    };

    var credentials = "<twilio-account-key>"
    misty.SendExternalRequest("POST", "https://api.twilio.com/2010-04-01/Accounts/<twilio-account-id>/Messages.json", "Basic", credentials, JSON.stringify(jsonBody), false, false, "", "application/x-www-form-urlencoded");
}


function _SendExternalRequest(data) {
    misty.Debug(JSON.stringify(data));
}

// ------------------------------- Looking Around ------------------------------------


function _look_around(repeat = true) {
    if (!misty.Get("pictureMode") && !misty.Get("touchMode")) misty.MoveHeadPosition(getRandomInt(-4, 4), getRandomInt(-4, 4), getRandomInt(-4, 4), 40);
    if (repeat) misty.RegisterTimerEvent("look_around", getRandomInt(5, 10) * 1000, false);
}
misty.RegisterTimerEvent("look_around", getRandomInt(5, 10) * 1000, false);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

misty.AddReturnProperty("Touched", "sensorPosition");
misty.AddReturnProperty("Touched", "IsContacted");
misty.RegisterEvent("Touched", "TouchSensor", 50, true);

function _Touched(data) {
    var sensor = data.AdditionalResults[0];
    var isPressed = data.AdditionalResults[1];
    isPressed ? misty.Debug(sensor + " is Touched") : misty.Debug(sensor + " is Released");

    if (isPressed) {

        misty.Set("touchMode", true, false);

        if (sensor == "Chin") {
            misty.DisplayImage("e_Love.jpg");
            misty.Pause(200);
            misty.PlayAudio("s_Love.wav");
            misty.ChangeLED(0, 255, 0);
            misty.MoveHeadDegrees(null, -30, null, 50);
            misty.Pause(3000);
            misty.ChangeLED(140, 0, 255);
            misty.MoveHeadDegrees(0, 0, 0, 40);
            misty.DisplayImage("e_DefaultContent.jpg");

        } else {
            misty.DisplayImage("e_Anger.jpg");
            misty.Pause(200);
            misty.PlayAudio("s_Annoyance3.wav");
            misty.ChangeLED(255, 0, 0);
            misty.MoveHeadDegrees(0, 0, 0, 60);
            misty.Pause(2000);
            misty.ChangeLED(140, 0, 255);
            misty.DisplayImage("e_DefaultContent.jpg");
        }
        misty.Set("touchMode", false, false);

    }
}
