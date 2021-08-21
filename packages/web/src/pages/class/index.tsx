import {
  Flex,
  Box,
  Heading,
  Text,
  Tag,
  Checkbox,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { DateTime } from 'luxon';
import Head from 'next/head';
import React from 'react';
import { useQuery } from 'react-query';

export default function Class() {
  const { data: userClass, status } = useQuery<{ data: any }>('/class');

  if (status !== 'success' || !userClass) {
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
          <Heading mb={2} fontWeight="500">
            Class {userClass.data.grade}-{userClass.data.section}
          </Heading>
          <Text fontSize="lg">
            Class Code: <Tag>{userClass.data.code}</Tag>
          </Text>
        </Box>
        <Table mt={8} rounded="lg" variant="simple">
          <Thead>
            <Tr>
              <Th>S. No.</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Verified</Th>
            </Tr>
          </Thead>
          <Tbody>
            {userClass?.data.participants?.map(
              (participant: any, index: number) => (
                <Tr key={participant.id}>
                  <Td>{index + 1}</Td>
                  <Td>{participant.name}</Td>
                  <Td>{participant.email}</Td>
                  <Td>
                    <Checkbox
                      size="lg"
                      isDisabled
                      defaultIsChecked={participant.verified}
                    />
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
}
