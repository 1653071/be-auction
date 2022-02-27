
const WebSocket = require('ws');

const WS_PORT = 40568;
const socketServer = new WebSocket.Server({ port: WS_PORT });

socketServer.on('connection', function (client) {
  console.log('Client connects successfully.');

  client.on('message', function (message) {
    console.log('received: %s', message);
  });

  // client.send('Hello client!');
});

console.log(`WebSocket Server is running at ws://localhost:${WS_PORT}`);

function broadcastAll(message) {
  for (let c of socketServer.clients) {
    if (c.readyState === WebSocket.OPEN) {
      c.send(message);
    }
  }
}
module.exports = {
    socketServer
    
}
