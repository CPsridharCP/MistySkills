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

// Misty plays an audio on hearing "Hey Misty"
// Once Hey Misty is triggered you would need to start it again by calling misty.StartKeyPhraseRecognition(<parameters>);

detectWakeWord();

function detectWakeWord() 
{
    // False indicated we are not recording the audio after Hey Misty is receognized
    misty.StartKeyPhraseRecognition(false);

    // Listening to the Event "KeyphraseRecognized" to take action when Hey Misty is recognized
    // First parameter is the name of the callback function that will be triggered when the event happens (can change)
    // Second parameter is the eventName (fixed)
    // Third parameter is the debounce (can change)
    // Fourth parameter is a boolean that indicates if you want to keep listening to the event trigger continuously
    misty.RegisterEvent("heyMisty", "KeyphraseRecognized", 10, false);
}

function _heyMisty() 
{
    // misty.PlayAudio("s_SystemWakeWord.wav", 100);
    misty.Debug("Wake Work Recognised");
    detectWakeWord();
}