import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { User, UserRoundPlus, Lock, Mail } from "lucide-react";

import { Input, Button } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";

export function Register() {
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({ nickname, email, password });
      navigate("/login");
    } catch {
      setError("Error to create account");
    } finally {
      setLoading(false);
    }
  };

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

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 bg-green-50 md:bg-transparent py-12 px-6 w-full rounded-xl md:rounded-none shadow-sm md:shadow-none md:min-h-[420px] justify-center"
      >
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
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <Button icon={<UserRoundPlus size={20} />}>
          {loading ? "Creating new account" : "Create account"}
        </Button>

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
