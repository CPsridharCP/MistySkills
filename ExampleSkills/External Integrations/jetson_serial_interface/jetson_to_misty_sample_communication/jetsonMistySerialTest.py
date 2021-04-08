#!/usr/bin/python
import time
import serial

print("Starting: Jetson Serial Bridge to Misty")

serial_port = serial.Serial(
    port="/dev/ttyTHS0",
    baudrate=9600,
    bytesize=serial.EIGHTBITS,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
)
# Wait a second to let the port initialize
time.sleep(1)

def drive(lin_v = 0, ang_v = 0):
    serial_port.write(("{\"lin\":" + str(lin_v) + ", \"ang\":" + str(ang_v) + "}\r\n").encode())

def stop():
    serial_port.write(("{\"stop\": true}\r\n").encode())

try:
    # serial_port.write("UART message to Misty Test - CP\r\n".encode())
    drive(10,10)
    time.sleep(4)
    # drive(0,0)
    stop()

    while True:
        if serial_port.inWaiting() > 0:
            data = serial_port.readline().decode("utf-8").replace("\r\n", "") 

            if data == "send_status":
                print("Misty requesting status!")
                # Action

            print(data)

except KeyboardInterrupt:
    print("Exiting Program")

except Exception as exception_error:
    print("Error occurred. Exiting Program")
    print("Error: " + str(exception_error))

finally:
    serial_port.close()
    pass
