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

// Until Misty supports playing GIFs , i decided to use this 
// Needs a little bit of pre-work but works :) 

// Step 1 : Go to http://gifgifs.com/split/
// Step 2 : Upload you git and then click Extract Frames
// Step 3 : Click Download all frames as .ZIP archive
// Step 4 : Delete all the files in the frames folder found in this repo
// Step 5 : Unzip the file downloaded from Step4 and copy paste the images into our frames folder
// Step 6 : Change the start and end variables here in the code to match the number of frames downloaded on your GIF
// Step 7 : If you also have filenames prefixes of postfixed with someText, you could add that in the function call as well. 
// Step 8 : Drag Drop or upload the gifs.js, gifs.json, and the frames folder using Misty's skill ruinner http://sdk.mistyrobotics.com/skill-runner/index.html
// Run  the skill and have fun !

let start = 0;
let end = 13;

function playGIF(start, end, loopCount = 1, format = ".GIF",  filenamePrefix = "", filenamePostfix = "")
{
    misty.SetBlinking(false);

    let temp = start;
    for (let index = 0; index < loopCount; index++) 
    {
        start = temp;
        while (start <= end) {
            misty.DisplayImage(filenamePrefix + start.toString() + filenamePostfix + format);
            misty.Pause(120);
            start = start + 1;
        }    
    }

    misty.SetBlinking(true);
    misty.DisplayImage("e_DefaultContent.jpg");
}

playGIF(start, end, 5);