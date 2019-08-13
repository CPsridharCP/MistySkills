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

// As of the current release new video recordings overwrite the old ones
// and Misty holds only one video in memory. 

misty.StartRecordingVideo();
misty.Pause(5000);
misty.StopRecordingVideo();

// You could pull the video out using command centre or postman(recommended) 
// END POINT: http://<robot_ip>/api/video 
// HEADER : Content-Type : video/mp4

// What you could try: Use SendExternalRequest command to the robot IP and get the video in the skill and upload it
