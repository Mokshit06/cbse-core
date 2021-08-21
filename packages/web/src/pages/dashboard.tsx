import { useUser } from '@/hooks/auth';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { UserRole, Notification } from '@prisma/client';
import Link from 'next/link';
import React from 'react';
import { DateTime } from 'luxon';
import Head from 'next/head';

export default function Dashboard() {
  const user = useUser();

  if (user.status !== 'success' || !user.data) {
    return null;
  }

  return (
    <Box flex={1} bg="gray.50" h="100%">
      <Head>
        <title>Dashboard</title>
      </Head>
      <Box py="2.3rem" px="3rem">
        <Heading fontSize="5xl">Hello,</Heading>
        <Flex gridGap={3} alignItems="center">
          <Heading fontWeight={500} color="gray.600">
            {user.data.name}!
          </Heading>
          <svg viewBox="0 0 22.6 26.05" style={{ height: '100%', width: 30 }}>
            <path d="M19.57,17.77a7.51,7.51,0,0,1-6.87,4.55c-2.57,0-4.72-1.84-6.08-3.4a30.68,30.68,0,0,1-3.71-6c-.35-1-.38-1.61,0-1.94s1.14-.09,1.55.42,3,3.93,3.08,4.1A.38.38,0,0,0,8,15.7a.39.39,0,0,0,.05-.55l-4.22-6a1.17,1.17,0,0,1,.29-1.66,1.24,1.24,0,0,1,1.7.29l3.58,4.89a.34.34,0,0,0,.48.14c.17-.12.12-.36,0-.53L5.84,6.13a1.17,1.17,0,0,1,.29-1.66,1.23,1.23,0,0,1,1.7.29l4.36,6.38c.12.16.34.29.51.17s.1-.37,0-.55C12.15,9.85,10.24,6.58,9.92,6s-.39-1.16,0-1.43,1.25-.13,2.34,1a36.34,36.34,0,0,1,3.54,5.22,1.81,1.81,0,0,0,.32.41c.42.41.71.33.89-.06s.42-3.16,2-3.1c.57,0,1,.57,1.21,2a14.31,14.31,0,0,1-.7,7.71m2.77-8C22,7.31,20.87,6.05,19.13,6A3.29,3.29,0,0,0,16.2,7.46a24.49,24.49,0,0,0-2.38-3.28c-2.22-2.39-4-2.08-5-1.38a3.37,3.37,0,0,0-3.86-.07A3.27,3.27,0,0,0,3.51,5.5,3.26,3.26,0,0,0,1.58,7.93a3.46,3.46,0,0,0,0,1.4l-.17.15c-1,1-1.21,2.38-.52,4.23A32.41,32.41,0,0,0,5,20.3c2.39,2.74,5,4.13,7.67,4.13a9.57,9.57,0,0,0,8.82-5.87,16.27,16.27,0,0,0,.82-8.84"></path>
            <path
              fill="#FFD14D"
              d="M19.57,17.77a14.31,14.31,0,0,0,.7-7.71c-.24-1.4-.64-2-1.21-2-1.61-.06-1.8,2.62-2,3.1s-.47.47-.89.06a1.81,1.81,0,0,1-.32-.41,36.34,36.34,0,0,0-3.54-5.22c-1.09-1.18-1.82-1.41-2.34-1s-.33.85,0,1.43,2.23,3.85,2.78,4.76c.1.18.17.43,0,.55s-.39,0-.51-.17L7.83,4.76a1.23,1.23,0,0,0-1.7-.29,1.17,1.17,0,0,0-.29,1.66l4.07,6.2c.12.17.17.41,0,.53a.34.34,0,0,1-.48-.14L5.85,7.83a1.24,1.24,0,0,0-1.7-.29A1.17,1.17,0,0,0,3.86,9.2l4.22,6A.39.39,0,0,1,8,15.7a.38.38,0,0,1-.52-.15c-.12-.17-2.58-3.5-3.08-4.1s-1-.87-1.55-.42-.32,1,0,1.94a30.68,30.68,0,0,0,3.71,6c1.36,1.56,3.51,3.4,6.08,3.4a7.51,7.51,0,0,0,6.87-4.55"
            ></path>
            <path
              fill="#FFB73B"
              d="M17.31,17.3a10.21,10.21,0,0,1-1-4,.53.53,0,0,0-.53-.53.52.52,0,0,0-.52.53,11.3,11.3,0,0,0,1.11,4.5.53.53,0,0,0,.72.21.52.52,0,0,0,.21-.71M14.12,13a.52.52,0,0,1-.13.73,11.94,11.94,0,0,0-3,3.57.52.52,0,1,1-.9-.54,12.78,12.78,0,0,1,3.3-3.88.53.53,0,0,1,.74.12"
            ></path>
            <path
              fill="#7F7F7F"
              d="M6,25.06a11.86,11.86,0,0,1-5-5.55.53.53,0,1,0-1,.34A12.83,12.83,0,0,0,5.56,26,.52.52,0,1,0,6,25.06M18.12,4.2a.53.53,0,0,1-.7-.26A7.6,7.6,0,0,0,14,1a.53.53,0,0,1-.32-.67A.53.53,0,0,1,14.39,0a8.58,8.58,0,0,1,4,3.47.53.53,0,0,1-.26.7"
            ></path>
          </svg>
        </Flex>
      </Box>
      <Flex py="2.3rem" px="3rem" gridGap={3}>
        <Stack
          direction="column"
          flex={1}
          p={4}
          rounded="lg"
          boxShadow="sm"
          bg="purple.200"
        >
          <Flex
            alignItems="center"
            justifyContent="space-around"
            bg="purple.200"
            color="white"
            rounded="lg"
            p={4}
            minHeight="50vh"
            flexDirection="column"
          >
            <Image src="setup.png" height="60%" alt="" />
            <Info />
          </Flex>
        </Stack>
        <Meetings />
        <Notifications />
      </Flex>
    </Box>
  );
}

function Info() {
  const user = useUser();

  if (user.status !== 'success' || !user.data) {
    return null;
  }

  if (user.data.role === UserRole.TEACHER && !user.data.classId) {
    return (
      <Link href="/class/create" passHref>
        <Button
          as="a"
          bg="purple.300"
          fontSize="2xl"
          p={6}
          _hover={{ bg: 'purple.300', boxShadow: 'md' }}
          _focus={{ bg: 'purple.300', boxShadow: 'md' }}
          _active={{ bg: 'purple.300', boxShadow: 'md' }}
        >
          Create Class
        </Button>
      </Link>
    );
  }

  if (user.data.role === UserRole.STUDENT && !user.data.classId) {
    return (
      <Link href="/class/join" passHref>
        <Button
          as="a"
          bg="purple.300"
          fontSize="2xl"
          p={6}
          _hover={{ bg: 'purple.300', boxShadow: 'md' }}
          _focus={{ bg: 'purple.300', boxShadow: 'md' }}
          _active={{ bg: 'purple.300', boxShadow: 'md' }}
        >
          Join Class
        </Button>
      </Link>
    );
  }

  if (user.data.role === UserRole.SCHOOL_INCHARGE && !user.data.school) {
    return (
      <Link href="/school/register" passHref>
        <Button
          as="a"
          bg="purple.300"
          fontSize="2xl"
          p={6}
          _hover={{ bg: 'purple.300', boxShadow: 'md' }}
          _focus={{ bg: 'purple.300', boxShadow: 'md' }}
          _active={{ bg: 'purple.300', boxShadow: 'md' }}
        >
          Register School
        </Button>
      </Link>
    );
  }

  return (
    <Button
      as="div"
      bg="purple.300"
      fontSize="2xl"
      p={6}
      _hover={{ bg: 'purple.300', boxShadow: 'md' }}
      _focus={{ bg: 'purple.300', boxShadow: 'md' }}
      _active={{ bg: 'purple.300', boxShadow: 'md' }}
    >
      You&apos;re all done!
    </Button>
  );
}

function Meetings() {
  const { status, data: meetings } = useQuery<{ data: any[] }>('/meeting');
  const { data: user } = useUser();

  // if (status !== 'success' || !meetings) {
  //   return null;
  // }

  return (
    <Stack
      spacing={3}
      direction="column"
      flex={1}
      p={4}
      rounded="lg"
      boxShadow="sm"
      bg="white"
    >
      <Flex
        justifyContent="space-between"
        bg="gray.50"
        alignItems="center"
        rounded="lg"
        px={3}
      >
        <Heading py={4} as="h2" fontWeight="400" fontSize="xl">
          Meetings
        </Heading>
        {user?.role === UserRole.TEACHER && (
          <Link href="/meeting/create" passHref>
            <Button as="a">Create</Button>
          </Link>
        )}
      </Flex>
      {meetings?.data
        ?.filter(
          meeting => new Date(meeting.ended).getTime() >= new Date().getTime()
        )
        .map(meeting => (
          <Link
            href={
              new Date(meeting.startedAt).getTime() <= new Date().getTime()
                ? `/meeting/${meeting.code}`
                : '#'
            }
            passHref
            key={meeting.id}
          >
            <Box as="a" bg="gray.50" rounded="lg" p={4}>
              <Text fontWeight="500" color="gray.600" fontSize="lg">
                {meeting.name}
              </Text>
              <Box mt={2}>
                {/* TODO use luxon to format */}
                <Text>
                  Starts at:&nbsp;
                  {DateTime.fromISO(meeting.startedAt).toFormat('t cccc')}
                </Text>
                <Text>
                  Ends at:&nbsp;
                  {DateTime.fromISO(meeting.ended).toFormat('t cccc')}
                </Text>
              </Box>
              <Flex mt={3} alignItems="center" gridGap={3}>
                {(() => {
                  const name = meeting.class.participants.find(
                    (p: any) => p.role === UserRole.TEACHER
                  ).name;

                  return (
                    <>
                      <Avatar size="sm" name={name} />
                      <Text color="gray.700" fontWeight="400">
                        {name}
                      </Text>
                    </>
                  );
                })()}
              </Flex>
              {/* {JSON.stringify(meetings.data)} */}
            </Box>
          </Link>
        ))}
    </Stack>
  );
}

function Notifications() {
  const { status, data: notifications } =
    useQuery<{ data: Notification[] }>('/notifications');

  // if (status !== 'success' || !notifications) {
  //   return null;
  // }

  return (
    <Stack
      spacing={3}
      direction="column"
      flex={1}
      p={4}
      rounded="lg"
      boxShadow="sm"
      bg="white"
    >
      <Box bg="gray.50" p={4} rounded="lg">
        <Heading as="h2" fontWeight="400" fontSize="xl">
          Notifications
        </Heading>
      </Box>
      <Accordion allowToggle>
        {notifications?.data?.map(notification => (
          <AccordionItem key={notification.id}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {notification.title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>{notification.content}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Stack>
  );
}
