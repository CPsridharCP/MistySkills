import socket
import grequests
import json

# SCANS NETWORK FOR AVAILABLE MISTY'S

class MistyScanner:

    def __init__(self):
        self.self_ip = self.find_self_ip() 
        self.base_ip = self.self_ip[:self.self_ip.rfind(".")+1] 

    def find_self_ip(self):
        print("Getting this device's IP:")
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        print("Found Device IP:", ip)
        s.close()
        return ip
    
    def scan_for_misty(self):
        print("Starting scan to find Mistys:")
        urls = []
        mistys_found = []
        
        for i in range (256):
            urls.append('http://' + self.base_ip + str(i) + '/api/device')
        results = grequests.map((grequests.get(u, timeout=0.5) for u in urls), exception_handler=self.exception, size=5)
        for result in results:
            if result != None:
                try:
                    data = json.loads(result.text)
                    mistys_found.append([data["result"]["ipAddress"],data["result"]["macAddress"],data["result"]["serialNumber"]])
                except:
                    print("Skipped")
        
        print ("Number of Misty's Found ", len(mistys_found))
        print (mistys_found)
        return mistys_found

    def exception(self, request, exception):
        # print ("Problem: {}: {}".format(request.url, exception))
        pass

if __name__ == "__main__":
    test = MistyScanner()
    test.scan_for_misty()