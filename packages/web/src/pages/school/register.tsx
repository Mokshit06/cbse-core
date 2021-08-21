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
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';

const initialValues = {
  name: '',
  address: '',
  website: '',
  city: '',
  state: '',
};

type Values = typeof initialValues;

export default function RegisterSchool() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();
  const registerSchool = useMutation(
    async (values: Values) => api.post('/school', values),
    {
      onSuccess() {
        queryClient.invalidateQueries('/school');
        queryClient.invalidateQueries('/auth/me');
        // TODO show toast
        router.push('/dashboard');
      },
    }
  );
  const handleSubmit = async (
    values: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    await registerSchool.mutateAsync(values);
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
        maxWidth={{ base: '380px', sm: '500px', md: '600px' }}
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
            component={RegisterSchoolForm}
          />
        </Box>
      </Box>
    </Flex>
  );
}

function RegisterSchoolForm() {
  const { isSubmitting, isValid } = useFormikContext<Values>();
  const [nameInput, nameMeta] = useField('name');
  const [addressInput, addressMeta] = useField('address');
  const [websiteInput, websiteMeta] = useField('website');
  const [cityInput, cityMeta] = useField('city');
  const [stateInput, stateMeta] = useField('state');

  return (
    <Form>
      <Field meta={nameMeta} label="Name">
        <Input {...nameInput} />
      </Field>
      <Field meta={addressMeta} label="Address">
        <Input {...addressInput} />
      </Field>
      <Field meta={cityMeta} label="City">
        <Input {...cityInput} />
      </Field>
      <Field meta={stateMeta} label="State">
        <Input {...stateInput} />
      </Field>
      <Field meta={websiteMeta} label="Website">
        <Input {...websiteInput} />
      </Field>
      <Box my={6} mb={0} textAlign="right">
        <Button
          isLoading={isSubmitting}
          disabled={isSubmitting || !isValid}
          type="submit"
          py={6}
        >
          Register
        </Button>
      </Box>
    </Form>
  );
}
