import { redirect } from 'next/navigation';

export default function ForgotPasswordRedirect() {
  redirect('/client-sign-in');
}
