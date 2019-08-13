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

// Receiving message from Misty to Arduino / Backpack Rx Tx
subscribeToBackpackData();

function subscribeToBackpackData()
{
    misty.AddReturnProperty("backpackMessage", "SerialMessage");
    misty.RegisterEvent("backpackMessage", "SerialMessage", 50, true);
}

function _backpackMessage(data)
{	
    misty.Debug(data.AdditionalResults[0].Message);
}

// Sending message from Misty to Arduino / Backpack Rx Tx
misty.WriteSerial("Hello Serial Rx Tx Testing from Misty !!");
