import DatePicker from '@/components/date-picker';
import Field from '@/components/field';
import api from '@/lib/api';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
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
import { Chapter } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const initialValues = {
  name: '',
  alertTime: '',
  chapter: '',
  startedAt: new Date(),
  endedAt: new Date(),
};

type Values = typeof initialValues;

export default function CreateMeeting() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();
  const createMeeting = useMutation(
    async (values: Values) => api.post('/meeting', values),
    {
      onSuccess() {
        queryClient.invalidateQueries('/meeting');

        toast({
          title: 'Meeting scheduled',
          description: `The meeting you created has been scheduled!`,
          status: 'success',
          isClosable: true,
        });

        router.push('/');
      },
    }
  );
  const handleSubmit = async (
    values: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    await createMeeting.mutateAsync(values);
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
        <title>Schedule Meeting</title>
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
        <Box mt={2} mb={6} textAlign="center">
          <Heading fontWeight="500">Schedule Meeting</Heading>
        </Box>
        <Box mt={4}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            component={CreateMeetingForm}
          />
        </Box>
      </Box>
    </Flex>
  );
}

function CreateMeetingForm() {
  const { data: chapters } = useQuery<{ data: Chapter[] }>('/chapters');
  const { isSubmitting, isValid } = useFormikContext<Values>();
  const [nameInput, nameMeta] = useField('name');
  const [startedAtInput, startedAtMeta, startedAtHelpers] =
    useField('startedAt');
  const [endedAtInput, endedAtMeta, endedAtHelpers] = useField('endedAt');
  const [chapterInput, chapterMeta] = useField('chapter');

  return (
    <Form>
      <Field meta={nameMeta} label="Name of meeting">
        <Input {...nameInput} />
      </Field>
      <Field meta={chapterMeta} label="Chapter">
        <Select placeholder="Select the chapter" {...chapterInput}>
          {chapters?.data.map(chapter => (
            <option key={chapter.id} value={chapter.id}>
              {chapter.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field meta={startedAtMeta} label="Start time of meeting">
        <DatePicker
          selected={startedAtInput.value}
          onChange={v => startedAtHelpers.setValue(v)}
          showTimeSelect
          dateFormat="Pp"
        />
      </Field>
      <Field meta={endedAtMeta} label="End time of meeting">
        <DatePicker
          selected={endedAtInput.value}
          onChange={v => endedAtHelpers.setValue(v)}
          showTimeSelect
          dateFormat="Pp"
        />
      </Field>
      <Box my={6} mb={0} textAlign="right">
        <Button
          isLoading={isSubmitting}
          disabled={isSubmitting || !isValid}
          type="submit"
          py={6}
        >
          Schedule
        </Button>
      </Box>
    </Form>
  );
}
