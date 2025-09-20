export const metadata = { title: 'Create Account' };

import RegisterForm from './RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-10rem)] bg-gray-50 flex items-center justify-center py-12">
      <RegisterForm />
    </div>
  );
}
