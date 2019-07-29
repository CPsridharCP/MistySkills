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

misty.TakePicture("TestImage", 375, 812, false, true);

function _TakePicture(data) 
{
    var base64String = data.Result.Base64;
    uploadImage(base64String);
}

function uploadImage(imageData) 
{
    var jsonBody = 
    {
        'image': imageData,
        'type': 'base64',
        'album': '<album-id>'
    };
    // To get your access token hit this endpoint (could use postman) https://api.imgur.com/oauth2/authorize?client_id=<client-id>&response_type=token
    misty.SendExternalRequest("POST", "https://api.imgur.com/3/image", "Bearer", "<access-token>", JSON.stringify(jsonBody), false, false, "", "application/json", "_imageUploadResponse");
}

function _imageUploadResponse(responseData) 
{
    const imageURL = JSON.parse(responseData.Result.ResponseObject.Data).data.link;
    misty.Debug(imageURL);
}

// You could further send this image as an MMS to your mobile phone. Checkout twilio_mms example
