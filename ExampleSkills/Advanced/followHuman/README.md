## Follow Human Skill (Object Detection)
[![followHuman](https://i.imgur.com/qEvHDlP.png)](https://youtu.be/CBoTR4kb100)
[https://youtu.be/CBoTR4kb100](https://youtu.be/CBoTR4kb100)

#### Required Build Version 1.18 or greater 

Misty can detect 70 obejcts. You can use this code to track and follow all the 70 objects. 
Scroll down all the way for the complete list.
In this example I have made Misty follow just 1 object - "person". 
This is a first pass. Lots more tunings and improvements can be made. Feel free to play with it.

#### Modes:
Three modes are available. Change the below parameters in the .json file to select mode
"turnInPlace", "followHuman"
The head moves to look at person in all 3 modes
Mode 1: No driving ("turnInPlace" : false, "followHuman" : false)
Mode 2: Allow turning in place, but not driving forward/backward ("turnInPlace" : true, "followHuman" : false)
Mode 3: Allow full driving ("turnInPlace" : true/false, "followHuman" : true)

#### Note:
Hazards triggered might stop Misty. The skill will play an "Uhoh" audio when that happens.
Make sure the ToF covers are clean. And if you would like Misty to not play the audio, set "silentMode" to true in the .json file
You could also turn off Hazard System from stopping the robot through the API Explorer by setting all ToF values to 0 (sdk.mistyrobotics.com)

#### Turning:
There are lots of magic numbers in _personDetection() function.. Play with it!

#### Things to improve:
Prioritize tracking of the closest person when there are multiple people in the FOV.

#### List of 70 objects Misty can also detect and track with this skill:
<pre>
person
bicycle
car
motorcycle
airplane
bus
train
truck
boat
traffic light
fire hydrant
stop sign
parking meter
bench
bird
cat
dog
horse
sheep
cow
elephant
bear
zebra
giraffe
backpack
umbrella
handbag
tie
suitcase
frisbee
skis
snowboard
sports ball
kite
baseball bat
baseball glove
skateboard
surfboard
tennis racket
bottle
wine glass
cup
fork
knife
spoon
bowl
banana
apple
sandwich
orange
broccoli
carrot
hot dog
pizza
donut
cake
chair
couch
potted plant
bed
dining table
toilet
tv
laptop
mouse
remote
keyboard
cell phone
microwave
oven
toaster
sink
refrigerator
book
clock
vase
scissors
teddy bear
hair drier
toothbrush
</pre>

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
