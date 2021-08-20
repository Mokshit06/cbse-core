import DatePicker from '@/components/date-picker';
import Field from '@/components/field';
import api from '@/lib/api';
import { Button, Input } from '@chakra-ui/react';
import {
  Form,
  Formik,
  FormikHelpers,
  useField,
  useFormikContext,
} from 'formik';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';

const initialValues = {
  name: '',
  alertTime: '',
  startedAt: new Date(),
  endedAt: new Date(),
};

type Values = typeof initialValues;

export default function CreateMeeting() {
  const queryClient = useQueryClient();
  const createMeeting = useMutation(
    async (values: Values) => api.post('/meeting', values),
    {
      onSuccess() {
        // show toast and redirect
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
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      component={CreateMeetingForm}
    />
  );
}

function CreateMeetingForm() {
  const { isSubmitting, isValid } = useFormikContext<Values>();
  const [nameInput, nameMeta] = useField('name');
  const [alertTimeInput, alertTimeMeta] = useField('alertTime');
  const [startedAtInput, startedAtMeta, startedAtHelpers] =
    useField('startedAt');
  const [endedAtInput, endedAtMeta, endedAtHelpers] = useField('endedAt');

  return (
    <Form>
      <Field meta={nameMeta} label="Name of meeting">
        <Input {...nameInput} />
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
      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting || !isValid}
      >
        Schedule
      </Button>
    </Form>
  );
}
