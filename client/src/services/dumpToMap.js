var WebSocketClient = require('websocket').client

var client = new WebSocketClient();
var connection;
 
client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
    process.exit(1)
});
 
client.on('connect', function(inbound) {
    connection = inbound
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
        process.exit(1)
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
        process.exit(1)
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });
});

function sendPacket(obj) {
    if (connection && connection.connected) {
        var number = Math.round(Math.random() * 0xFFFFFF);
        connection.sendUTF(JSON.stringify(obj));
        return true
    } else {
        return false
    }
}
 
client.connect(`ws://localhost:${process.env.PPORT ? process.env.PPORT : 4242}/`);

export default sendPacket