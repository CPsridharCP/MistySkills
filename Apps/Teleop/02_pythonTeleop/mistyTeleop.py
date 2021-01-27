from pyMisty import Robot
import numpy as np
import cv2
import time
import urllib.request
from streamLatestFrame import LatestFrame
import PySimpleGUI as sg
from findMisty import MistyScanner
import argparse
import requests
from audioPlayer import AudioPlayer

def drive_forward():
    cp_misty.drive(15,0)

def drive_back():
    cp_misty.drive(-15,0)

def stop():
    cp_misty.stop()

def turn_left():
    cp_misty.drive(0,10)

def turn_right():
    cp_misty.drive(0,-10)

def look_up():
    global pitch
    pitch = max(pitch - 5, -40) 
    cp_misty.move_head(pitch, 0, "null")

def look_down():
    global pitch
    pitch = min(pitch + 5, 25) 
    cp_misty.move_head(pitch, 0, "null")

def look_left():
    global yaw
    yaw = min(yaw + 10, 80) 
    cp_misty.move_head("null", 0, yaw)

def look_right():
    global yaw
    yaw = max(yaw - 10, -80) 
    cp_misty.move_head("null", 0, yaw)

def look_straight():
    cp_misty.move_head(0, 0, 0)

def speak(text_to_speak):
    cp_misty.speak(text_to_speak)

def torch_on():
    print("Hazard System - Back to default setting")
    cp_misty.torch_on(True)

def torch_off():
    print("Turning off ToF's in hazard system")
    cp_misty.torch_on(False)

def hazard_revert_to_defaults():
    cp_misty.update_hazard_system(True, False, False)
    
def hazard_tof_off():
    cp_misty.update_hazard_system(False, True, False)

def main(args):

    lfs = LatestFrame('rtsp://' + cp_misty.ip + ':1936').start()
    if args.audio_off:
        AudioPlayer('rtsp://' + cp_misty.ip + ':1936').start()
    time.sleep(1.0)

    video_feed = [
        [sg.Text("Video Feed", size=(60, 1), justification="center")],
        [sg.Image(filename="", key="-IMAGE-")]
    ]

    drive_controls = [
        [sg.Text("Drive")],
        [sg.Button(""), sg.Button("FORWARD"), sg.Button("")],
        [sg.Button("LEFT"), sg.Button("STOP"), sg.Button("RIGHT")],
        [sg.Button(""), sg.Button("BACK"), sg.Button("")]  
    ]

    head_controls = [
        [sg.Text("Look")],
        [sg.Button(""), sg.Button("UP", key = "LOOK_UP"), sg.Button("")],
        [sg.Button("LEFT", key = "LOOK_LEFT"), sg.Button("STRAIGHT", key = "LOOK_STRAIGHT"), sg.Button("RIGHT", key = "LOOK_RIGHT")],
        [sg.Button(""), sg.Button("DOWN", key = "LOOK_DOWN"), sg.Button("")]
    ]

    speak_input = [
        [sg.Text("Text to Speech")],
        [sg.In(size=(50, 5), key="-TTS-")],
        [sg.Button("Speak"), sg.Button("Clear")]
    ]

    torch_control = [
        [sg.Text("Flashlight")],
        [sg.Button("ON", key = "TORCH_ON"), sg.Button("OFF", key = "TORCH_OFF")]
    ]

    hazard_system_controls = [
        [sg.Text("Default Accident Protection")],
        [sg.Text("(Turn off only if Misty cannot drive)")],
        [sg.Button("OFF", key = "TOF_OFF"), sg.Button("ON", key = "TOF_ON")]
    ]

    layout = [
        [sg.Column(video_feed),sg.VSeperator(), sg.Column([[sg.Column(drive_controls)],[sg.Column(head_controls)],[sg.Column(speak_input)],[sg.Column(torch_control)], [sg.Column(hazard_system_controls)]])]
    ]

    w, h = sg.Window.get_screen_size()
    
    window = sg.Window("Misty Teleop", layout, location=(0, 0), default_button_element_size=(10,2), auto_size_buttons=False, keep_on_top=True)
    
    functions_mapping = {
        "FORWARD" : drive_forward,
        "BACK" : drive_back,
        "LEFT" : turn_left,
        "RIGHT" : turn_right,
        "STOP" : stop,
        "LOOK_UP" : look_up,
        "LOOK_DOWN" : look_down,
        "LOOK_LEFT" : look_left,
        "LOOK_RIGHT" : look_right,
        "LOOK_STRAIGHT" : look_straight,
        "TORCH_ON" : torch_on,
        "TORCH_OFF" : torch_off,
        "TOF_ON" : hazard_revert_to_defaults,
        "TOF_OFF" : hazard_tof_off
    }

    while True:

        event, values = window.read(timeout=20)
        if event == "Exit" or event == sg.WIN_CLOSED:
            break

        if event in functions_mapping.keys():#["FORWARD", "BACK", "LEFT", "RIGHT", "STOP", "LOOK_UP", "LOOK_DOWN", "LOOK_LEFT", "LOOK_RIGHT", "LOOK_STRAIGHT", "Torch On", "Torch Off"]:
            print("Actuation : ", event)
            functions_mapping[event]()

        if event == "Speak" and values["-TTS-"].strip():
            print("Speaking : ", values["-TTS-"])
            speak(values["-TTS-"])
        
        if event == "Clear":
            window["-TTS-"].update("")
            
        frame = lfs.frame        
        frame = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)

        imgbytes = cv2.imencode(".png", frame)[1].tobytes()
        window["-IMAGE-"].update(data=imgbytes)
        
        # cv2.imshow('frame',frame)
        # if cv2.waitKey(1) & 0xFF == ord('q'):
        #     break
        # Add ctrl c expection here too 

    cv2.destroyAllWindows()
    lfs.stop()
    cp_misty.stop_av_streaming()
    hazard_revert_to_defaults()
    window.close()

def initial_ip_scan_window():

    misty_ip_to_use = None

    direct_ip_input = [
        [sg.Text("Enter Misty's IP on local network :"), sg.Input(key = "-IP-")],
        [sg.Button("START", key = "START"), sg.Text(visible = False, key = "IP-VALIDITY", size = (50,1))]
    ]

    scanner = [
        [sg.Text("Scan for Misty's on the network")],
        [sg.Button("START SCAN", key = "SCAN"),sg.Text("Status:"), sg.Text("Idle.", key = "STATUS", size = (75,1))]
    ]

    scan_results = [
        [sg.Text("Scan Results", visible = False, key = "SCAN-RESULT-TITLE", size = (75,1))],
        *[[sg.Button(str(i), visible = False, key = "SCAN_RESULT_" + str(i), size = (40,1)),] for i in range(10)],
    ] 
    
    layout = [ 
        [sg.Column(direct_ip_input)],
        [sg.Column(scanner)],
        [sg.Column(scan_results)]
    ]

    w, h = sg.Window.get_screen_size()
    window = sg.Window("Misty Teleop", location=(0, 0), default_button_element_size=(15,2), auto_size_buttons=False, keep_on_top=True).Layout(layout)
    
    misty_scanner_object = MistyScanner()
    scanning_in_progress = False
    mistys_found = None

    while True:

        event, values = window.read(timeout=20)
        if event == "Exit" or event == sg.WIN_CLOSED:
            break
        
        # USER INPUT IP
        if event == "START":
            print(values["-IP-"])
            if (values["-IP-"].strip()):
                print("Checking IP validity..")
                try:
                    response = requests.get(url='http://' + values["-IP-"].strip() + '/api/device', timeout =3).json()
                    if response["status"] == "Success":
                        # IP IS A VLAID MISTY IP
                        print("VALID MISTY IP")
                        misty_ip_to_use = values["-IP-"].strip()
                        break
    
                    else:
                        print("NOT A VALID MISTY IP")
                        window["IP-VALIDITY"].update("This is not a valid Misty IP. Try scanning for one.")
                        window["IP-VALIDITY"].update(visible = True)
                        window.Refresh()
                except:
                    print("NOT A VALID MISTY IP")
                    window["IP-VALIDITY"].update("This is not a valid Misty IP. Try scanning for one.")
                    window["IP-VALIDITY"].update(visible = True)
                    window.Refresh()

            else:
                window["IP-VALIDITY"].update("Please enter a valid Misty IP and click START.")
                window["IP-VALIDITY"].update(visible = True)
                window.Refresh()

        # START SCAN FOR MISTY
        if event == "SCAN":
            print("Staring scan for Misty")
            scanning_in_progress = True
            window["STATUS"].update("Scanning in Progress. Please wait.. May take upto 15 seconds")
            window["SCAN"].update(disabled = True)
            window["START"].update(disabled = True)
            window.Refresh()
            mistys_found = misty_scanner_object.scan_for_misty()
            # mistys_found = [['10.0.0.237', '00:d0:ca:00:97:10', '20193802891'],['10.0.0.155', '00:d0:ca:00:97:10', '20193802891'],['10.0.0.102', '00:d0:ca:00:97:10', '20193802891']]
            # mistys_found = []

        # MISTY SCAN RESULTS
        if mistys_found != None and scanning_in_progress:
            print("Scanning Comleted")
            print(mistys_found)
            window["STATUS"].update("Scanning complete.")
            window["START"].update(disabled = False)
            window["SCAN"].update(disabled = False)
            scanning_in_progress = False

            if len(mistys_found):
                window["SCAN-RESULT-TITLE"].update("Scan Results - Click on any result to start teleop session")
                window["SCAN-RESULT-TITLE"].update(visible = True)
                for i in range(len(mistys_found)):
                    window["SCAN_RESULT_" + str(i)].update("IP: " + mistys_found[i][0] + "  S.No.: " + mistys_found[i][2])
                    window["SCAN_RESULT_" + str(i)].update(visible = True)
            else:
                window["SCAN-RESULT-TITLE"].update("Scan Results - No Misty found on the same network as this device. Try again")
                window["SCAN-RESULT-TITLE"].update(visible = True)
        
        # SELECT MISTY FROM SCAN RESULT
        if event.startswith("SCAN_RESULT_"):
            misty_ip_to_use = mistys_found[int(event.replace("SCAN_RESULT_", "").strip())][0]
            break
    
    window.close()
    return misty_ip_to_use
            

if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument("--ip", help="Optional parameter. If provided skips scan for Misty and forces program to use this ip")
    parser.add_argument("--audio-off", help="Optional Parameter. Turn off audio when present.", default=True, action='store_false')
    args = parser.parse_args()

    if args.ip:
        misty_ip_to_use = args.ip.strip()
        print ("Using ip address for Misty provided as argument :", args.ip.strip() )
    else:    
        misty_ip_to_use = initial_ip_scan_window()
        print("IP selected:", misty_ip_to_use)

    print("Please wait. Another window with the teleop interface will open in 5 seconds")
    
    pitch = 0
    yaw = 0
    roll = 0

    cp_misty = Robot(misty_ip_to_use)
    cp_misty.enable_av_streaming_service()
    cp_misty.stop_av_streaming()
    look_straight()
    hazard_revert_to_defaults()

    if cp_misty.start_av_streaming(url="rtspd:1936"):
        print("IN")
        time.sleep(2)
        main(args)
    else:
        print("OUT")