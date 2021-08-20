import { useQuery } from 'react-query';

export default function Attendance() {
  const { data: attendances, status } = useQuery('/meeting');

  if (status !== 'success' || !attendances) {
    return null;
  }

  return <pre>{JSON.stringify(attendances, null, 2)}</pre>;
}
