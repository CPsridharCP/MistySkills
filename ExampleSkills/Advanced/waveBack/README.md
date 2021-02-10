## Misty Waves Back At You ;) 
In this skill Misty used two onboard AI Capabilities 
1. Object Detection 
2. Human Pose Estimation

Gif Link: https://media.giphy.com/media/ugcxMQd5GBTZBKkTBK/giphy.gif

Video Link: https://youtu.be/lSX912OMb5w

### Object Detection:
Object detection is used to make Misty look at the closest person. Misty can detect 
about 70 objects and provide bounding box data for each. For this specific skill I only
wanted Misty to find Human. Hence I specifically look for the 1 human object and ignore 
the rest.

### Human Pose Estimation:
Human pose estimation is used to detect the ~waving arm gesture. The event provides 16 
keypoints per message like nose, eye, ear, shoulder, elbow, wrist, hip, ankle etc.. 
Using these keypoints, logic can be built to detect specific gestures. I wrote a very simple
one to detect a waving action so that Misty can wave back when someone stop to say hi to her,
#### A simple logic: 
Elbow is lower than Shoulder && Shoulder is lower than Wrist. Feel free to modify this and 
play with more keypoints

### Audio:
- You can use the rear two bump sensors to increase/decrease volume.
- In the JSON, set parameter "silent_mode" to true if you do not want Misty to play audio. 

