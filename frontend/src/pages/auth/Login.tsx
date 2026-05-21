import { Lock, Mail, SquareArrowLeft } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

import { Link } from "react-router-dom";

export function Login() {
  return (
    <div className="w-full min-h-[520px] flex flex-col justify-center transition-all duration-300">
      <header className="md:hidden text-center mb-8">
        <h1 className="text-3xl font-bold text-green-900">Spendly</h1>
      </header>

      <header className="hidden md:block w-full mb-8 min-h-[90px]">
        <h1 className="text-3xl font-bold text-green-900">Welcome back</h1>
        <h2 className="text-sm text-green-700">
          Enter your credentials to continue
        </h2>
      </header>

      <form className="flex flex-col gap-5 bg-green-50 md:bg-transparent py-12 px-6 w-full rounded-xl md:rounded-none shadow-sm md:shadow-none">
        <h2 className="md:hidden text-lg font-semibold text-[#0a1f12]">
          Sign in
        </h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-green-800">Email</label>
          <Input id="email" placeholder="your@email.com" icon={<Mail size={20} />} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-green-800">Password</label>
          <Input id="password" placeholder="*********" icon={<Lock size={20} />} type="password" />
        </div>

        <Button icon={<SquareArrowLeft size={20} />}>Sign in</Button>

        <p className="text-sm text-[#0f2918] text-center mt-4">
          No account?{" "}
          <Link to="/register" className="text-green-700 underline hover:text-green-900">
            Create one free
          </Link>
        </p>
      </form>
    </div>
  );
}