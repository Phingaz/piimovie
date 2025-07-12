import Footer from '@/components/general/Footer';
import Header from '@/components/nav/Header';
import { auth } from '@/lib/auth';
import ENV from '@/lib/env';
import { headers } from 'next/headers';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  const isSuperAdmin = (ENV.SUPER_ADMINS || '').split(',').includes(user?.email || '');

  if (!isSuperAdmin) {
    return (
      <>
        <Header />
        <main className="flex items-center justify-center min-h-[calc(100svh-300px)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-500">You do not have permission to access this page.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
