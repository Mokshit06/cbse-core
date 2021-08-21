import { useQuery } from 'react-query';
import type { Note, MeetingParticipant, Meeting } from '@prisma/client';
import { Box } from '@chakra-ui/layout';
import Link from '@/components/link';
import React from 'react';
import { Flex, Heading, VStack, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { DateTime } from 'luxon';

export default function Notes() {
  const { data: notes, status } = useQuery<{
    data: (Note & {
      participant: MeetingParticipant & {
        meeting: Meeting;
      };
    })[];
  }>('/notes');

  if (status !== 'success' || !notes) {
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
      <Head>Notes</Head>
      <Box
        // borderWidth={1}
        p={8}
        width="full"
        maxWidth={['380px', null, null, '430px', null]}
        rounded="lg"
        bg="white"
        textAlign="center"
        boxShadow="sm"
      >
        <Box my={2} textAlign="center">
          <Heading fontWeight="500">Notes</Heading>
        </Box>
        <VStack mt={7} spacing={3}>
          {notes.data.length > 0 ? (
            notes.data.map(note => (
              <Box w="full" key={note.id}>
                <Link
                  py={3}
                  px={4}
                  bgColor="gray.50"
                  _hover={{ bgColor: 'gray.100' }}
                  borderRadius={3}
                  display="flex"
                  justifyContent="space-between"
                  href={`/notes/${note.id}`}
                  width="full"
                >
                  <Text>{note.participant.meeting.name}</Text>
                  <Text>
                    {DateTime.fromISO(note.createdAt as any).toFormat('DDD')}
                  </Text>
                  {/* <Text>
                    {DateTime.fromISO(note.createdAt as any).toFormat('t')}
                  </Text> */}
                </Link>
              </Box>
            ))
          ) : (
            <Text fontSize="lg">No meetings created yet</Text>
          )}
        </VStack>
      </Box>
    </Flex>
  );
}
