import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Text,
  useColorMode,
} from '@chakra-ui/react';
// import useAuth from 'hooks/useAuth';
import Head from 'next/head';
import { useRouter } from 'next/router';
// import { FaRocket } from 'react-icons/fa';
import NextImage from 'next/image';
import { useUser } from '@/hooks/auth';
import coverImg from '../../public/cover.png';

export default function Home() {
  const router = useRouter();
  // const { colorMode } = useColorMode();
  const { data: user, status } = useUser();

  const getStarted = () => {
    if (!!user && status === 'success') {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <Flex
      flex={1}
      justifyContent="center"
      alignItems="center"
      position="relative"
      overflow="hidden"
    >
      <Head>
        <title>Home | CBSE</title>
      </Head>
      <Image
        src={`/assets/triangle.svg`}
        alt=""
        position="absolute"
        width="40%"
        top={0}
        right={0}
        zIndex={-1}
      />
      <SimpleGrid
        width={{ base: '85%', sm: '80%' }}
        mx="auto"
        height="full"
        alignContent="center"
        gap={4}
        columns={{ base: 1, sm: 1, md: 2 }}
        fontFamily="spotify-circular"
      >
        <Flex
          height="full"
          width="90%"
          flexDir="column"
          justifyContent="center"
        >
          <Heading fontSize="3rem">
            Central Board of Secondary Education 2.0
          </Heading>
          <Text fontWeight="200" fontSize="1.6rem" mt={6}>
            The Central Board of Secondary Education (CBSE) is a national level
            board of education in India for public and private schools,
            controlled and managed by the Government of India.
          </Text>
          <Button
            // rightIcon={<FaRocket size="0.9rem" />}
            href="/dashboard"
            size="lg"
            width="fit-content"
            mt={6}
            onClick={getStarted}
          >
            Get Started
          </Button>
        </Flex>
        <Flex justifyContent="flex-end" height="full" width="full">
          <NextImage
            alt=""
            height={400}
            width={400}
            src={coverImg}
            objectFit="contain"
          />
        </Flex>
      </SimpleGrid>
    </Flex>
  );
}
