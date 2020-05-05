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

// Use PubNub to stream data in and out of Misty through the cloud. More of an IoT tool. 
// A channel is like a chatroom, any message published into the chatroom can be received 
// by all devices that subscribe to the same channel


// PUBLISH
// The SendExternalRequest used with a GET method in the subscrive, timeout at about 20 sconds
// So to keep the skill listening continuously we publish an empty message every 18 seconds
misty.RegisterTimerEvent("keepActive", 18000, true);
function _keepActive() 
{
    misty.SendExternalRequest("POST", "https://ps.pndsn.com/publish/<publish-key>/<subscribe-key>/0/<your-channel-name>/myCallback", null, null, null, false, false, "", "application/json");
}

// SUBSCRIBE
misty.SendExternalRequest("GET", "https://ps.pndsn.com/subscribe/<subscribe-key>/<your-channel-name>/0/0?uuid=<your-channel-client-uuid>", null, null, null, false, false, "", "application/json");

function _SendExternalRequest(data)
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
    latestData = data[data.length-1] || [];
    
    misty.Debug(JSON.stringify(data));
    misty.Debug(latestData);
    misty.Debug(timestamp);
    misty.SendExternalRequest("GET", "https://ps.pndsn.com/subscribe/<subscribe-key>/<your-channel-name>/0/" + timestamp.toString() + "?uuid=<your-channel-client-uuid>", null, null, null, false, false, "", "application/json");
}
