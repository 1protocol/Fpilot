import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the dashboard as the main landing page for authenticated users,
  // or to the login page for new users. The logic in app/(app)/layout.tsx
  // and the middleware will handle the final destination.
  redirect('/dashboard');
}
