import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import type { FieldMetaProps } from 'formik';
import type { ReactNode } from 'react';

export default function Field<TVal>({
  meta,
  label,
  children,
}: {
  meta: FieldMetaProps<TVal>;
  label?: string;
  children: ReactNode;
}) {
  return (
    <FormControl mt={4} isInvalid={meta.touched && !!meta.error}>
      {label && <FormLabel>{label}</FormLabel>}
      {children}
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
}
