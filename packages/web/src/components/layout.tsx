import { Flex, Heading, HStack, Spacer, Button } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { useUser, useLogout } from '../hooks/auth';
import Link from './link';
import { UserRole } from '@prisma/client';

export default function Layout({ children }: { children: ReactNode }) {
  const user = useUser();
  const logout = useLogout();

  return (
    <Flex minH="100vh" flexDirection="column">
      <Flex
        as="nav"
        align="center"
        wrap="wrap"
        padding="1.3rem"
        zIndex={1000}
        boxShadow="md"
      >
        <Flex align="center" mr={5}>
          <Heading mb={{ base: 3, sm: 0 }} as="h1" size="lg">
            CBSE
          </Heading>
        </Flex>

        <Spacer />

        <HStack
          spacing={5}
          mr={5}
          width={{ md: 'auto', base: 'full' }}
          alignItems="center"
        >
          <Link href="/">Home</Link>
          {user.data && user.status === 'success' ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              {user.data.role === UserRole.STUDENT && (
                <Link href="/notes">Notes</Link>
              )}
              {user.data.role === UserRole.TEACHER && (
                <Link href="/attendance">Attendance</Link>
              )}
              {/* {user.data.role === UserRole.SCHOOL_INCHARGE &&
                user.data.school && <Link href="/school">School</Link>} */}
              <Button onClick={() => logout.mutate()}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </HStack>
      </Flex>
      {children}
    </Flex>
  );
}
