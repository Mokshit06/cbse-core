import Field from '@/components/field';
import { useLogin } from '@/hooks/auth';
import { Box, Button, Flex, Heading, Input } from '@chakra-ui/react';
import {
  Form,
  FormikHelpers,
  Formik,
  useField,
  useFormikContext,
} from 'formik';
import Head from 'next/head';
import React from 'react';

const initialValues = {
  email: '',
  password: '',
};

type Values = typeof initialValues;

export default function Login() {
  const login = useLogin();
  const handleSubmit = async (
    values: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    await login.mutateAsync(values);
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
        <title>Login</title>
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
          <Heading fontWeight="500">Login</Heading>
        </Box>
        <Box mt={4}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            component={LoginForm}
          />
        </Box>
      </Box>
    </Flex>
  );
}

function LoginForm() {
  const { isSubmitting, isValid } = useFormikContext<Values>();
  const [emailInput, emailMeta] = useField('email');
  const [passwordInput, passwordMeta] = useField('password');

  return (
    <Form>
      <Field meta={emailMeta} label="Email">
        <Input {...emailInput} type="email" />
      </Field>
      <Field meta={passwordMeta} label="Password">
        <Input {...passwordInput} type="password" />
      </Field>
      <Box mt={6} mb={4} textAlign="left">
        <Button
          isLoading={isSubmitting}
          disabled={isSubmitting || !isValid}
          type="submit"
          width="full"
          py={6}
        >
          Login
        </Button>
      </Box>
    </Form>
  );
}
