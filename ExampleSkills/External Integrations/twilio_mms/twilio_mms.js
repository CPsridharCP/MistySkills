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


var jsonBody = 
{
    'Body': '[••] Your Message Here!!',
    'From': '<your-twilio-phone-number>',
    'To': '<to-phone-number>',
    'MediaUrl': '<image-URL>'
};

// base64 encoding of "ACCOUNT_ID:AUTH_TOKEN"
var credentials = "QUN******************************************************************kwZg=="

misty.SendExternalRequest("POST", "https://api.twilio.com/2010-04-01/Accounts/<ACCOUNT_ID>/Messages.json", "Basic", credentials, JSON.stringify(jsonBody), false, false, "", "application/x-www-form-urlencoded");
