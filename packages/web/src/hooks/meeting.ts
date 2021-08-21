import socket from '@/lib/socket';
import Peer from 'peerjs';
import { useRef, useEffect, useState, useMemo } from 'react';
import { useUser } from './auth';
import {
  MeetingParticipant as PrismaMeetingParticipant,
  User,
} from '@prisma/client';
import api from '@/lib/api';

type MeetingParticipant = PrismaMeetingParticipant & {
  user: User;
};
type Participant = {
  stream: MediaStream;
  user?: string;
  userId?: string;
};

export function useConnectMeeting(meetingId: string) {
  const user = useUser();
  const peerRef = useRef<Peer>();
  const lastAddedRef = useRef(0);
  const lastConnectedRef = useRef(0);
  const clientConnectedRef = useRef(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stopRef = useRef<any>(() => {});

  useEffect(() => {
    if (!user.data || clientConnectedRef.current) return;

    const cleanupFns = [] as any[];
    clientConnectedRef.current = true;

    import('peerjs').then(async ({ default: Peer }) => {
      console.log('effect ran');
      const client = new Peer(user.data?.id, {
        path: '/peer',
        host: 'localhost',
        port: 5000,
      });

      client.on('open', id => {
        console.log('peer:open');
        socket.emit('meeting-join', {
          code: meetingId,
          userId: id,
        });
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      stopRef.current = (k: string) =>
        stream.getTracks().map(t => t.kind == k && t.stop());

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      client.on('call', call => {
        console.log('peer:remote:call', call.peer);
        call.answer(stream);
        call.on('stream', stream => {
          if (Date.now() - lastConnectedRef.current > 1000) {
            lastConnectedRef.current = Date.now();
            api.get(`/users/${call.peer}`).then(({ data }) => {
              setParticipants(s => [
                ...s,
                { stream, userId: call.peer, user: data.name },
              ]);
            });
          }
        });
        call.on('close', () => {
          console.log('peer:remote:call:close');
          // setStreams(s => [...s, { stream, user: 'Someone' }]);
        });
      });

      socket.on(
        'meeting-connected',
        ({ participant }: { participant: MeetingParticipant }) => {
          console.log('socket:meeting-connected');
          setTimeout(() => {
            const call = client.call(participant.userId, stream);

            if (call) {
              console.log('peer:call');
              call.on('stream', stream => {
                if (Date.now() - lastAddedRef.current > 1000) {
                  lastAddedRef.current = Date.now();
                  console.log('peer:call:stream');
                  setParticipants(s => {
                    return [
                      ...s,
                      {
                        stream,
                        user: participant.user.name,
                        userId: participant.user.id,
                      },
                    ];
                  });
                }
              });
            }
          }, 3000);
        }
      );

      socket.on(
        'meeting-disconnected',
        ({ participant }: { participant: MeetingParticipant }) => {
          console.log('socket:meeting-disconnected');
          setParticipants(streams =>
            streams.filter(s => s.userId === participant.user.id)
          );
        }
      );

      peerRef.current = client;
    });

    return () => {
      socket.off('meeting-connected').off('meeting-disconnected');
    };
  }, [meetingId, user]);

  return useMemo(
    () => ({
      participants,
      videoRef,
      stopRef,
    }),
    [participants]
  );
}
