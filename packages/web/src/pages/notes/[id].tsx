import Editor from '@/components/editor';
import type { Meeting, MeetingParticipant, Note } from '@prisma/client';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

export default function SingleNotes() {
  const router = useRouter();
  const noteId = router.query.id as string;
  const { data: note, status } = useQuery<{
    data: Note & {
      participant: MeetingParticipant & {
        meeting: Meeting;
      };
    };
  }>(['/notes', noteId], {
    enabled: !!noteId,
  });

  if (status !== 'success' || !note) {
    return null;
  }

  return (
    <Editor
      note={{
        meetingId: note.data.participant.meeting.code,
        userId: note.data.participant.userId,
      }}
    />
  );
}
