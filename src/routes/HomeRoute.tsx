import { HeroSection } from '../HeroSection.tsx';
import PublicLayout from '../PublicLayout';

export default function HomeRoute() {
  return (
    <PublicLayout>
      <HeroSection />
    </PublicLayout>
  );
}
