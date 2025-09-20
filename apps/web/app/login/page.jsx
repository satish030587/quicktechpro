export const metadata = { title: 'Login' };

import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-10rem)] bg-gray-50 flex items-center justify-center py-12">
      <LoginForm />
    </div>
  );
}
