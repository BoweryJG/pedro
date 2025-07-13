const express = require('express');
const app = express();

app.use(express.static('.'));

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Voice Test from HTTP Server</title>
    <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
</head>
<body>
    <h1>Voice Test - Proper HTTP Origin</h1>
    <button onclick="connect()">Connect to Voice Chat</button>
    <div id="status">Ready</div>
    <div id="log"></div>
    
    <script>
        let socket;
        
        function log(msg) {
            document.getElementById('log').innerHTML += '<p>' + msg + '</p>';
            console.log(msg);
        }
        
        function connect() {
            log('Connecting to Socket.IO...');
            
            socket = io('https://pedrobackend.onrender.com/voice', {
                transports: ['websocket', 'polling']
            });
            
            socket.on('connect', () => {
                document.getElementById('status').textContent = '✅ CONNECTED!';
                log('Connected! Socket ID: ' + socket.id);
                
                socket.emit('start-call', {
                    sessionId: 'test-' + Date.now()
                });
            });
            
            socket.on('call-started', (data) => {
                log('Call started: ' + JSON.stringify(data));
            });
            
            socket.on('transcript', (data) => {
                log(data.role + ': ' + data.text);
            });
            
            socket.on('connect_error', (error) => {
                log('❌ Error: ' + error.message);
            });
        }
    </script>
</body>
</html>
  `);
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  console.log('Open this URL in your browser to test voice chat');
});