import Link from '@/components/link';
import { Box } from '@chakra-ui/layout';
import { Flex, Heading, Text, VStack } from '@chakra-ui/react';
import type { Class, Meeting, User } from '@prisma/client';
import { DateTime } from 'luxon';
import Head from 'next/head';
import React from 'react';
import { useQuery } from 'react-query';

export default function Notes() {
  const { data: meetings, status } = useQuery<{
    data: (Meeting & {
      class: Class & {
        participants: User[];
      };
    })[];
  }>('/meeting');

  if (status !== 'success' || !meetings) {
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
        <title>Attendance</title>
      </Head>
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
          <Heading fontWeight="500">Attendance</Heading>
        </Box>
        <VStack mt={7} spacing={3}>
          {meetings.data.length > 0 ? (
            meetings.data.map(meeting => (
              <Box w="full" key={meeting.id}>
                <Link
                  py={3}
                  px={4}
                  bgColor="gray.50"
                  _hover={{ bgColor: 'gray.100' }}
                  borderRadius={3}
                  display="flex"
                  justifyContent="space-between"
                  href={`/attendance/${meeting.code}`}
                  width="full"
                >
                  <Text>{meeting.name}</Text>
                  <Text>
                    {DateTime.fromISO(meeting.createdAt as any).toFormat('DDD')}
                  </Text>
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
