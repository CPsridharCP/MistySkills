## Trim silence at end of cloud generated TTS audio

### Input:
![input](https://i.imgur.com/tvsgxH7.png)

### Output:
![output](https://i.imgur.com/Jqpmkch.png)

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

![samples](https://i.imgur.com/VXVv7mp.png)
