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
