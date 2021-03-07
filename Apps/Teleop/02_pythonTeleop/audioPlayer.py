import av
import numpy as np
from threading import Thread
import pyaudio
from collections import deque
import time

class AudioPlayer:

    def __init__(self, path):
        self.stream_path = path


    def update(self):
        queue = deque()

        def play_thread():
            p = pyaudio.PyAudio()
            stream = p.open(format=pyaudio.paFloat32,
                            channels=1,
                            rate=11025,
                            output=True)
            while True:
                if len(queue) == 0:
                    time.sleep(0.25)
                    continue
                frame = queue.popleft()
                stream.write(frame.to_ndarray().astype(np.float32).tostring())

        t = Thread(target=play_thread)
        t.start()  

        container = av.open(self.stream_path)
        input_stream = container.streams.get(audio=0)[0]
        for frame in container.decode(input_stream):
            frame.pts = None
            queue.append(frame)

    def start(self):

        t = Thread(target=self.update, args=())
        t.daemon = True
        t.start()


