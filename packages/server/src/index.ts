import { User } from '@prisma/client';
import http from 'http';
import { ExpressPeerServer } from 'peer';
import { Server } from 'socket.io';
import app from './app';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
const peerServer = ExpressPeerServer(server, {
  debug: true,
} as any);

app.use('/peer', peerServer);

io.on('connection', socket => {});

const port = process.env.PORT ?? 3000;

server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
