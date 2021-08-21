import Editor from '@/components/editor';
import { Flex, Box, Heading } from '@chakra-ui/react';
import type { Meeting, MeetingParticipant, Note } from '@prisma/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
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
    <Flex
      width="full"
      bg="gray.50"
      flex={1}
      alignItems="center"
      justifyContent="center"
    >
      <Head>
        <title>Notes</title>
      </Head>
      <Box
        p={8}
        width="full"
        maxWidth={{ base: '480px', sm: '700px', md: '800px' }}
        rounded="lg"
        bg="white"
        textAlign="center"
        boxShadow="sm"
      >
        <Box mb={6} mt={2} textAlign="center">
          <Heading fontWeight="500">
            {note.data.participant.meeting.name}
          </Heading>
        </Box>
        <Editor
          height="40vh"
          note={{
            meetingId: note.data.participant.meeting.code,
            userId: note.data.participant.userId,
          }}
        />
      </Box>
    </Flex>
  );
}
