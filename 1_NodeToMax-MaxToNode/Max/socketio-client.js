const maxApi = require('max-api');
const io = require('socket.io-client');

let socket;

maxApi.addHandler('connect', (url) => {
  socket = io(url);

  socket.on('msg1FromNode', (msg) => {
    maxApi.outlet("msg1FromNode", msg);
  });

  socket.on('msg2FromNode', (msg) => {
    maxApi.outlet("msg2FromNode", msg);
  });
});

maxApi.addHandler('disconnect', () => {
  socket.close();
});

maxApi.addHandler('messageFromMax', (msg) => {
  console.log(msg)
  socket.emit('messageFromMax', msg);
});
