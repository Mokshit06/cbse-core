import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import React from 'react';
import {
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Box,
  Flex,
  Heading,
  Checkbox,
} from '@chakra-ui/react';
import {
  UserRole,
  Meeting,
  Class,
  MeetingParticipant,
  MeetingEntry,
  Note,
  User,
} from '@prisma/client';
import { useClass } from '@/hooks/class';
import Head from 'next/head';
import { DateTime } from 'luxon';

export default function Test() {
  const router = useRouter();
  const testId = router.query.id as string;
  const { data: userClass, status: classStatus } = useClass();
  const { data: meeting, status } = useQuery<{
    data: Meeting & {
      class: Class;
      particpants: (MeetingParticipant & {
        entries: MeetingEntry[];
        note: Note | null;
        user: User;
      })[];
    };
  }>(['/meeting', testId], {
    enabled: !!testId,
  });

  if (status !== 'success' || !meeting || !userClass) {
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
        p={8}
        width="full"
        maxW="1100px"
        // maxWidth={['380px', null, null, '430px', null]}
        rounded="lg"
        bg="white"
        textAlign="center"
        boxShadow="sm"
      >
        <Box my={2} textAlign="left" pl={4}>
          <Heading fontWeight="500">Attendance of {meeting.data.name}</Heading>
        </Box>
        <Table mt={8} rounded="lg" variant="simple">
          <Thead>
            <Tr>
              <Th>S. No.</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Joined at</Th>
              <Th>Present</Th>
              <Th>Total Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {userClass.data?.participants
              .filter(p => p.role === UserRole.STUDENT)
              .map((participant, index) => {
                const meetingParticipant = meeting.data.particpants.find(p => {
                  return p.userId === participant.id;
                });

                return (
                  <Tr key={participant.id}>
                    <Td>{index + 1}</Td>
                    <Td>{participant.name}</Td>
                    <Td>{participant.email}</Td>
                    <Td>
                      {' '}
                      {!!meetingParticipant
                        ? DateTime.fromMillis(
                            parseInt(
                              meetingParticipant?.entries[0].joinedAt as any
                            )
                          ).toFormat('t')
                        : 'NA'}
                    </Td>
                    <Td>
                      <Checkbox
                        size="lg"
                        isDisabled
                        defaultIsChecked={!!meetingParticipant}
                      />
                    </Td>
                    <Td>
                      {!meetingParticipant
                        ? 'N/A'
                        : `${(
                            meetingParticipant?.entries.reduce(
                              (totalTime, entry) => {
                                if (!entry.leftAt) return totalTime;

                                const timeInEntry =
                                  (new Date(entry.leftAt!).getTime() -
                                    new Date(entry.joinedAt!).getTime()) /
                                  1000;
                                console.log({ timeInEntry });

                                return totalTime + timeInEntry;
                              },
                              0
                            )! / 60
                          ).toFixed(1)} minutes`}
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
}
