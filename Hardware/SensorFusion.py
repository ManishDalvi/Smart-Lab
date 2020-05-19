# import time
# import paho.mqtt.client as paho
# broker="192.168.0.106"
# port=1883

# def on_publish(client,userdata,result):             #create function for callback
#     print("data published \n")
#     pass
# client1= paho.Client("control1")                           #create client object
# client1.on_publish = on_publish                          #assign function to callback
# client1.connect(broker,port)
# while True:                                 #establish connection
#     ret= client1.publish("test1","from rpi")                   #publish
#     time.sleep(1)

from grovepi import *
import paho.mqtt.client as mqtt
import time
import math
import sys
import json
import random
import RPi.GPIO as GPIO
import os
import serial, time
import smbus
import struct
import datetime
import grovepi
# Connect the Grove Ultrasonic Ranger to digital port D4
# SIG,NC,VCC,GND

GPIO.cleanup() # cleanup all GPIO 
GPIO.setmode(GPIO.BCM)
GPIO.setup(16, GPIO.OUT)
ultrasonic_ranger1 = 3
ultrasonic_ranger2 = 4
temperature_sensor = 2
pir_sensor = 8

blue = 0    # The Blue colored sensor.
white = 1   # The White colored sensor.
connected = False
sensor_data = [0]
temperature_data = [0]
humidity_data = [0]
motion_data = [0]
co2_data = [0]
humidity = [0]
number_of_people = [0]
electricity_data = [0]
people_count_door = 0


def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    # client.subscribe("iaas_actuate")
    print("Ending on_connect")

def on_message(client, userdata, msg):
    print(msg.topic+" "+ (str(msg.payload)).decode("utf-8") )
    # actuate((str(msg.payload)).decode("utf-8"))


# def actuate(message):
#     if message is "led_on":
#         GPIO.output(16, GPIO.LOW)
#     else:
#         GPIO.output(16, GPIO.HIGH)

pinMode(pir_sensor,"INPUT")

client = mqtt.Client()
client.connect("192.168.0.104", 1883)
client.on_connect = on_connect
client.on_message = on_message

client.loop_start()

ser = serial.Serial('/dev/serial0',  9600, timeout = 1)	#Open the serial port at 9600 baud
#init serial
ser.flush()


def get_people_count(first_ultrasonic, second_ultrasonic):
    currentState = 0
    previousState = 0
    currentState2 = 0
    previousState2 = 0
    global people_count_door
    if first_ultrasonic <= 10 :
        currentState = 1
    else:
        currentState = 0

    if currentState != previousState:
        if currentState == 1:
            print("Entering...")
            time.sleep(0.7)
            second_ultrasonic = ultrasonicRead(ultrasonic_ranger2)
            if second_ultrasonic <= 10:
                currentState2 = 1
            else:
                currentState2 = 0
            if currentState2 != previousState2:
                if currentState2 == 1:
                    print("Person Entered")
                    people_count_door = people_count_door + 1
                    time.sleep(0.5)
            return 

    if second_ultrasonic <= 10:
        currentState2 = 1
    else:
        currentState2 = 0

    if currentState2 != previousState2:
        if currentState2 == 1:
            print("Exiting...")
            time.sleep(0.7)
            first_ultrasonic = ultrasonicRead(ultrasonic_ranger1)
            if first_ultrasonic <= 10:
                currentState = 1
            else:
                currentState = 0

            if(currentState != previousState):
                if(currentState == 1):
                    print("Person Exited")
                    people_count_door = people_count_door - 1
                    time.sleep(0.5)
                
                    if people_count_door < 0:
                        people_count_door = 0   
            return


############# carbon dioxid CO2 #####################
class CO2:
#inspired from c code of http://www.seeedstudio.com/wiki/Grove_-_CO2_Sensor
#Gas concentration= high level *256+low level
    inp =[]
    cmd_zero_sensor = "\xff\x87\x87\x00\x00\x00\x00\x00\xf2"
    cmd_span_sensor = "\xff\x87\x87\x00\x00\x00\x00\x00\xf2"
    cmd_get_sensor = "\xff\x01\x86\x00\x00\x00\x00\x00\x79"
    def read(self):
        try:
          while True:
                ser.write(CO2.cmd_get_sensor)
                CO2.inp = ser.read(9)
                high_level = struct.unpack('B',CO2.inp[2])[0]
                low_level = struct.unpack('B',CO2.inp[3])[0]
                temp_co2  =  struct.unpack('B',CO2.inp[4])[0] - 40

                #output in ppm
                conc = high_level*256+low_level
                return [conc,temp_co2]

        except IOError:
                return [-1,-1]

    def calibrateZero(self):
        try:
             ser.write(CO2.cmd_zero_sensor)
             print("CO2 sensor zero calibrated")

        except IOError:
                print("CO2 sensor calibration error")

    def calibrateSpan(self):
        try:
          while True:
                #ser.write(CO2.cmd_zero_sensor)
                print("CO2 sensor span calibrated")
                break

        except IOError:
                print("CO2 sensor calibration error")
  
c = CO2()

def publish_data(temperature_data, co2_data, number_of_people, humidity_data, motion_data, electricity_data):
     #Packet Formation
    temperature_json = {
            'temperature': temperature_data
    }

    co2_json = {
            'co2' : co2_data
    }
    number_of_people_json = {
            'number_of_people' : number_of_people
    }
    humidity_json = {
            'humidity' : humidity_data
    }
    motion_json = {
            'motion': motion_data
    }    
    electricity_json = {
            'electricity': electricity_data
    }    
    location_json = {
        'x': math.floor(random.random() * 100),
        'y': math.floor(random.random() * 100)
    }
    print(location_json)
    client.publish('sensor_data/temperature/device_1',json.dumps(temperature_json))
    client.publish('sensor_data/co2/device_1',json.dumps(co2_json))
    client.publish('sensor_data/number_of_people/device_1',json.dumps(number_of_people_json))
    client.publish('sensor_data/humidity/device_1',json.dumps(humidity_json))
    client.publish('sensor_data/motion/device_1',json.dumps(motion_json))
    client.publish('sensor_data/location/device_1',json.dumps(location_json))
    client.publish('sensor_data/electricity/device_1',json.dumps(electricity_json))
    print("Packets Published")
    time.sleep(1)


def sensor_data():
    print("Sensor data function started")
    global people_count_door
    while True:
        try:
            # People Entering and Leaving Room
            first_ultrasonic = ultrasonicRead(ultrasonic_ranger1)
            second_ultrasonic = ultrasonicRead(ultrasonic_ranger2)
            get_people_count(first_ultrasonic, second_ultrasonic)

            print("Number of People:", people_count_door)
            number_of_people[0] = people_count_door

            # PIR Sensor
            if digitalRead(pir_sensor):
                motion = 'Motion Detected'
            else:
                motion = '-'
            motion_data[0] = motion
            co2_data[0] = c.read()[0]

            #Temperature and Humidity
            # [temp, humidity] = random.randint(1, 100), random.randint(1, 100) 
            [temp,humidity] = dht(temperature_sensor,blue)  # Problem in this blocking function
            if math.isnan(temp) == False and math.isnan(humidity) == False:
                temperature_data[0] = temp
                humidity_data[0] = humidity

            publish_data(temperature_data, co2_data, number_of_people, humidity_data, motion_data, electricity_data)
           
        except:
            print(sys.exc_info())
        finally:
            # print("clean up") 
            GPIO.cleanup() # cleanup all GPIO 


if __name__ == "__main__":
    try:
        sensor_data()
    except:
        print(sys.exc_info())
