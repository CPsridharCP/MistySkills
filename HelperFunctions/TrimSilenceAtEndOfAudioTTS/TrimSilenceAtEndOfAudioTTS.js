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

/*
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
*/

// Function call - 2 option

// 1. Do not wait for Audio Play Complete
save_trimmed_audio("your_base64_string", "file_name_to_save_as.wav");

// 2. Wait for audio play complete
_ = save_trimmed_audio("your_base64_string", "file_name_to_save_as.wav");

// Trim and save audio
function save_trimmed_audio(base64, filename) {
    misty.Debug("Original Audio Length : " + base64.length.toString());
    var length_of_end_analysis = 54000;
    var length_of_sub_sample = 600;
    var chop_at_variance = 40;
    var end_sample = base64.substring(base64.length - length_of_end_analysis);
    var chop_at = length_of_end_analysis;
    var somewhat_variance = 0;

    for (let i = 0; i < Math.floor(length_of_end_analysis / length_of_sub_sample); i++) {
        somewhat_variance = (new Set(end_sample.substring(end_sample.length - (i + 1) * length_of_sub_sample, end_sample.length - i * length_of_sub_sample))).size;
        if (somewhat_variance > chop_at_variance) {
            chop_at = (i - 1) * length_of_sub_sample;
            misty.Debug("Audio Chop At : " + (base64.length - chop_at).toString());
            break;
        }
    }
 
    // Trimmed Audio to save - Does not work on Misty as Header data mismatches chopped audio length and file size
    // var audio_to_save = base64.substring(0, base64.length - chop_at);
    // misty.Debug(audio_to_save.length);
    // misty.Debug(audio_to_save.length % 4);
    // misty.Debug(typeof audio_to_save);
    // misty.SaveAudio("trim-test.wav", audio_to_save, true, true);

    // Workaround to avoid the silence in the end
    let sec_per_base64_character = 1.5624414847800848e-05; // From rigorus testing in Python - data with CP
    var play_time = sec_per_base64_character * (base64.length - 44 - chop_at);
    // misty.Debug(play_time);
    misty.SaveAudio(filename, base64, true, true);
    misty.Pause(play_time * 1000 + 700); // 700 is process time on saving audio
    misty.StopAudio();
    return 0;
}

// Example
// Get base64 from a file to experiment

// misty.GetAudioFile("sample0.wav");
// function _GetAudioFile(data) {
//     save_trimmed_audio(data.Result.Base64, "trim_test.wav");
// }
