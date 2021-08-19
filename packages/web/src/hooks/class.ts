import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Class } from '@prisma/client';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';
import api from '@/lib/api';

export function useClass() {
  return useQuery<Class>('/class');
}

export function useCreateClass() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useToast();

  return useMutation(
    async (data: { grade: number; section: string }) =>
      api.post('/class', data),
    {
      onSuccess() {
        queryClient.invalidateQueries('/class');

        toast({
          title: 'Class created!',
          description: `Your class has been created!`,
          status: 'success',
          isClosable: true,
        });

        router.push('/class');
      },
    }
  );
}

export function useJoinClass() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useToast();

  return useMutation(
    async (data: { code: string }) => api.post('/class/join', data),
    {
      onSuccess(result) {
        queryClient.invalidateQueries('/class');

        toast({
          title: 'Class joined!',
          description: result.data.message,
          status: 'success',
          isClosable: true,
        });

        router.push('/class');
      },
    }
  );
}
