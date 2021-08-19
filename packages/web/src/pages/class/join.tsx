import Field from '@/components/field';
import { useJoinClass } from '@/hooks/class';
import { Button, Input } from '@chakra-ui/react';
import {
  Form,
  Formik,
  FormikHelpers,
  useField,
  useFormikContext,
} from 'formik';

const initialValues = {
  code: '',
};

type Values = typeof initialValues;

export default function CreateClass() {
  const joinClass = useJoinClass();
  const handleSubmit = async (
    values: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    await joinClass.mutateAsync(values);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      component={CreateClassForm}
    />
  );
}

function CreateClassForm() {
  const { isSubmitting, isValid } = useFormikContext<Values>();
  const [codeInput, codeMeta] = useField('code');

  return (
    <Form>
      <Field meta={codeMeta} label="Class Code">
        <Input {...codeInput} />
      </Field>
      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting || !isValid}
      >
        Join
      </Button>
    </Form>
  );
}
