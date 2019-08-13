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

// URL of thee image you would like to download and display on Misty's Screen
// Image is crropped at this point. Future update would include resizing image to fit the screen best.
const url = "https://media-exp2.licdn.com/media-proxy/ext?w=800&h=800&hash=xXxEPkVYlg0hmaiylpH3FBKip8o%3D&ora=1%2CaFBCTXdkRmpGL2lvQUFBPQ%2CxAVta5g-0R6j3QIOyxEmrq2OoACm7QgQV6HZBU3bKmTyi8rdMT-rLISLLOTw4QFSZnZBxw"

misty.SendExternalRequest("GET", url, null, null, "{}", true, true, "downloadImage.jpg");

