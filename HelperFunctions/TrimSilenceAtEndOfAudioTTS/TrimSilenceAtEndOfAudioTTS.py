# **************************************************************************
# WARRANTY DISCLAIMER.

# General. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MISTY ROBOTICS
# PROVIDES THIS SAMPLE SOFTWARE “AS-IS” AND DISCLAIMS ALL WARRANTIES AND 
# CONDITIONS, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE WARRANTIES 
# OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT, 
# ACCURACY, AND NON-INFRINGEMENT OF THIRD-PARTY RIGHTS. MISTY ROBOTICS DOES 
# NOT GUARANTEE ANY SPECIFIC RESULTS FROM THE USE OF THIS SAMPLE SOFTWARE. 
# MISTY ROBOTICS MAKES NO WARRANTY THAT THIS SAMPLE SOFTWARE WILL BE UNINTERRUPTED, 
# FREE OF VIRUSES OR OTHER HARMFUL CODE, TIMELY, SECURE, OR ERROR-FREE. 
# Use at Your Own Risk. YOU USE THIS SAMPLE SOFTWARE AND THE PRODUCT AT YOUR OWN 
# DISCRETION AND RISK. YOU WILL BE SOLELY RESPONSIBLE FOR (AND MISTY ROBOTICS DISCLAIMS) 
# ANY AND ALL LOSS, LIABILITY, OR DAMAGES, INCLUDING TO ANY HOME, PERSONAL ITEMS, 
# PRODUCT, OTHER PERIPHERALS CONNECTED TO THE PRODUCT, COMPUTER, AND MOBILE DEVICE, 
# RESULTING FROM YOUR USE OF THIS SAMPLE SOFTWARE OR PRODUCT. 

# Please refer to the Misty Robotics End User License Agreement for further information 
# and full details: https://www.mistyrobotics.com/legal/end-user-license-agreement/

# Copyright 2020 Misty Robotics Licensed under the Apache License, Version 2.0 
# http://www.apache.org/licenses/LICENSE-2.0
# ***************************************************************************

"""
Logic Exploration in python to be used in JS skill.
Look at the other .js file for a skill implementation on board Misty.

When buding chat appications with Misty using cloud services like 
Google/Microsoft Text to Speech, the base64 audio returned normally 
contains an end silence for about 0.7 to 2.0 seconods. This is a
challenge to work with when building chat applications because the
user immediately responds after the question is asked. With this 1-2
second silence at the end, the start of our recording is delayed by 
1-2 seconds resulting in Misty not catching what the user responded.

Here is quick and hacky way to achieve 'trimming' that silence at the end.
The function below identifies where to chop the audio and stops playing 
the audio right where the speech ends (also triggers AudioPlayComplete 
Event) so you could start recording immediately and not miss a word the 
user says.

A production integration of the actual fix to this by adding a parameter
to misty.SaveAudio("Filename.wav", ...) command might be coming soon. 
"""

import base64
import wave
import contextlib

def chop(original, out_filename):
    length_of_end_ananysis = 54000
    length_of_sub_sample = 600
    chop_at_variance = 40
    end_sample = original[-length_of_end_ananysis:]
    
    # Take 600 chunks and calculate variance and use it to chop audio
    chop_at = length_of_end_ananysis
    for i in range(int(length_of_end_ananysis/length_of_sub_sample)):        
        somewhat_variance = len(set(end_sample[(-i-1)*length_of_sub_sample:-i*length_of_sub_sample]))
        if (somewhat_variance > chop_at_variance):
            chop_at = (i-1)*length_of_sub_sample
            # print(chop_at)
            break

    original = original[:-1*chop_at]
    wav_file = open(out_filename + ".wav", "wb")
    decode_string = base64.b64decode(original)
    wav_file.write(decode_string)
    return chop_at

# If you have a number of sample audio files you could loop through them to get all outputs saved
# The examples i used were names sample0.wav, sample1.wav ... sample14.wav
for i in range(15):
    print(i)
    original = base64.b64encode(open("sample" + str(i) + ".wav" , "rb").read())
    length_chopped = chop(original, "output" + str(i))
