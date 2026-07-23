import Alien404 from '@/components/Alien404';

export const metadata = {
  title: '404 - Offline',
};

export default function NotFound() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#000000]">
      <Alien404 />
    </main>
  );
}
