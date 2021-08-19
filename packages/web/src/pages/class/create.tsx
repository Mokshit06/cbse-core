import Field from '@/components/field';
import { useCreateClass } from '@/hooks/class';
import { Button, Select } from '@chakra-ui/react';
import {
  Form,
  Formik,
  FormikHelpers,
  useField,
  useFormikContext,
} from 'formik';

const initialValues = {
  grade: 10,
  section: 'A',
};

type Values = typeof initialValues;

export default function CreateClass() {
  const createClass = useCreateClass();
  const handleSubmit = async (
    values: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    await createClass.mutateAsync(values);
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
  const [gradeInput, gradeMeta] = useField('grade');
  const [sectionInput, sectionMeta] = useField('section');

  return (
    <Form>
      <Field meta={gradeMeta} label="Grade">
        <Select placeholder="Select the grade" {...gradeInput}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </Select>
      </Field>
      <Field meta={sectionMeta} label="Section">
        <Select placeholder="Select the grade" {...sectionInput}>
          {['A', 'B', 'C', 'D'].map(section => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </Select>
      </Field>
      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting || !isValid}
      >
        Create
      </Button>
    </Form>
  );
}
