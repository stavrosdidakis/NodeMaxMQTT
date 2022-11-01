const express = require('express');
const socket = require('socket.io');
const mqtt = require('mqtt')
let payload;

//Setup the server ---------------------------------------------
const app = express();
const http = require('http');
const hostname = '127.0.0.1'; //localhost
const port = 5001;
const server = http.createServer(app);

//app.use( express.static('public') );
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  });

  //app.get("/", (request, response) => {
    //response.sendFile(directory_name + "index.html");
  //});
  //--------------------------------------------------------------

  //Allow server to use the socket
  const io = socket(server);
  //Dealing with server events / connection
  //...when a new connection is on, run the newConnection function
  io.sockets.on('connection', newConnection); //callback

  //MQTT settings
  const clientMQTTID = Math.random().toString(16).slice(3);
  const options = {
    username: '{replace here}',
    password: '{replace here}',
    clientMQTT: clientMQTTID
  };

  //Connect to a HiveMQ Cluster. Insert your own host name and port
  const clientMQTT = mqtt.connect('tls://{replace here}.s1.eu.hivemq.cloud:8883', options);
  //Topics for MQTT
  const inTopic = "/inTopic/";
  const outTopic = "/outTopic/";

  //Function that serves the new socket connection
  function newConnection(socket){
    console.log('New connection: ' + socket.id);

    //When a message arrives from Max, run the msgFromMax function
    socket.on('msgFromMax', msgFromMax);

    //This function will prepare the payload, and send the MQTT message
    function msgFromMax(data){
      console.log("Message from Max: " + data);
      payload = data;
      clientMQTT.publish(outTopic, String(payload), function() {
        console.log("Pushed to MQTT: " + payload);
        //clientMQTT.end(); // Close the connection when published
      });
    }
  }

  //MQTT Message
  clientMQTT.on('connect', function() { // When connected
    //Subscribe to a topic
    clientMQTT.subscribe(inTopic, function() {
    //When a message arrives, get topic, message, packet
    clientMQTT.on('message', function(topic, message, packet) {
      console.log("Message: " + message);
      //Get the message (as buffer), convert it to a String, and then to a JSON
      let getMessage = JSON.parse(message.toString());
      //Use the sockets to send the message to Max
      io.sockets.emit('msgFromNode', getMessage);
      console.log("Received MQTT message: " + message + ", on topic: " + topic);
    });
  });
});

  //Reassurance that the connection worked
  clientMQTT.on('connect', () => {
    console.log('Connected!');
  });

  //Prints a received message
  clientMQTT.on('message', function(topic, message) {
    //console.log(String.fromCharCode.apply(null, message)); //Need to convert the byte array to string
  });


  //Print an error message if something goes wrong
  clientMQTT.on('error', (error) => {
    console.log('Error:', error);
  });

  //Subscribe and publish to the topics of choice
  clientMQTT.subscribe(inTopic);
