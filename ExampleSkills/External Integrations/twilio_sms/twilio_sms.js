var jsonBody = 
{
    'Body' : '[••] Your Message Here!!',
    'From' : '<your-twilio-phone-number>',
    'To'   : '<to-phone-number>'
};

// base64 encoding of "ACCOUNT_ID:AUTH_TOKEN"
var credentials = "QUN******************************************************************kwZg=="

misty.SendExternalRequest("POST", "https://api.twilio.com/2010-04-01/Accounts/<ACCOUNT_ID>/Messages.json", "Basic", credentials, JSON.stringify(jsonBody), false, false, "", "application/x-www-form-urlencoded");