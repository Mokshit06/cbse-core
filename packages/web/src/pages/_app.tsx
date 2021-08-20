import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import Layout from '../components/layout';
import type { QueryFunction, QueryKey } from 'react-query';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';
import api from '../lib/api';
import '../styles/global.css';

const defaultQueryFn: QueryFunction<unknown, QueryKey> = async ({
  queryKey,
}) => {
  try {
    console.log({ queryKey });
    const { data } = await api.get(queryKey.join('/'));
    return data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error);
  }
};

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            queryFn: defaultQueryFn,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
export default MyApp;
