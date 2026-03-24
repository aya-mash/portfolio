import { getResume } from '@/data';
import { Desktop } from '@/components/Desktop';

export default function HomePage() {
  const resume = getResume();
  return <Desktop resume={resume} />;
}
