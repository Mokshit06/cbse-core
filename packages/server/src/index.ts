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
  socket.on(
    'meeting-join',
    async ({ code, userId }: { code: string; userId: string }) => {
      console.log('JOIN');
      const meeting = await prisma.meeting.findUnique({
        where: { code },
      });
      if (!meeting) return;

      let participant = await prisma.meetingParticipant.findFirst({
        where: {
          meetingId: meeting.id,
          userId,
        },
        include: { entries: true, user: true },
      });

      if (!participant) {
        participant = await prisma.meetingParticipant.create({
          data: {
            meetingId: meeting.id,
            userId,
          },
          include: { entries: true, user: true },
        });
      }

      const entry = await prisma.meetingEntry.create({
        data: { meetingParticipantId: participant.id },
      });

      socket.join(meeting.id);
      socket.to(meeting.id).emit('meeting-connected', {
        participant: { ...participant, entries: undefined },
      });

      const removeParticipant = async () => {
        socket.to(meeting.id).emit('meeting-disconnected', {
          participant: { ...participant, entries: undefined },
        });
        await prisma.meetingEntry.update({
          where: { id: entry.id },
          data: { leftAt: new Date() },
        });
      };

      socket.on('disconnect-video', removeParticipant);
      socket.on('disconnect', removeParticipant);
    }
  );

  socket.on('notes-edit', async ({ noteId, text, ops }) => {
    await prisma.note.update({
      where: { id: noteId },
      data: { text },
    });

    io.emit('remote-notes-edit', { noteId, text, ops });
  });
});

const port = process.env.PORT ?? 5000;

server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
