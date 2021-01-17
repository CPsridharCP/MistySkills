# Last Update Jan 14 2021
import requests

class Robot:
    """This is a Python Wrapper for Misty's RESTful calls and websockets"""
    
    def __init__(self, ip, debug=False):
        self.ip = ip
        self.debug = debug

    def start_av_streaming(self, url, width=640, height=480, frameRate=30, videoBitRate=5000000, audioBitRate=32000, audioSampleRateHz=11025, userName ="", password=""):
        if self.check_if_av_streaming_is_enabled():
            if self.debug: print("Debug: AV streaming is enabled")
            msg_body = {
                "url" : url,
                "width" : width,
                "height" : height,
                "frameRate" : frameRate,
                "videoBitRate" : videoBitRate,
                "audioBitRate" : audioBitRate,
                "audioSampleRateHz" : audioSampleRateHz,
                "userName" : userName,
                "password" : password
            }
            
            response = requests.post(url='http://' + self.ip + '/api/avstreaming/start', params= msg_body).json()
            if response["status"] == "Success":
                if self.debug: print("Debug: AV streaming started successfully.") 
                return True
            elif response["status"] == "Failed":
                print("Error starting AV stream: ", response["error"])
                return False
            else:
                print("Error: Failed to enable av streaming service. Check WiFi connection.") 
                return False   
        else:
            if self.debug: print("Debug: AV streaming is not enabled.") 
            if self.enable_av_streaming_service():
                self.start_av_streaming(url, width, height, frameRate, videoBitRate, audioBitRate, audioSampleRateHz, userName, password)

    def enable_av_streaming_service(self):
        if self.debug: print("Debug: Enabling AV streaming service")
        response = requests.post(url='http://' + self.ip + '/api/services/avstreaming/enable').json()
        if response["status"] == "Success":
            return response["result"] 
        elif response["status"] == "Failed":
            print("Error enabling AV stream: ", response["error"])
        else:
            print("Error: Failed to enable AV streaming service.")   

    def check_if_av_streaming_is_enabled(self):
        response = requests.get(url='http://' + self.ip + '/api/services/avstreaming').json()
        if response["status"] == "Success":
            return response["result"] 
        elif response["status"] == "Failed":
            print("Error checking AV strem status: ", response["error"])
        else:
            print("Error: Failed to check av stream enabled/disabled status.")    

    def stop_av_streaming(self):
        response = requests.post(url='http://' + self.ip + '/api/avstreaming/stop').json()
        if response["status"] == "Success":
            return response["result"] 
        elif response["status"] == "Failed":
            print("Error stopping AV strem: ", response["error"])
        else:
            print("Error: Failed to stop AV stream.")     
    
    def disable_av_streaming_service(self):
        if self.debug: print("Debug: Disabling AV streaming service")
        response = requests.post(url='http://' + self.ip + '/api/avstreaming/disable').json()
        if response["status"] == "Success":
            return response["result"] 
        elif response["status"] == "Failed":
            print("Error disabling AV stream: ", response["error"])
        else:
            print("Error: Failed to disbale AV streaming service.") 

    def drive(self, linear_velocity, angular_velocity):
        assert -100 <= linear_velocity <= 100 and -100 <= angular_velocity <= 100, "Error: Drive: The velocities needs to be in the range -100 to 100"
        msg_body = {"LinearVelocity": linear_velocity,"AngularVelocity": angular_velocity}
        response = requests.post('http://' + self.ip + '/api/drive', params = msg_body).json()
        if response["status"] == "Success":
            return response["result"] 
        elif response["status"] == "Failed":
            print("Error trying to drive: ", response["error"])
        else:
            print("Error: Failed to drive.") 
    
    def stop(self):
        msg_body = {"motorMask" : 7}
        response = requests.post('http://' + self.ip + '/api/halt', params = msg_body).json()
        if response["status"] == "Success":
            return response["result"] 
        elif response["status"] == "Failed":
            print("Error trying to stop Misty: ", response["error"])
        else:
            print("Error: Failed to stop.") 
    
    def move_head(self, pitch, roll, yaw):
        # assert (-40 <= pitch <= 25 or pitch == "null") and (-40 <= roll <= 40 or roll == "null") and (-80 <= yaw <= 80 or yaw == "null"), "Error: Move Head: Given limits are out of bound. Use -40 to 25 Pitch, -40 to 40 Roll, -80 to 80 Yaw"
        msg_body = { "pitch" : pitch, "roll" : roll, "yaw" : yaw }
        response = requests.post('http://' + self.ip + '/api/head', params = msg_body).json()
        if response["status"] == "Success":
            return response["result"] 
        elif response["status"] == "Failed":
            print("Error moving head: ", response["error"])
        else:
            print("Error: Failed to move head.") 

    def speak(self, text_to_speak):
        assert isinstance(text_to_speak, str), "Error: TTS: Input should be strings"
        msg_body = { "text" : text_to_speak, "speechRate" : 0.88 }
        response = requests.post('http://' + self.ip + '/api/tts/speak', params = msg_body).json()
        if response["status"] == "Success":
            return response["result"] 
        elif response["status"] == "Failed":
            print("Error with local TTS: ", response["error"])
        else:
            print("Error: Failed to speak.")
    
    def torch_on(self, on_off = False):
        assert isinstance(on_off, bool), "Error: Torch on/off: Input should be either True / False"
        msg_body = { "on" : on_off }
        response = requests.post('http://' + self.ip + '/api/flashlight', params = msg_body).json()
        if response["status"] == "Success":
            return response["result"] 
        elif response["status"] == "Failed":
            print("Error toggling flashlight: ", response["error"])
        else:
            print("Error: Failed to toggle flashlight.")
    
    def update_hazard_system(self, revert_to_default = True, disable_ToF = False, disable_bump = False):
        assert isinstance(revert_to_default, bool) and isinstance(disable_ToF, bool) and isinstance(disable_bump, bool), "Error: Hazard System Update: Input should be either True / False"
        msg_body = { "revertToDefault": revert_to_default, "disableTimeOfFlights" : disable_ToF, "disableBumpSensors" : disable_bump }
        response = requests.post('http://' + self.ip + '/api/hazard/updatebasesettings', params = msg_body).json()
        if response["status"] == "Success":
            return response["result"] 
        elif response["status"] == "Failed":
            print("Error updating hazard system: ", response["error"])
        else:
            print("Error: Failed to change Hazard Syatem Settings.")


if __name__ == "__main__":
    # Playground
    import time
    cp_misty = Robot("10.0.0.237")
    print(cp_misty.update_hazard_system(False,True,False))