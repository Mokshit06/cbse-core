import Field from "@/components/field";
import { useJoinClass } from "@/hooks/class";
import { Box, Button, Flex, Heading, Input } from "@chakra-ui/react";
import {
  Form,
  Formik,
  FormikHelpers,
  useField,
  useFormikContext,
} from "formik";
import Head from "next/head";
import React from "react";

const initialValues = {
  code: "",
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
    <Flex
      width="full"
      bg="gray.50"
      flex={1}
      alignItems="center"
      justifyContent="center"
    >
      <Head>
        <title>Join your class</title>
      </Head>
      <Box
        p={8}
        width="full"
        maxWidth={{ base: "380px", sm: "500px", md: "500px" }}
        rounded="lg"
        bg="white"
        textAlign="center"
        boxShadow="sm"
      >
        <Box mt={2} mb={6} textAlign="center">
          <Heading fontWeight="500">Join Class</Heading>
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
  const [codeInput, codeMeta] = useField("code");

  return (
    <Form>
      <Field meta={codeMeta} label="Class Code">
        <Input {...codeInput} />
      </Field>
      <Box mt={6} mb={4} textAlign="left">
        <Button
          isLoading={isSubmitting}
          disabled={isSubmitting || !isValid}
          type="submit"
          width="full"
          py={6}
        >
          Login
        </Button>
      </Box>
    </Form>
  );
}
