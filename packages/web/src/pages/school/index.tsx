import { useQuery } from 'react-query';

export default function Class() {
  const { data: school, status } = useQuery('/school');

  if (status !== 'success' || !school) {
    return null;
  }

  return <pre>{JSON.stringify(school, null, 2)}</pre>;
}
