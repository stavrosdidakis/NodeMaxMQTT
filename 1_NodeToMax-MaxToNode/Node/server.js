const express = require('express');
const socket = require('socket.io');

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

//Function that serves the new socket connection
function newConnection(socket){
  console.log('New connection: ' + socket.id);

  //When a message arrives from Max, run the msgFromMax function
  socket.on('messageFromMax', msgFromMax);

  //Send random numbers to Max
  setInterval(function(){
    //Create a random number (0-100)
    let randVal1 = Math.random() * 100;
    io.sockets.emit('msg1FromNode', randVal1);
    //console.log("Message value1: " + randVal1);

    let randVal2 = Math.random() * 100;
    io.sockets.emit('msg2FromNode', randVal2);
    //console.log("Message value2: " + randVal2);

    //Or send a JSON with all values (this can be extracted in Max using the dict object)
    /*
    { "randomValue1" : Math.random() * 100,
      "randomValue2" : Math.random() * 100,
      "randomValue3" : Math.random() * 100
    }; */
  }, 3000); //Repeat every 3 seconds

  //This function will prepare the payload, and send the MQTT message
  function msgFromMax(data){
    console.log("Message from Max: " + data);
  }
}
