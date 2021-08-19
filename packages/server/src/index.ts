import { MeetingEntry, User } from '@prisma/client';
import 'dotenv-flow/config';
import http from 'http';
import { ExpressPeerServer } from 'peer';
import { Server } from 'socket.io';
import app from './app';
import prisma from './lib/prisma';

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

io.on('connection', socket => {
  const userId = socket.handshake.query.id as string;

  socket.on('meeting-join', async ({ code }: { code: string }) => {
    const meeting = await prisma.meeting.findUnique({
      where: { code },
    });
    if (!meeting) return;

    let participant = await prisma.meetingParticipant.findFirst({
      where: {
        meetingId: meeting.id,
        userId,
      },
      include: { entries: true },
    });

    if (!participant) {
      participant = await prisma.meetingParticipant.create({
        data: {
          meetingId: meeting.id,
          userId,
        },
        include: { entries: true },
      });
    }

    const entry = await prisma.meetingEntry.create({
      data: { meetingParticipantId: participant.id },
    });

    socket.join(meeting.id);
    socket.to(meeting.id).emit('meeting-connected', { participant });

    const removeParticipant = async () => {
      socket.to(meeting.id).emit('meeting-disconnected', { participant });
      await prisma.meetingEntry.update({
        where: { id: entry.id },
        data: { leftAt: new Date() },
      });
    };

    socket.on('disconnect-video', removeParticipant);
    socket.on('disconnect', removeParticipant);
  });
});

const port = process.env.PORT ?? 5000;

server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
