import { Lock, Mail, SquareArrowLeft } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import React, { useState } from "react";

export function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/home");
    } catch {
      setError("Wrong credentials, try it again");
    } finally {
      setLoading(false);
    }
  };

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

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 bg-green-50 md:bg-transparent py-12 px-6 w-full rounded-xl md:rounded-none shadow-sm md:shadow-none"
      >
        <h2 className="md:hidden text-lg font-semibold text-[#0a1f12]">
          Sign in
        </h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-green-800">Email</label>
          <Input
            id="email"
            placeholder="your@email.com"
            icon={<Mail size={20} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-green-800">Password</label>
          <Input
            id="password"
            placeholder="*********"
            icon={<Lock size={20} />}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <Button icon={<SquareArrowLeft size={20} />} disabled={loading}>
          {loading ? "Signing in" : "Sign in"}
        </Button>

        <p className="text-sm text-[#0f2918] text-center mt-4">
          No account?{" "}
          <Link
            to="/register"
            className="text-green-700 underline hover:text-green-900"
          >
            Create one free
          </Link>
        </p>
      </form>
    </div>
  );
}
