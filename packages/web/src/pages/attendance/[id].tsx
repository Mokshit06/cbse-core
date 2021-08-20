import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

export default function Test() {
  const router = useRouter();
  const testId = router.query.id as string;
  const { data: test, status } = useQuery(['/meeting', testId], {
    enabled: !!testId,
  });

  if (status !== 'success' || !test) {
    return null;
  }

  return <pre>{JSON.stringify(test, null, 2)}</pre>;
}
