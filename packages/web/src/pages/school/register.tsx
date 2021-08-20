import Field from '@/components/field';
import api from '@/lib/api';
import { Button, Input, useToast } from '@chakra-ui/react';
import {
  Form,
  Formik,
  FormikHelpers,
  useField,
  useFormikContext,
} from 'formik';
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
        // TODO show toast
        router.push('/school');
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
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      component={RegisterSchoolForm}
    />
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
      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting || !isValid}
      >
        Register
      </Button>
    </Form>
  );
}
