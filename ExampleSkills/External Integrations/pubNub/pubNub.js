/*
 *    Copyright 2019 Misty Robotics, Inc.
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

// Use PubNub to stream data in and out of Misty through the cloud. More of an IoT tool. 
// A channel is like a chatroom, any message published into the chatroom can be received 
// by all devices that subscribe to the same channel


// PUBLISH
// The SendExternalRequest used with a GET method in the subscrive, timeout at about 20 sconds
// So to keep the skill listening continuously we publish an empty message every 18 seconds
misty.RegisterTimerEvent("keepActive", 18000, true);
function _keepActive() 
{
    misty.SendExternalRequest("POST", "https://ps.pndsn.com/publish/<publish-key>/<subscribe-key>/0/<your-channel-name>/myCallback", null, null, "{}", false, false, "", "application/json");
}

// SUBSCRIBE
misty.SendExternalRequest("GET", "https://ps.pndsn.com/subscribe/<subscribe-key>/<your-channel-name>/0/0?uuid=<your-channel-client-uuid>", null, null, "{}", false, false, "", "application/json");

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
    misty.SendExternalRequest("GET", "https://ps.pndsn.com/subscribe/<subscribe-key>/<your-channel-name>/0/" + timestamp.toString() + "?uuid=<your-channel-client-uuid>", null, null, "{}", false, false, "", "application/json");
}
