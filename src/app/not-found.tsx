import DinoGame from '@/components/DinoGame';

export const metadata = {
  title: '404 - System Offline',
};

export default function NotFound() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#050505]">
      <DinoGame />
    </main>
  );
}
