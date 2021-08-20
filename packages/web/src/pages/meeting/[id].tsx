import { useUser } from '@/hooks/auth';
import socket from '@/lib/socket';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import type Peer from 'peerjs';
import { MeetingParticipant, User } from '@prisma/client';

type Participant = MeetingParticipant & {
  user: User;
};

export default function Meeting() {
  const router = useRouter();
  const meetingId = router.query.id;
  const user = useUser();
  const peerRef = useRef<Peer>();
  const [streams, setStreams] = useState<
    Array<{ stream: MediaStream; user: string }>
  >([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastAddedRef = useRef<number>(0);
  const lastConnectedRef = useRef<number>(0);
  const clientConnectedRef = useRef(false);

  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development') {
  //     localStorage.debug = '*';
  //   }
  // }, []);

  useEffect(() => {
    if (!user.data || clientConnectedRef.current) return;

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
          code: 'meeting-code',
          userId: id,
        });
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      client.on('call', call => {
        console.log('peer:remote:call', call.peer);
        call.answer(stream);
        call.on('stream', stream => {
          if (Date.now() - lastConnectedRef.current > 1000) {
            lastConnectedRef.current = Date.now();
            setStreams(s => [...s, { stream, user: 'Someone' }]);
          }
        });
        call.on('close', () => {
          console.log('peer:remote:call:close');
          // setStreams(s => [...s, { stream, user: 'Someone' }]);
        });
      });

      socket.on(
        'meeting-connected',
        ({ participant }: { participant: Participant }) => {
          console.log('socket:meeting-connected');
          setTimeout(() => {
            const call = client.call(participant.userId, stream);

            if (call) {
              console.log('peer:call');
              call.on('stream', stream => {
                if (Date.now() - lastAddedRef.current > 1000) {
                  lastAddedRef.current = Date.now();
                  console.log('peer:call:stream');
                  setStreams(s => {
                    return [...s, { stream, user: participant.user.name }];
                  });
                }
              });
            }
          }, 3000);
        }
      );

      socket.on(
        'meeting-disconnected',
        ({ participant }: { participant: Participant }) => {
          console.log('socket:meeting-disconnected');
          setStreams(streams =>
            streams.filter(s => s.user === participant.user.name)
          );
        }
      );

      peerRef.current = client;
    });

    return () => {
      socket.off('meeting-connected');
    };
  }, [user]);

  return (
    <div>
      <pre>
        {JSON.stringify(
          streams.map(s => s.user),
          null,
          2
        )}
      </pre>
      <video
        height="300"
        width="400"
        ref={videoRef}
        onLoadedMetadata={() => videoRef.current?.play()}
      />
      {streams.map((stream, index) => (
        <Video stream={stream.stream} key={index} />
      ))}
    </div>
  );
}

function Video({ stream }: { stream?: MediaStream }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log('i');
    if (!videoRef.current || !stream) return;
    console.log('j');

    videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <video
      height="300"
      width="400"
      ref={videoRef}
      onLoadedMetadata={() => videoRef.current?.play()}
    />
  );
}
