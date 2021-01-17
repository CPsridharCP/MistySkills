# Teleop

Teleop is pretty much remote control. This is an experimental build to play with Misty.
Desktop apps build for Mac, Linux and Windows

<pre>
|
|__ 01_localDrive (picture feed) (Build with Unity)
    |
    |__ Drive with ASDW and Arrow Keys
        Spacebar to brake
        Click on screen to move Misty's head 
        Arrow Indicator in the lower centre indicates current head position
        Enter Misty's IP on the top right text field and hit Start
        This version does not use Audio Video Streaming and just pulls camera image as fast as it can
        Change resolution using the three buttons on the left (High Medium Low) - affects latency
        For driving use Low Resolution/Latency
        Also uses local Text to Speech - Type text on top left text field and hit Speak 
|
|__ 02_pythonTeleop (video feed) (Built with Python)
    |
    |__ Ability to scan for Misty's available on the same network and find its IP address
        Video Feed is displayed on screen 
        Use control panel to drive around and move Misty's head
        Torch light can be toggled on and off
        Hazards System's - Time of Flight sensors can be turrned off is needed
        Local Text to Speech is availble to use
        Suggestion to use RealVNC to teleop remote
        Raspberry Pi Image to be provided for easy setup, so users can remote teleop with their RealVNC account
|
|__ 03_remoteDriveAudioVideoFeed (Soon.. )
</pre>

## WARRANTY DISCLAIMER.

General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS PROVIDES THIS SAMPLE SOFTWARE “AS-IS” AND DISCLAIMS ALL WARRANTIES AND CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE.
Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT.
Please refer to the Misty Robotics End User License Agreement for further information and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/

Copyright 2020 Misty Robotics
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
