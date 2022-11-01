const maxApi = require('max-api');
const io = require('socket.io-client');

let socket;

maxApi.addHandler('connect', (url) => {
  socket = io(url);

  socket.on('msgFromNode', (msg) => {
    maxApi.outlet("msgFromNode", msg);
  });
});

maxApi.addHandler('disconnect', () => {
  socket.close();
});

maxApi.addHandler('msgFromMax', (msg) => {
  console.log(msg)
  socket.emit('msgFromMax', msg);
});
