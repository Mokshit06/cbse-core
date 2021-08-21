import { useToast } from '@chakra-ui/react';
import { School, User, UserRole } from '@prisma/client';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import api from '../lib/api';

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useToast();

  return useMutation(
    async (data: { email: string; password: string }) =>
      api.post('/auth/login', data),
    {
      onSuccess() {
        queryClient.invalidateQueries('/auth/me');

        toast({
          title: 'Logged In!',
          description: `You are logged in to your account!`,
          status: 'success',
          isClosable: true,
        });

        router.push('/dashboard');
      },
      onError(error: any) {
        toast({
          title: 'Login failed',
          description: error.response.data?.message,
          status: 'error',
          isClosable: true,
        });
      },
    }
  );
}

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useToast();

  return useMutation(
    async (data: {
      email: string;
      password: string;
      name: string;
      role: UserRole;
    }) => api.post('/auth/register', data),
    {
      onSuccess() {
        queryClient.invalidateQueries('/auth/me');

        toast({
          title: 'Regsitration successful!',
          description: `You have been registered!`,
          status: 'success',
          isClosable: true,
        });

        router.push('/dashboard');
      },
      onError(error: any) {
        toast({
          title: 'Registration failed',
          description: error.response.data?.message,
          status: 'error',
          isClosable: true,
        });
      },
    }
  );
}

export function useUser() {
  return useQuery<
    User & {
      school: School | null;
    }
  >('/auth/me', {
    retry: false,
    refetchOnWindowFocus: false,
    // 10 mins
    staleTime: 1000 * 60 * 100,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useToast();

  return useMutation(async () => api.post('/auth/logout'), {
    onSuccess() {
      router.push('/');
      queryClient.setQueryData('/auth/me', null);

      toast({
        title: 'Logged Out!',
        description: `You are logged out of your account!`,
        status: 'success',
        isClosable: true,
        duration: 3000,
      });

      queryClient.invalidateQueries('/auth/me');
    },
  });
}
