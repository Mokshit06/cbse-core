import Editor from '@/components/editor';
import { useUser } from '@/hooks/auth';
import { useConnectMeeting } from '@/hooks/meeting';
import socket from '@/lib/socket';
import { Box, Stack } from '@chakra-ui/react';
import { UserRole } from '@prisma/client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import { useQuery } from 'react-query';

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

export default function Meeting() {
  const router = useRouter();
  const meetingId = router.query.id as string;
  const { data: meeting, status } = useQuery(['/meeting', meetingId], {
    enabled: !!meetingId,
  });

  if (status !== 'success' || !meeting) {
    return null;
  }

  return <MeetingView meetingId={meetingId} />;
}

function MeetingView({ meetingId }: { meetingId: string }) {
  const { participants, videoRef, stopRef } = useConnectMeeting(meetingId);
  const user = useUser();
  const [currentNote, setCurrentNote] = useState<{
    userId: string;
    meetingId: string;
  }>();

  return (
    <div>
      <video
        muted
        height="300"
        width="400"
        ref={videoRef}
        onLoadedMetadata={() => videoRef.current?.play()}
      />
      {/* <button onClick={() => stopRef.current?.('audio')}>Mute</button>
      <button onClick={() => stopRef.current?.('video')}>Turn off video</button> */}
      {participants.map((stream, index) => (
        <Video stream={stream.stream} key={index} />
      ))}
      <Stack direction="column">
        <Box>{user.data?.name}</Box>
        {participants.map(participant => (
          <Box
            onClick={() => {
              setCurrentNote({ userId: participant.userId!, meetingId });
            }}
            key={participant.userId}
          >
            {participant.user}
          </Box>
        ))}
      </Stack>
      {user.data?.role === UserRole.STUDENT ? (
        <Editor note={{ userId: user.data.id, meetingId }} />
      ) : currentNote ? (
        <Editor note={currentNote} />
      ) : null}
    </div>
  );
}
