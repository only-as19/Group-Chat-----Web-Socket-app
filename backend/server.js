import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const ROOM = 'group';
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('user is Connected', socket.id);

  socket.on('joinRoom', async (userName) => {
    console.log(`${userName} joining the group`);
    await socket.join(ROOM);

    socket.to(ROOM).emit('roomNotice', userName);
  });

  socket.on('chatMessage', (msg) => {
    socket.to(ROOM).emit('chatMessage', msg);
  });

  socket.on('showTyping', (userName) => {
    socket.to(ROOM).emit('showTyping', userName);
  });

  socket.on('removeTyping', (userName) => {
    socket.to(ROOM).emit('removeTyping', userName);
  });
});
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

server.listen(4600, () => {
  console.log('server running at http://localhost:4600');
});