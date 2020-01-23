/*
*    Copyright 2020 Misty Robotics, Inc.
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

// By default all messages that go out and come into Misty are converted to String type
// The code below remains the same irrespective of the position of the switch (D01/D89) in the Arduino Backpack 

// Receiving message from Arduino/Backpack on Misty
function subscribeToBackpackData()
{
    misty.AddReturnProperty("backpackMessage", "SerialMessage");
    misty.RegisterEvent("backpackMessage", "SerialMessage", 50, true);
}
subscribeToBackpackData();

function _backpackMessage(data)
{	
    misty.Debug(data.AdditionalResults[0].Message);
}

// Sending a message from Misty to Arduino/Backpack
misty.WriteSerial("This is Misty sending a string to the Serial interface on the Backpack!!");
