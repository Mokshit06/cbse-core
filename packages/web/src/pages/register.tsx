import Field from '@/components/field';
import { useRegister } from '@/hooks/auth';
import { Button, Input, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { UserRole } from '@prisma/client';
import {
  Form,
  Formik,
  FormikHelpers,
  useField,
  useFormikContext,
} from 'formik';
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
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      component={RegisterForm}
    />
  );
}

function RegisterForm() {
  const { isSubmitting, isValid } = useFormikContext<Values>();
  const [nameInput, nameMeta] = useField('name');
  const [emailInput, emailMeta] = useField('email');
  const [passwordInput, passwordMeta] = useField('password');
  const [roleInput, roleMeta] = useField('role');
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
        <RadioGroup {...roleInput}>
          <Stack direction="column">
            <Radio value={UserRole.STUDENT}>Student</Radio>
            <Radio value={UserRole.TEACHER}>Teacher</Radio>
            <Radio value={UserRole.SCHOOL_INCHARGE}>School Incharge</Radio>
          </Stack>
        </RadioGroup>
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
