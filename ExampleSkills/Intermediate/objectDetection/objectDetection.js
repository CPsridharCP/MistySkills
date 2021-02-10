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

// This example shows how to use Misty's onboard Object Detection AI Capability

// For an advanced implementation example check here:
// https://github.com/CPsridharCP/MistySkills/tree/master/ExampleSkills/Advanced/waveBack

// Misty can detect and provide information about 70 different objects:
// person
// bicycle
// car
// motorcycle
// airplane
// bus
// train
// truck
// boat
// traffic light
// fire hydrant
// stop sign
// parking meter
// bench
// bird
// cat
// dog
// horse
// sheep
// cow
// elephant
// bear
// zebra
// giraffe
// backpack
// umbrella
// handbag
// tie
// suitcase
// frisbee
// skis
// snowboard
// sports ball
// kite
// baseball bat
// baseball glove
// skateboard
// surfboard
// tennis racket
// bottle
// wine glass
// cup
// fork
// knife
// spoon
// bowl
// banana
// apple
// sandwich
// orange
// broccoli
// carrot
// hot dog
// pizza
// donut
// cake
// chair
// couch
// potted plant
// bed
// dining table
// toilet
// tv
// laptop
// mouse
// remote
// keyboard
// cell phone
// microwave
// oven
// toaster
// sink
// refrigerator
// book
// clock
// vase
// scissors
// teddy bear
// hair drier
// toothbrush

start_object_detection();

// Object Detection
function start_object_detection(){
    // If you would like to get data only about say object - dog use the below line
    // If you prefer to get data about all 70 objects comment it out
    misty.AddPropertyTest("object_detection", "Description", "==", "dog", "string");

    // Argument 1: Data from human pose estimation is streamed into the callback function
    // Argument 2: Event Name (do not change this) 
    // Argument 3: Debounce in milliseconds (least time between updates)
    // Argument 4: Live forever
    misty.RegisterEvent("object_detection", "ObjectDetection", 500, true);

    // Argument 1: Minimum confidence required (float) 0.0 to 1.0 
    // Argument 2: ModelId (int) 0 - 3 
    // Argument 3: MaxTrackHistory - Consistently maintains ID of object across x points in history
    // Argument 4: (optinal) DelegateType (int) - 0 (CPU), 1 (GPU), 2 (NNAPI), 3 (Hexagon)  
    misty.StartObjectDetector(0.5, 0, 15);
}

function object_detection(data) {
    var object_info = data.PropertyTestResults[0].PropertyParent;

    // Sample data
    // Confidence: 0.6656214
    // Created: "2020-07-23T14:02:34.8795248Z"
    // Description: "laptop"
    // Id: 0
    // ImageLocationBottom: 275.450775
    // ImageLocationLeft: 81.9578247
    // ImageLocationRight: 249.462738
    // ImageLocationTop: 101.051857
    // LabelId: 73
    // Pitch: 0.119271189
    // SensorId: "cv"
    // Yaw: 0.00674471259

    // To access confidence and pitch
    misty.Debug(object_info.Confidence);
    misty.Debug(object_info.Pitch);
}