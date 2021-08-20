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

      await queryClient.invalidateQueries('/school');

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
    <Flex flex={1} width="full" alignItems="center" justifyContent="center">
      <Head>
        <title>Join your school</title>
      </Head>
      <Box
        borderWidth={1}
        p={8}
        width="full"
        maxWidth={['360px', null, null, '430px', null]}
        borderRadius={4}
        textAlign="center"
        boxShadow="lg"
      >
        <Box my={2} textAlign="center">
          <Heading>Join your school</Heading>
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
