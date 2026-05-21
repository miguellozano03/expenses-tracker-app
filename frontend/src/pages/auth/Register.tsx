import { User, UserRoundPlus, Lock, Mail } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

import { Link } from "react-router-dom";

export function Register() {
  return (
    <>
      <header className="md:hidden text-center mb-8">
        <h1 className="text-3xl font-bold text-green-900">Spendly</h1>
      </header>
      <header className="hidden md:block text-start mb-8">
        <h1 className="text-3xl font-bold text-green-900">Join Spendly</h1>
        <h2 className="text-sm text-green-700">
          Create your account in seconds
        </h2>
      </header>

      <form className="flex flex-col gap-5 bg-green-50 md:bg-transparent py-12 px-6 w-full rounded-xl md:rounded-none shadow-sm md:shadow-none md:min-h-[420px] justify-center">
        <h2 className="md:hidden text-lg font-semibold text-[#0a1f12]">
          Create account
        </h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="nickanme" className="text-sm text-green-800">
            Nickname
          </label>
          <Input
            id="nickanme"
            placeholder="Your nickanme"
            icon={<User size={20} />}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm text-green-800">
            Email
          </label>
          <Input
            id="email"
            placeholder="your@email.com"
            icon={<Mail size={20} />}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm text-green-800">
            Password
          </label>
          <Input
            id="password"
            placeholder="Min. 8 characters"
            icon={<Lock size={20} />}
            type="password"
          />
        </div>

        <Button icon={<UserRoundPlus size={20} />}>Create account </Button>

        <p className="text-sm text-[#0f2918] text-center mt-4">
          Have you account?{" "}
          <Link
            to="/login"
            className="text-green-700 cursor-pointer underline hover:text-green-900"
          >
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
}
