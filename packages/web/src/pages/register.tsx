import Field from '@/components/field';
import { useRegister } from '@/hooks/auth';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { UserRole } from '@prisma/client';
import {
  Form,
  Formik,
  FormikHelpers,
  useField,
  useFormikContext,
} from 'formik';
import Head from 'next/head';
import React from 'react';

const initialValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '' as string | undefined,
  role: UserRole.STUDENT,
};

type Values = typeof initialValues;

export default function Register() {
  const register = useRegister();
  const handleSubmit = async (
    values: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    delete values.confirmPassword;
    await register.mutateAsync(values);
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
        <title>Sign up</title>
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
          <Heading fontWeight="500">Sign up</Heading>
        </Box>
        <Box mt={4}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            component={RegisterForm}
          />
        </Box>
      </Box>
    </Flex>
  );
}

function RegisterForm() {
  const { isSubmitting, isValid } = useFormikContext<Values>();
  const [nameInput, nameMeta] = useField('name');
  const [emailInput, emailMeta] = useField('email');
  const [passwordInput, passwordMeta] = useField('password');
  const [roleInput, roleMeta, roleHelpers] = useField('role');
  const [confirmPasswordInput, confirmPasswordMeta] =
    useField('confirmPassword');

  return (
    <Form>
      <Field meta={nameMeta} label="Name">
        <Input {...nameInput} />
      </Field>
      <Field meta={emailMeta} label="Email">
        <Input {...emailInput} type="email" />
      </Field>
      <Field meta={passwordMeta} label="Password">
        <Input {...passwordInput} type="password" />
      </Field>
      <Field meta={confirmPasswordMeta} label="Confirm Password">
        <Input {...confirmPasswordInput} type="password" />
      </Field>
      <Field meta={roleMeta} label="Role">
        <RadioGroup
          value={roleInput.value}
          onChange={r => roleHelpers.setValue(r)}
        >
          <Stack direction="column">
            <Radio value={UserRole.STUDENT}>Student</Radio>
            <Radio value={UserRole.TEACHER}>Teacher</Radio>
            <Radio value={UserRole.SCHOOL_INCHARGE}>School Incharge</Radio>
          </Stack>
        </RadioGroup>
      </Field>
      <Box mt={6} mb={4} textAlign="left">
        <Button
          isLoading={isSubmitting}
          disabled={isSubmitting || !isValid}
          type="submit"
          width="full"
          py={6}
        >
          Register
        </Button>
      </Box>
    </Form>
  );
}
