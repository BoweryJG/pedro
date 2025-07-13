const https = require('https');

console.log('Monitoring backend deployment...');
console.log('Checking every 10 seconds...\n');

let lastStatus = null;

function checkDeployment() {
  // Check Socket.IO endpoint
  https.get('https://pedrobackend.onrender.com/socket.io/?EIO=4&transport=polling', (res) => {
    const status = res.statusCode;
    const timestamp = new Date().toLocaleTimeString();
    
    if (status !== lastStatus) {
      console.log(`[${timestamp}] Status changed: ${status}`);
      
      if (status === 200) {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log(`✅ Socket.IO is responding!`);
          console.log(`Response: ${data.substring(0, 100)}...`);
          
          // Now test the voice namespace
          testVoiceNamespace();
        });
      }
    } else if (status !== 200) {
      process.stdout.write('.');
    }
    
    lastStatus = status;
  }).on('error', (err) => {
    console.error(`[${new Date().toLocaleTimeString()}] Error: ${err.message}`);
  });
}

function testVoiceNamespace() {
  console.log('\nTesting voice namespace...');
  const io = require('socket.io-client');
  
  const socket = io('https://pedrobackend.onrender.com/voice', {
    transports: ['polling']
  });
  
  socket.on('connect', () => {
    console.log('✅ VOICE CHAT IS READY!');
    console.log('Socket ID:', socket.id);
    socket.close();
    process.exit(0);
  });
  
  socket.on('connect_error', (err) => {
    console.log('❌ Voice namespace not ready yet:', err.message);
  });
}

// Check immediately
checkDeployment();

// Then check every 10 seconds
setInterval(checkDeployment, 10000);