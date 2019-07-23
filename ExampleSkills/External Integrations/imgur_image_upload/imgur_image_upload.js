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