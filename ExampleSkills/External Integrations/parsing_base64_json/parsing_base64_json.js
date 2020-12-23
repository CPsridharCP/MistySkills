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

// This skill contains a function to parse JSON data if returned as a base64 string.

// Example:
// Below is an exapmle JSON data returned when creating a google sheet from a JS skill.
// I have encoded this response as a base64 string and have it stored in 'test_base64_encoded_string' variable.
// The example below demonstrates how to parse data from this base64 encoded input.

/*
Input Data: 
{
    "spreadsheetId": "1WviMoE3=====TEST_SHEET_ID=====SIe3nOZE",
    "properties": {
        "title": "Untitled spreadsheet",
        "locale": "en_US",
        "autoRecalc": "ON_CHANGE",
        "timeZone": "Etc/GMT",
        "defaultFormat": {
            "backgroundColor": {
                "red": 1,
                "green": 1,
                "blue": 1
            },
            "padding": {
                "top": 2,
                "right": 3,
                "bottom": 2,
                "left": 3
            },
            "verticalAlignment": "BOTTOM",
            "wrapStrategy": "OVERFLOW_CELL",
            "textFormat": {
                "foregroundColor": {},
                "fontFamily": "arial,sans,sans-serif",
                "fontSize": 10,
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "foregroundColorStyle": {
                    "rgbColor": {}
                }
            },
            "backgroundColorStyle": {
                "rgbColor": {
                    "red": 1,
                    "green": 1,
                    "blue": 1
                }
            }
        },
        "spreadsheetTheme": {
            "primaryFontFamily": "Arial",
            "themeColors": [{
                    "colorType": "ACCENT3",
                    "color": {
                        "rgbColor": {
                            "red": 0.9843137,
                            "green": 0.7372549,
                            "blue": 0.015686275
                        }
                    }
                },
                {
                    "colorType": "ACCENT6",
                    "color": {
                        "rgbColor": {
                            "red": 0.27450982,
                            "green": 0.7411765,
                            "blue": 0.7764706
                        }
                    }
                },
                {
                    "colorType": "ACCENT4",
                    "color": {
                        "rgbColor": {
                            "red": 0.20392157,
                            "green": 0.65882355,
                            "blue": 0.3254902
                        }
                    }
                },
                {
                    "colorType": "ACCENT1",
                    "color": {
                        "rgbColor": {
                            "red": 0.25882354,
                            "green": 0.52156866,
                            "blue": 0.95686275
                        }
                    }
                },
                {
                    "colorType": "ACCENT2",
                    "color": {
                        "rgbColor": {
                            "red": 0.91764706,
                            "green": 0.2627451,
                            "blue": 0.20784314
                        }
                    }
                },
                {
                    "colorType": "LINK",
                    "color": {
                        "rgbColor": {
                            "red": 0.06666667,
                            "green": 0.33333334,
                            "blue": 0.8
                        }
                    }
                },
                {
                    "colorType": "ACCENT5",
                    "color": {
                        "rgbColor": {
                            "red": 1,
                            "green": 0.42745098,
                            "blue": 0.003921569
                        }
                    }
                },
                {
                    "colorType": "TEXT",
                    "color": {
                        "rgbColor": {}
                    }
                },
                {
                    "colorType": "BACKGROUND",
                    "color": {
                        "rgbColor": {
                            "red": 1,
                            "green": 1,
                            "blue": 1
                        }
                    }
                }
            ]
        }
    },
    "sheets": [{
        "properties": {
            "sheetId": 0,
            "title": "Sheet1",
            "index": 0,
            "sheetType": "GRID",
            "gridProperties": {
                "rowCount": 1000,
                "columnCount": 26
            }
        }
    }],
    "spreadsheetUrl": "https://docs.google.com/spreadsheets/d/1Wvi=====URL_TEST===="
}
*/

var test_base64_encoded_string = "ewogICJzcHJlYWRzaGVldElkIjogIjFXdmlNb0UzPT09PT1URVNUX1NIRUVUX0lEPT09PT1TSWUzbk9aRSIsCiAgInByb3BlcnRpZXMiOiB7CiAgICAidGl0bGUiOiAiVW50aXRsZWQgc3ByZWFkc2hlZXQiLAogICAgImxvY2FsZSI6ICJlbl9VUyIsCiAgICAiYXV0b1JlY2FsYyI6ICJPTl9DSEFOR0UiLAogICAgInRpbWVab25lIjogIkV0Yy9HTVQiLAogICAgImRlZmF1bHRGb3JtYXQiOiB7CiAgICAgICJiYWNrZ3JvdW5kQ29sb3IiOiB7CiAgICAgICAgInJlZCI6IDEsCiAgICAgICAgImdyZWVuIjogMSwKICAgICAgICAiYmx1ZSI6IDEKICAgICAgfSwKICAgICAgInBhZGRpbmciOiB7CiAgICAgICAgInRvcCI6IDIsCiAgICAgICAgInJpZ2h0IjogMywKICAgICAgICAiYm90dG9tIjogMiwKICAgICAgICAibGVmdCI6IDMKICAgICAgfSwKICAgICAgInZlcnRpY2FsQWxpZ25tZW50IjogIkJPVFRPTSIsCiAgICAgICJ3cmFwU3RyYXRlZ3kiOiAiT1ZFUkZMT1dfQ0VMTCIsCiAgICAgICJ0ZXh0Rm9ybWF0IjogewogICAgICAgICJmb3JlZ3JvdW5kQ29sb3IiOiB7fSwKICAgICAgICAiZm9udEZhbWlseSI6ICJhcmlhbCxzYW5zLHNhbnMtc2VyaWYiLAogICAgICAgICJmb250U2l6ZSI6IDEwLAogICAgICAgICJib2xkIjogZmFsc2UsCiAgICAgICAgIml0YWxpYyI6IGZhbHNlLAogICAgICAgICJzdHJpa2V0aHJvdWdoIjogZmFsc2UsCiAgICAgICAgInVuZGVybGluZSI6IGZhbHNlLAogICAgICAgICJmb3JlZ3JvdW5kQ29sb3JTdHlsZSI6IHsKICAgICAgICAgICJyZ2JDb2xvciI6IHt9CiAgICAgICAgfQogICAgICB9LAogICAgICAiYmFja2dyb3VuZENvbG9yU3R5bGUiOiB7CiAgICAgICAgInJnYkNvbG9yIjogewogICAgICAgICAgInJlZCI6IDEsCiAgICAgICAgICAiZ3JlZW4iOiAxLAogICAgICAgICAgImJsdWUiOiAxCiAgICAgICAgfQogICAgICB9CiAgICB9LAogICAgInNwcmVhZHNoZWV0VGhlbWUiOiB7CiAgICAgICJwcmltYXJ5Rm9udEZhbWlseSI6ICJBcmlhbCIsCiAgICAgICJ0aGVtZUNvbG9ycyI6IFsKICAgICAgICB7CiAgICAgICAgICAiY29sb3JUeXBlIjogIkFDQ0VOVDMiLAogICAgICAgICAgImNvbG9yIjogewogICAgICAgICAgICAicmdiQ29sb3IiOiB7CiAgICAgICAgICAgICAgInJlZCI6IDAuOTg0MzEzNywKICAgICAgICAgICAgICAiZ3JlZW4iOiAwLjczNzI1NDksCiAgICAgICAgICAgICAgImJsdWUiOiAwLjAxNTY4NjI3NQogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAiY29sb3JUeXBlIjogIkFDQ0VOVDYiLAogICAgICAgICAgImNvbG9yIjogewogICAgICAgICAgICAicmdiQ29sb3IiOiB7CiAgICAgICAgICAgICAgInJlZCI6IDAuMjc0NTA5ODIsCiAgICAgICAgICAgICAgImdyZWVuIjogMC43NDExNzY1LAogICAgICAgICAgICAgICJibHVlIjogMC43NzY0NzA2CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJjb2xvclR5cGUiOiAiQUNDRU5UNCIsCiAgICAgICAgICAiY29sb3IiOiB7CiAgICAgICAgICAgICJyZ2JDb2xvciI6IHsKICAgICAgICAgICAgICAicmVkIjogMC4yMDM5MjE1NywKICAgICAgICAgICAgICAiZ3JlZW4iOiAwLjY1ODgyMzU1LAogICAgICAgICAgICAgICJibHVlIjogMC4zMjU0OTAyCiAgICAgICAgICAgIH0KICAgICAgICAgIH0KICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJjb2xvclR5cGUiOiAiQUNDRU5UMSIsCiAgICAgICAgICAiY29sb3IiOiB7CiAgICAgICAgICAgICJyZ2JDb2xvciI6IHsKICAgICAgICAgICAgICAicmVkIjogMC4yNTg4MjM1NCwKICAgICAgICAgICAgICAiZ3JlZW4iOiAwLjUyMTU2ODY2LAogICAgICAgICAgICAgICJibHVlIjogMC45NTY4NjI3NQogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAiY29sb3JUeXBlIjogIkFDQ0VOVDIiLAogICAgICAgICAgImNvbG9yIjogewogICAgICAgICAgICAicmdiQ29sb3IiOiB7CiAgICAgICAgICAgICAgInJlZCI6IDAuOTE3NjQ3MDYsCiAgICAgICAgICAgICAgImdyZWVuIjogMC4yNjI3NDUxLAogICAgICAgICAgICAgICJibHVlIjogMC4yMDc4NDMxNAogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAiY29sb3JUeXBlIjogIkxJTksiLAogICAgICAgICAgImNvbG9yIjogewogICAgICAgICAgICAicmdiQ29sb3IiOiB7CiAgICAgICAgICAgICAgInJlZCI6IDAuMDY2NjY2NjcsCiAgICAgICAgICAgICAgImdyZWVuIjogMC4zMzMzMzMzNCwKICAgICAgICAgICAgICAiYmx1ZSI6IDAuOAogICAgICAgICAgICB9CiAgICAgICAgICB9CiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAiY29sb3JUeXBlIjogIkFDQ0VOVDUiLAogICAgICAgICAgImNvbG9yIjogewogICAgICAgICAgICAicmdiQ29sb3IiOiB7CiAgICAgICAgICAgICAgInJlZCI6IDEsCiAgICAgICAgICAgICAgImdyZWVuIjogMC40Mjc0NTA5OCwKICAgICAgICAgICAgICAiYmx1ZSI6IDAuMDAzOTIxNTY5CiAgICAgICAgICAgIH0KICAgICAgICAgIH0KICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJjb2xvclR5cGUiOiAiVEVYVCIsCiAgICAgICAgICAiY29sb3IiOiB7CiAgICAgICAgICAgICJyZ2JDb2xvciI6IHt9CiAgICAgICAgICB9CiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAiY29sb3JUeXBlIjogIkJBQ0tHUk9VTkQiLAogICAgICAgICAgImNvbG9yIjogewogICAgICAgICAgICAicmdiQ29sb3IiOiB7CiAgICAgICAgICAgICAgInJlZCI6IDEsCiAgICAgICAgICAgICAgImdyZWVuIjogMSwKICAgICAgICAgICAgICAiYmx1ZSI6IDEKICAgICAgICAgICAgfQogICAgICAgICAgfQogICAgICAgIH0KICAgICAgXQogICAgfQogIH0sCiAgInNoZWV0cyI6IFsKICAgIHsKICAgICAgInByb3BlcnRpZXMiOiB7CiAgICAgICAgInNoZWV0SWQiOiAwLAogICAgICAgICJ0aXRsZSI6ICJTaGVldDEiLAogICAgICAgICJpbmRleCI6IDAsCiAgICAgICAgInNoZWV0VHlwZSI6ICJHUklEIiwKICAgICAgICAiZ3JpZFByb3BlcnRpZXMiOiB7CiAgICAgICAgICAicm93Q291bnQiOiAxMDAwLAogICAgICAgICAgImNvbHVtbkNvdW50IjogMjYKICAgICAgICB9CiAgICAgIH0KICAgIH0KICBdLAogICJzcHJlYWRzaGVldFVybCI6ICJodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9zcHJlYWRzaGVldHMvZC8xV3ZpPT09PT1VUkxfVEVTVD09PT0iCn0="

// Print the string to console
misty.Debug("Plain String")
misty.Debug(get_string_from_base64(test_base64_encoded_string));
// Print the JSON string to console
misty.Debug("JSONified String")
misty.Debug(JSON.stringify(get_string_from_base64(test_base64_encoded_string)));

// Parsing data form the JSON
misty.Debug("Parse JSON data")
let parsed_json = JSON.parse(get_string_from_base64(test_base64_encoded_string));
misty.Debug(parsed_json.spreadsheetId);
misty.Debug(parsed_json.spreadsheetUrl);


function get_string_from_base64(dataIn)
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
    return Base64.decode(dataIn);
}