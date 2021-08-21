import Field from '@/components/field';
import { useCreateClass } from '@/hooks/class';
import { Box, Button, Flex, Heading, Input, Select } from '@chakra-ui/react';
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
  grade: 10,
  section: 'A',
  code: '',
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
    <Flex
      width="full"
      bg="gray.50"
      flex={1}
      alignItems="center"
      justifyContent="center"
    >
      <Head>
        <title>Create your class</title>
      </Head>
      <Box
        p={8}
        width="full"
        maxWidth={{ base: '380px', sm: '500px', md: '500px' }}
        rounded="lg"
        bg="white"
        textAlign="center"
        boxShadow="sm"
      >
        <Box mt={2} mb={6} textAlign="center">
          <Heading fontWeight="500">Create your class</Heading>
        </Box>
        <Box mt={4}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            component={CreateClassForm}
          />
        </Box>
      </Box>
    </Flex>
  );
}

function CreateClassForm() {
  const { isSubmitting, isValid } = useFormikContext<Values>();
  const [gradeInput, gradeMeta] = useField('grade');
  const [sectionInput, sectionMeta] = useField('section');
  const [codeInput, codeMeta] = useField('code');

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
      <Field meta={codeMeta} label="School Code">
        <Input {...codeInput} />
      </Field>
      <Box my={6} mb={0} textAlign="right">
        <Button
          isLoading={isSubmitting}
          disabled={isSubmitting || !isValid}
          type="submit"
          py={6}
        >
          Create
        </Button>
      </Box>
    </Form>
  );
}
