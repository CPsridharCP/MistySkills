/**********************************************************************
    Copyright 2020 Misty Robotics
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
        http://www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

    **WARRANTY DISCLAIMER.**

    * General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY
    ROBOTICS PROVIDES THIS SAMPLE SOFTWARE "AS-IS" AND DISCLAIMS ALL
    WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY,
    INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
    PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF
    THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC
    RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO
    WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES
    OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
    * Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT
    YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY
    ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO
    ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT,
    COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE
    OR PRODUCT.

    Please refer to the Misty Robotics End User License Agreement for further
    information and full details:
        https://www.mistyrobotics.com/legal/end-user-license-agreement/
**********************************************************************/

// Snippet functions to push and get data form google sheets.
// You would need to enable google sheets api on your project and make sure this api is covered in the scope of the access token.

// The examples belowe cover one way of doing this. Check out https://developers.google.com/sheets/api/guides/concepts for more details.
// sheet_id and access_token are held in the .JSON for this example. It can as well be dynamically handled in the skill.

// SEND Data to Google Sheet - Call
function add_row_to_google_sheet() {
    misty.Debug("Info: Sending data to google sheets.");

    // Example data
    var jsonData = {
        "values": ["CP", "cp@mistyrobotics.com", "Robotics/Prototypping Enginner"]
    }
    misty.SendExternalRequest("POST", "https://sheets.googleapis.com/v4/spreadsheets/" + _params.sheet_id + "/values/Sheet1!1%3A1:append?insertDataOption=INSERT_ROWS&responseValueRenderOption=FORMATTED_VALUE&valueInputOption=RAW", "Bearer", _params.access_token, JSON.stringify(jsonData), false, false, null, "application/json", "_google_sheet_update_response");
}

// SEND Data to Google Sheet - Response
function _google_sheet_update_response(data) {
    misty.Debug(JSON.stringify(data));
}

// GET Data from Google Sheet - Call
function get_data_from_gooogle_sheets() {
    misty.Debug("Info: Getting data from google sheets.");
    misty.SendExternalRequest("GET", "https://sheets.googleapis.com/v4/spreadsheets/" + _params.sheet_id + "/values/T%26D!A2%3AZ?majorDimension=ROWS", "Bearer", _params.access_token, null, false, false, null, "application/json", "_gooogle_sheet_data");
}

// GET Data from Google Sheet - Ressponse
function _gooogle_sheet_data(data) {
    // misty.Debug(JSON.stringify(data));
    try {
        let response = JSON.parse(data.Result.ResponseObject.Data);
        
        // You can access data of each cell by iteration through rows and columns indexes
        // response.values[row_index][column_index]

        // Example - Iterate through each row
        for (var i = 0; i < response.values.length; i++) {
            // Row index i
            misty.Debug(response.values[i]);
            // Column index 0
            misty.Debug(response.values[i][0]); 
            // Column index 1
            misty.Debug(response.values[i][0]);
        }

    } catch (error) {
        misty.Debug("Error: Failed to pull data from Google Sheet");
        misty.Debug(error);
    }
}