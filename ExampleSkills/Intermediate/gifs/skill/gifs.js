/**************************************************************************
WARRANTY DISCLAIMER.

General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS
PROVIDES THIS SAMPLE SOFTWARE “AS-IS” AND DISCLAIMS ALL WARRANTIES AND 
CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES 
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, 
ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES 
NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. 
MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, 
FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE. 
Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN 
DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) 
ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, 
PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, 
RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT. 

Please refer to the Misty Robotics End User License Agreement for further information 
and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/

Copyright 2020 Misty Robotics Licensed under the Apache License, Version 2.0 
http://www.apache.org/licenses/LICENSE-2.0
***************************************************************************/

// UPDATE: misty.DisplayImage("Picture.GIF"); has now been enabled to directly display GIFs. 
// You may not want to blast images like this anymore !! Cheers !!

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
            misty.Pause(50);
            start = start + 1;
        }    
    }

    misty.SetBlinking(true);
    misty.DisplayImage("e_DefaultContent.jpg");
}

playGIF(start, end, 5);
