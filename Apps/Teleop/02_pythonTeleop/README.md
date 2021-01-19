## Teleop with Python

This code is to be run on an external computer (Linux, Mac, Windows) that is on the same network as Misty.

[teleop_gif]: https://media.giphy.com/media/ZA1h6BAu99vEzkmFk6/giphy.gif
![teleop_gif]

#### UI Screenshots
![findMisty](https://i.imgur.com/REA2zrY.png)
![teleopInterface](https://i.imgur.com/lvR13UI.png)

## How can you use it?

1. You can install everything in your computer and run it locally with Misty on the same network as your computer. Follow Stand alone setup instructions found below.

2. You could setup a Raspberry Pi in your place and let that bridge connunication to Misty. This way you can remote-in over the internet. Follow Remote Teleop instructions found below.

## Remote Teleop:

The plan is to have RealVNC Server Installed in this exteal machine, so you could teleoperate Misty remote from a RealVNC Viewer.

In an ideal use case, this external machine could be a Raspberry Pi plugged into the wall socket (no sceens / accessories needed).

Instruction for quick Raspberry Pi Setup: 

https://github.com/CPsridharCP/MistySkills/blob/master/Apps/Teleop/02_pythonTeleop/RaspberryPi%20Remote%20Teleop/README.md

Configured Raspberry Pi Image:

https://misty-teleop-rpi-image-v-0-1-0.s3-us-west-1.amazonaws.com/MistyTeleop_RPi_V0_1_0.img1.amazonaws.com/MistyTeleop_RPi_V0_1_0.img


## Stand alone Setup-Instructions:

I prefer using anaconda to keep things clean. If your prefer otherwise skip to step 3

### Step 1: (5 mins)
<pre>
Install Anaconda on your computer following instructions from https://docs.anaconda.com/anaconda/install/. 
Choose your Operating System on the left side menu to get specific instructions.
</pre>
### Step 2: (1 mins)
<pre>
Open Terminal 
$ cd
$ conda deactivate 
$ conda create -n mistyTeleop python=3.6 -y
$ conda activate mistyTeleop
Now you should see 'mistyTeleop' in brackets before user_name@device_name$ in the terminal
</pre>
### Step 3: (2 mins)
<pre>
$ pip install requests
$ pip install numpy
$ pip install opencv-python
$ pip install PySimpleGUI
$ pip install grequests
</pre>
### Step 4: (3 mins)
<pre>
Download the four python scripts from this repo to your computer (mistyTeleop.py, pyMisty.py, findMisty.py, streamLatestFrame.py)
In terminal, navigate to the directory where you have downloaded these scripts.
eg.$ cd Downloads/mistyTeleop
$ chmod +x *.py
</pre>

## Stand alone Execution-Instructions:

#### If you already know the IP address of Misty:
<pre>
$ python mistyTeleop.py --ip <your_robot's IP>
eg. python mistyTeleop.py --ip 10.0.0.237
</pre>
#### If you do not know the IP address of Misty:
<pre>
$ python mistyTeleop.py
Now you would be presented with another window where you could scan the network for Misty's and find the IP addresses.
Scanning can take about 15 seconds.
After scanning is complete you will see a list of buttons one corressponding to each Misty, labelled with IP and SerialNo.
Click on the one Misty you would like to teleoperate and wait 5 seconds for the telepresence interface to kickin.
</pre>


