import Field from '@/components/field';
import { useLogin } from '@/hooks/auth';
import { Button, Input } from '@chakra-ui/react';
import {
  Form,
  FormikHelpers,
  Formik,
  useField,
  useFormikContext,
} from 'formik';

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
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      component={LoginForm}
    />
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
      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting || !isValid}
      >
        Login
      </Button>
    </Form>
  );
}
