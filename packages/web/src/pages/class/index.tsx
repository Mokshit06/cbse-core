import { useClass } from '@/hooks/class';

export default function Class() {
  const userClass = useClass();

  return <pre>{JSON.stringify(userClass, null, 2)}</pre>;
}
