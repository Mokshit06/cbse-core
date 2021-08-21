import Editor from '@/components/editor';
import { useUser } from '@/hooks/auth';
import { useConnectMeeting } from '@/hooks/meeting';
import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { UserRole } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

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

  if (!meetingId) return null;
  // const {
  //   data: meeting,
  //   status,
  //   error,
  // } = useQuery(['/meeting', meetingId], {
  //   enabled: !!meetingId,
  //   retry: false,
  // });

  // if (status === 'loading') return null;

  // if (status !== 'success' || !meeting) {
  //   return (
  //     <Heading>
  //       Something went wrong! {(JSON.stringify(error))}
  //     </Heading>
  //   );
  // }

  return <MeetingView meetingId={meetingId} />;
}

function MeetingView({ meetingId }: { meetingId: string }) {
  const { participants, videoRef, stopRef } = useConnectMeeting(meetingId);
  const user = useUser();
  const [currentNote, setCurrentNote] = useState<{
    userId: string;
    meetingId: string;
  }>();
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Flex direction="column" flex={1}>
      <Flex px={6} py={4} justifyContent="flex-end">
        <Button onClick={onOpen}>Participants</Button>
      </Flex>
      <Flex flex={1}>
        <Grid
          flex={2}
          width="full"
          templateColumns="repeat(auto-fit, minmax(400px, 1fr))"
          alignContent="center"
          bgColor="gray.100"
          overflowX="hidden"
          justifyContent="center"
        >
          <AspectRatio overflow="hidden" ratio={16 / 10}>
            <video
              muted
              height="300"
              width="400"
              ref={videoRef}
              onLoadedMetadata={() => videoRef.current?.play()}
            />
          </AspectRatio>
          {participants.map((stream, index) => (
            <AspectRatio key={index} ratio={16 / 10}>
              <Video stream={stream.stream} />
            </AspectRatio>
          ))}
        </Grid>
        {user.data?.role === UserRole.STUDENT && (
          <Box flex={1}>
            <Editor note={{ userId: user.data.id, meetingId }} />
          </Box>
        )}

        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Participants</DrawerHeader>

            <DrawerBody>
              {/* <Input placeholder="Type here..." /> */}
              <Stack spacing={4} direction="column">
                <P name={user.data?.name} />
                {participants.map(participant => (
                  <P
                    onClick={() => {
                      setCurrentNote({
                        userId: participant.userId!,
                        meetingId,
                      });
                    }}
                    key={participant.userId}
                    name={participant.user}
                  />
                ))}
              </Stack>
            </DrawerBody>

            <DrawerFooter>
              <Box>
                {user.data?.role === UserRole.TEACHER && currentNote ? (
                  <Editor note={currentNote} />
                ) : null}
              </Box>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Flex>
  );
}

function P({ name, ...props }: any) {
  return (
    <Stack
      rounded="lg"
      bg="gray.50"
      p={4}
      direction="row"
      spacing={4}
      _hover={{ bg: 'gray.100' }}
      cursor={props.onClick ? 'pointer' : null}
      alignItems="center"
      {...props}
    >
      <Avatar name={name} />
      <Text fontSize="lg">{name}</Text>
    </Stack>
  );
}
