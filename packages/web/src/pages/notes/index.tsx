import { useQuery } from 'react-query';
import type { Note } from '@prisma/client';
import { Box } from '@chakra-ui/layout';
import Link from '@/components/link'

export default function Notes() {
  const { data: notes, status } = useQuery<{ data: Note[] }>('/notes');

  if (status !== 'success' || !notes) {
    return null;
  }

  return (
    <Box>
      {notes.data.map(note => (
        <Link href={`/notes/${note.id}`} key={note.id}>{note.id}</Link>
      ))}
    </Box>
  );
}
