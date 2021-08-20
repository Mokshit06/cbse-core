import { useQuery } from 'react-query';

export default function Dashboard() {
  const { data: meetings, status } = useQuery('/meeting');

  if (status !== 'success' || !meetings) {
    return null;
  }

  return <pre>{JSON.stringify(meetings, null, 2)}</pre>;
}
