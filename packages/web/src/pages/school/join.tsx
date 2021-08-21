import Field from '@/components/field';
import api from '@/lib/api';
import { Box, Button, Flex, Heading, Input, useToast } from '@chakra-ui/react';
import {
  Form,
  Formik,
  FormikHelpers,
  useField,
  useFormikContext,
} from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';

const initialValues = {
  code: '',
};

type InitialValues = typeof initialValues;

export default function JoinSchool() {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSubmit = async (
    values: InitialValues,
    { setSubmitting }: FormikHelpers<InitialValues>
  ) => {
    try {
      const { data: school } = await api.post('/school/join', {
        code: values.code,
      });

      queryClient.invalidateQueries('/school');
      queryClient.invalidateQueries('/auth/me');

      toast({
        title: school.message,
        description: `Logging you into your school!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      router.push('/dashboard');
    } catch (error) {
      const errorText = error?.response?.data?.message || error;

      toast({
        title: errorText,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    setSubmitting(false);
  };

  return (
    <Flex
      width="full"
      bg="gray.50"
      flex={1}
      alignItems="center"
      justifyContent="center"
    >
      <Head>
        <title>Join your school</title>
      </Head>
      <Box
        p={8}
        width="full"
        maxWidth={{ base: '380px', sm: '400px', md: '450px' }}
        rounded="lg"
        bg="white"
        textAlign="center"
        boxShadow="sm"
      >
        <Box my={2} mb={6} textAlign="center">
          <Heading fontWeight="500">Join your school</Heading>
        </Box>

        <Box mt={4}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            component={JoinSchoolForm}
          />
        </Box>
      </Box>
    </Flex>
  );
}

function JoinSchoolForm() {
  const [codeInput, codeMeta] = useField('code');
  const { isSubmitting, isValid } = useFormikContext();

  return (
    <Form>
      <Field meta={codeMeta} label="Enter school code">
        <Input placeholder="School code" {...codeInput} />
      </Field>
      <Box mt={6} mb={4} textAlign="left">
        <Button
          isLoading={isSubmitting}
          disabled={isSubmitting || !isValid}
          type="submit"
          width="full"
          py={6}
        >
          Join
        </Button>
      </Box>
    </Form>
  );
}
