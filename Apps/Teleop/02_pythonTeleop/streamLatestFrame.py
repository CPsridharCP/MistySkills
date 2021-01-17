# ref : https://www.pyimagesearch.com/2017/02/06/faster-video-file-fps-with-cv2-videocapture-and-opencv/

from threading import Thread
import cv2

# TO KEEP LATENCY AT A MINIMUM WE SKIP A FEW FRAMES AND ONLY USE THE LATEST FRAME AVAILABLE

class LatestFrame:

    def __init__(self, path):
        self.stream = cv2.VideoCapture(path)
        self.stopped = False
        self.frame = []
        
    def start(self):
        # Start a thread to read frames from the file video stream
        t = Thread(target=self.update, args=())
        t.daemon = True
        t.start()
        return self

    def update(self):
		# Keep looping infinitely
        while True:
            (grabbed, frame) = self.stream.read()
            if not grabbed:
                return
            self.frame = frame
			
            # If the thread indicator variable is set, stop the thread
            if self.stopped:
                self.stream.release()
                print("released")
                break

    def stop(self):
		# Indicate that the thread should be stopped
        self.stopped = True