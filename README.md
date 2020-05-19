# Smart-Lab

### Execution 

There are two files in the folder. One for the hardware coding and the second
for the Web application

1. Hardware folder

``` 
SensorFusion.py is the code to be run on Raspberry pi connected with sensors.
    
sudo chmod 666 /dev/serial0 - Run this in order to gain access to the serial port reading CO2 sensor value
python SensorFusion.py - Run this to start the sending the Sensor data over MQTT.
    
actuator_esp8266.ino 0 It is an arduino code that can be uploaded to NodeMCU-1.0 board. This file is used to receive
actuation data from the web application inorder to blink led based on button click in the web page. 
```    

2. Study-project folder

```
Open command line inside the study-project folder.
Execute "npm install" -  This will install all the required dependencies.

After all the dependency installation.
Execute "npm run start:server" - This will start the node.js server from server.js

Open another command line in the study-project folder
Execute "ng serve" - This will host Angular web page on http://localhost:4200/
```

3. IF CONNECTION ERRORS : Connect to the correct IP where the MQTT Broker is running.
```
Connect Raspberry Pi to WIFI and run MQTT Broker and note down the IP of the Pi.
    
Change the WiFi details in the actuator_esp8266.ino so that it can also connect to the WiFi.
    
Obtain the IP of the device where MQTT Broker is running.
    
In the app.js of the Web Application study-project Folder - replace the IP address already present with the currently 
obtained IP address of the MQTT broker else the MQTT will not connect.
    
Follow the same for Hardware devices in the following files
1. SensorFusion.py
2. actuator_esp8266.ino
    
This allows all the devices to connect over the same MQTT broker
```    

Now you can switch between tabs and check the data and also actuate.


Every sensor has its own angular component and thus it is easier to change the data and edit the component as well.
