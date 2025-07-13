import { Server } from 'socket.io';

export function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: [
        'https://gregpedromd.com',
        'https://www.gregpedromd.com',
        'https://gregpedromd.netlify.app',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175'
      ],
      credentials: true
    },
    path: '/socket.io/',
    transports: ['websocket', 'polling'] // Both transports for Render compatibility
  });

  // Voice namespace
  const voiceNamespace = io.of('/voice');
  
  voiceNamespace.on('connection', (socket) => {
    console.log(`Voice client connected: ${socket.id}`);
    
    socket.on('start-call', (data) => {
      console.log(`Starting call for session: ${data.sessionId}`);
      socket.emit('call-started', { sessionId: data.sessionId });
      
      // Send a welcome message after a short delay
      setTimeout(() => {
        socket.emit('transcript', {
          role: 'assistant',
          text: "Hello! I'm Julie from Dr. Pedro's office. How may I assist you today?"
        });
      }, 500);
    });
    
    socket.on('audio-data', (data) => {
      // Process audio data here
      console.log(`Received audio data for session: ${data.sessionId}`);
      
      // Echo back for testing
      socket.emit('audio-response', {
        audio: data.audio,
        sampleRate: 24000
      });
    });
    
    socket.on('end-call', (data) => {
      console.log(`Ending call for session: ${data.sessionId}`);
      socket.emit('call-ended', { sessionId: data.sessionId });
    });
    
    socket.on('disconnect', () => {
      console.log(`Voice client disconnected: ${socket.id}`);
    });
  });
  
  return io;
}