## Using a Raspberry Pi to teleop Misty from Remote

Raspberry Pi Image: https://misty-teleop-rpi-image-v-0-1-0.s3-us-west-1.amazonaws.com/MistyTeleop_RPi_V0_1_0.img

The RPi image provided above conntains all the reqired libraries, python teleop code and some raspi-config pre setup and installed. Tested on RPi 4 and 3B+ models.

Two more inputs from you and this application is ready to go..
<pre>
1. Connect to WiFi network that Misty is on (you can use Ethernet too)
2. Sign in to RealVnc
</pre>

![sessionImage](https://i.imgur.com/hb8Yr5A.png)

![setupVsDeployment](https://i.imgur.com/UQQgTlq.png)

## Setup Instructions

### Step 1:
Download image from this repo and flash it to a micro sd card (8GB or greater) using etcher/your favorite tool.
<img src="https://i.imgur.com/0nn1IpM.png" width="500">

### Step 2:
Go to https://www.realvnc.com/en/ and create a free account. This will let you use upto 5 devices as servers.

### Step 3:
Insert the flashed SD card, connnect mouse, keyboard and screen to a Raspberry Pi. Then power it on. You will boot to this screen.

<img src="https://i.imgur.com/E2pwceB.png" width="600">

### Step 4:
Connect to the WiFi network that Misty is on / plug in an Ethernet cable into the Pi

<img src="https://i.imgur.com/hjuwdg8.jpg" width="600">

### Step 5:
Open VNC by clicking on the icon in the toolbar (top right of the screen) and click Sign In

<img src="https://i.imgur.com/J0UZDXB.png" width="600">

Enter the email address and password you used in step 2

<img src="https://i.imgur.com/rPJEHev.png" width="600">

Give a name to this Pi (preferably its location)

<img src="https://i.imgur.com/1kGkhoH.png" width="600">

Click on Done to finish VNC setup

<img src="https://i.imgur.com/1E6VmeZ.png" width="600">

#### This completes setup of the Raspberry Pi. Now you could disconnect the screen, reboot and remove mouse & keyboard. If you are using ethernet cable for internet, leave that plugged in.

## Accessing Misty Remote

Now that VNC Server is setup on the Raspberry Pi, you can use VNC Viewer app from your phone(iOS, Android), computer(Linux, Mac, Windows) to connect to the Raspberry Pi over internet.

Example using it on an iPhone.
### Step 1:
Download the VNC Viewer App

<img src="https://i.imgur.com/9aOmLTn.jpg" width="200">

### Step 2:
Sign in to your VNC account to be able to see your VNC Server (Raspberry Pi). Tap on it. 

<img src="https://i.imgur.com/HMVEU8o.jpg" height="400"> <img src="https://i.imgur.com/CLDvEU3.png" height="400"> <img src="https://i.imgur.com/i1cEnYv.png" height="400">

### Step 3:
Enter the Raspberry Pi's username and password. 
Default username: pi
Default password: raspberry
(you can change it on the raspbery)

<img src="https://i.imgur.com/26LXFr6.png" height="400">

### Step 4:
Now you will see the Raspberry Pi's Desktop.

Phone in Landscape mode. You can zoom in to fit the view better.

<img src="https://i.imgur.com/wjA3Reb.png" width="500"> 

Phone in Portrait mode. You can zoom in to fit the view better.

<img src="https://i.imgur.com/CiiDZe4.png" width="400"> 

### Step 5:
Place the curson on Misty Teleop icon in the desktop and double click it to start application. If you have set a static IP for Misty, you can enter that and click start. Else scan for Misty and select a Misty from the scan results. Scanning might take upto 15 seconds.

![sessionImage](https://i.imgur.com/hb8Yr5A.png)

### Though connecting with phone is the easiest, the user experience is much better using VNC viewer through a laptop/computer.

