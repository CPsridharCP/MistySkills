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

// URL of the audio file you would like to download and play on Misty
const url = "http://www.moviesoundclips.net/download.php?id=2631&ft=wav"

misty.SendExternalRequest("GET", url, null, null, null, true, true, "downloadAudio.wav");
