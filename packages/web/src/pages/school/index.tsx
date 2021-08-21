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

export default function School() {
  const { data: school, status } = useQuery<{ data: any }>('/school');

  if (status !== 'success' || !school) {
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
        <title>School</title>
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
            {school.data.name}
          </Heading>
          <Text fontSize="lg">
            School Code: <Tag>{school.data.code}</Tag>
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
            {school?.data.teachers?.map((teacher: any, index: number) => (
              <Tr key={teacher.id}>
                <Td>{index + 1}</Td>
                <Td>{teacher.name}</Td>
                <Td>{teacher.email}</Td>
                <Td>
                  <Checkbox
                    size="lg"
                    isDisabled
                    defaultIsChecked={teacher.verified}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
}
