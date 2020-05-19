const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mqtt = require('mqtt')
var client  = mqtt.connect('tcp://192.168.0.104:1883')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

temperature = {}
co2 = {}
number_of_people = {}
humidity = {}
motion = {}
electricity = {}
location = {}



app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  next();
});


app.get('/iaas_co2',(req, res, next) => {
  res.status(200).json({
    co2: co2["co2"]
  });

});

app.get('/iaas_electricity',(req, res, next) => {
  res.status(200).json({
    electricity: electricity["electricity"]
  });

});

app.get('/iaas_humidity',(req, res, next) => {
  res.status(200).json({
    humidity: humidity["humidity"]
  });

});

app.get('/iaas_entrance',(req, res, next) => {
  res.status(200).json({
    number_of_people: number_of_people["number_of_people"]
  });

});

app.get('/iaas_location',(req, res, next) => {
  res.status(200).json({
    x: location['x'],
    y: location['y']
  });

});

app.get('/iaas_motion',(req, res, next) => {
  res.status(200).json({
    motion: motion["motion"]
  });

});

app.get('/iaas_temperature',(req, res, next) => {
  res.status(200).json({
    temperature: temperature["temperature"]
  });

});


app.post('/iaas_actuate',(req, res, next) => {
  const actuate_cmd = req.body;
  console.log('post',actuate_cmd.msg);
  publish_actuate_cmd(actuate_cmd.msg);
  res.status(201).json({
    message: 'actuate_cmd Executed'
  });
});

function publish_actuate_cmd(actuate_cmd){
  console.log('publishing', actuate_cmd);
  client.publish('iaas_actuate', actuate_cmd)
}



// MQTT

client.on('connect', function () {
  console.log("Connected...")
  client.subscribe('sensor_data/temperature/device_1');
  client.subscribe('sensor_data/co2/device_1');
  client.subscribe('sensor_data/number_of_people/device_1');
  client.subscribe('sensor_data/humidity/device_1');
  client.subscribe('sensor_data/motion/device_1');
  client.subscribe('sensor_data/electricity/device_1');
  client.subscribe('sensor_data/location/device_1');
})




// var myInt = setInterval(function () {
//   console.log('Publishing to sample_man_dal')
//   client.publish('test','hello from app.js')
// }, 1000);




client.on('message', function (topic, message) {
  routeData(topic, message);
})


function routeData(topic, message){
  switch (topic) {
    case 'sensor_data/temperature/device_1':
      console.log('temperature - ', message.toString());
      temperature = JSON.parse(message.toString())
      break;
    case 'sensor_data/co2/device_1':
      console.log('co2 - ', message.toString());
      co2 = JSON.parse(message.toString())
      break;
    case 'sensor_data/number_of_people/device_1':
      console.log('number_of_people - ', message.toString());
      number_of_people = JSON.parse(message.toString())
      break;
    case 'sensor_data/humidity/device_1':
      console.log('humidity - ', message.toString());
      humidity = JSON.parse(message.toString())
      break;
    case 'sensor_data/motion/device_1':
      console.log('motion - ', message.toString());
      motion = JSON.parse(message.toString())
      break;
    case 'sensor_data/electricity/device_1':
      console.log('electricity - ', message.toString());
      electricity = JSON.parse(message.toString())
      break;
    case 'sensor_data/location/device_1':
      console.log('location - ', message.toString());
      location = JSON.parse(message.toString())
      break;
    default:
      console.log('Invalid Topic', message.toString());
  }

}
module.exports = app;
