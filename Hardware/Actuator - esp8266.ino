#include <ESP8266WiFi.h>
#include <PubSubClient.h>
 
const char* ssid = "Manish Dalvi";
const char* password =  "@Dalvi123!";
const char* mqttServer = "192.168.0.104";
const int mqttPort = 1883;
const int ledPin = 16;
 
WiFiClient espClient;
PubSubClient client(espClient);
 
void setup() {
  
  Serial.begin(9600);
 
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");
 
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
 
  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
 
    if (client.connect("ESP8266Client")) {
 
      Serial.println("connected");  
 
    } else {
 
      Serial.print("failed with state ");
      Serial.print(client.state());
      delay(2000);
 
    }
  }

  pinMode(LED_BUILTIN, OUTPUT);
  delay(2000);
  client.subscribe("iaas_actuate");
 
}
 
void callback(char* topic, byte* payload, unsigned int length) {
 
  Serial.print("Message arrived in topic: ");
  Serial.println(topic);
  Serial.print("Message:");
  String myString =  String((char*)payload );
  Serial.println(myString[5]);
  if(myString[5] == 'n'){
    Serial.println("On");
    digitalWrite(LED_BUILTIN, LOW);
  }else{
    Serial.println("Off");
    digitalWrite(LED_BUILTIN, HIGH);
  }

 
  Serial.println();
  Serial.println("-----------------------");
 
}
 
void loop() {
  client.loop();
}
//#include <ESP8266WiFi.h> // Enables the ESP8266 to connect to the local network (via WiFi)
//#include <PubSubClient.h> // Allows us to connect to, and publish to the MQTT broker
//
//const int ledPin = 16; // This code uses the built-in led for visual feedback that a message has been received
//
//// WiFi
//// Make sure to update this for your own WiFi network!
//const char* ssid = "Manish Dalvi";
//const char* wifi_password = "@Dalvi123!";
//
//// MQTT
//// Make sure to update this for your own MQTT Broker!
//const char* mqtt_server = "192.168.0.104";
//const char* mqtt_topic = "sensor_data";
//const char* clientID = "ESP01";
//bool led_flip = false;
//
//// Initialise the WiFi and MQTT Client objects
//WiFiClient wifiClient;
//PubSubClient client(mqtt_server, 1883, wifiClient); // 1883 is the listener port for the Broker
//
//void ReceivedMessage(char* topic, byte* payload, unsigned int length) {
//  Serial.print("Message arrived");
//if(led_flip == false){
//    led_flip = true;
//    digitalWrite(BUILTIN_LED, LOW);
//  }else{
//    led_flip = false;
//    digitalWrite(BUILTIN_LED, HIGH);
//  }
//}
//
//bool Connect() {
//  // Connect to MQTT Server and subscribe to the topic
//  if (client.connect(clientID)) {
//      client.subscribe(mqtt_topic);
//      return true;
//    }
//    else {
//      return false;
//  }
//}
//
//void setup() {
//  pinMode(ledPin, OUTPUT);
//
//  // Switch the on-board LED off to start with
////  digitalWrite(ledPin, HIGH);
//  digitalWrite(ledPin, LOW);
//
//  // Begin Serial on 115200
//  // Remember to choose the correct Baudrate on the Serial monitor!
//  // This is just for debugging purposes
//  Serial.begin(115200);
//
//  Serial.print("Connecting to ");
//  Serial.println(ssid);
//
//  // Connect to the WiFi
//  WiFi.begin(ssid, wifi_password);
//
//  // Wait until the connection has been confirmed before continuing
//  while (WiFi.status() != WL_CONNECTED) {
//    delay(500);
//    Serial.print(".");
//  }
//
//  // Debugging - Output the IP Address of the ESP8266
//  Serial.println("WiFi connected");
//  Serial.print("IP address: ");
//  Serial.println(WiFi.localIP());
//
//  // Connect to MQTT Broker
//  // setCallback sets the function to be called when a message is received.
//  client.setCallback(ReceivedMessage);
//  if (Connect()) {
//    Serial.println("Connected Successfully to MQTT Broker!"); 
//    client.subscribe(mqtt_topic);
//
//  }
//  else {
//    Serial.println("Connection Failed!");
//  }
//}
//
//void loop() {
//  // If the connection is lost, try to connect again
//  if (!client.connected()) {
//    bool value = Connect();
//    Serial.println(value);
//  }
//  // client.loop() just tells the MQTT client code to do what it needs to do itself (i.e. check for messages, etc.)
//  client.loop();
//  // Once it has done all it needs to do for this cycle, go back to checking if we are still connected.
//}
//
////#include <ESP8266WiFi.h>
////#include <PubSubClient.h>
////
////// Update these with values suitable for your network.
////
////const char* ssid = "Manish Dalvi";
////const char* password = "@Dalvi123!";
////const char* mqtt_server = "192.168.0.104";
////
////WiFiClient espClient;
////PubSubClient client(espClient);
////unsigned long lastMsg = 0;
////#define MSG_BUFFER_SIZE  (50)
////char msg[MSG_BUFFER_SIZE];
////int value = 0;
////bool led_flip = false;
////
////void setup_wifi() {
////
////  delay(10);
////  // We start by connecting to a WiFi network
////  Serial.println();
////  Serial.print("Connecting to ");
////  Serial.println(ssid);
////
////  WiFi.begin(ssid, password);
////
////  while (WiFi.status() != WL_CONNECTED) {
////    delay(500);
////    Serial.print(".");
////  }
////
////  randomSeed(micros());
////
////  Serial.println("");
////  Serial.println("WiFi connected");
////  Serial.println("IP address: ");
////  Serial.println(WiFi.localIP());
////}
////
////void callback(char* topic, byte* payload, unsigned int length) {
////  if(led_flip == false){
////    led_flip = true;
////    digitalWrite(BUILTIN_LED, LOW);
////  }else{
////    led_flip = false;
////    digitalWrite(BUILTIN_LED, HIGH);
////  }
////}
////
////void reconnect() {
////  // Loop until we're reconnected
////  while (!client.connected()) {
////    Serial.print("Attempting MQTT connection...");
////    // Create a random client ID
////    String clientId = "ESP8266Client-";
////    clientId += String(random(0xffff), HEX);
////    // Attempt to connect
////    if (client.connect(clientId.c_str())) {
////      Serial.println("connected");
////      // Once connected, publish an announcement...
////      client.publish("outTopic", "hello world");
////      // ... and resubscribe
////      client.subscribe("sensor_data");
////    } else {
////      Serial.print("failed, rc=");
////      Serial.print(client.state());
////      Serial.println(" try again in 5 seconds");
////      // Wait 5 seconds before retrying
////      delay(5000);
////    }
////  }
////}
////
////void setup() {
////  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
////  Serial.begin(115200);
////  setup_wifi();
////  client.setServer(mqtt_server, 1883);
////  client.setCallback(callback);
////  client.subscribe("sensor_data");
////}
////
////void loop() {
////
////  if (!client.connected()) {
////    reconnect();
////  }
////  client.loop();
////
////  unsigned long now = millis();
////  if (now - lastMsg > 2000) {
////    lastMsg = now;
////    ++value;
////    snprintf (msg, MSG_BUFFER_SIZE, "hello world #%ld", value);
////    Serial.print("Publish message: ");
////    Serial.println(msg);
////    client.publish("outTopic", msg);
////  }
////}
