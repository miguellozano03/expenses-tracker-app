import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChartPie, Wallet, Lock } from "lucide-react";

interface LabelProps {
  icon?: React.ReactNode;
  text: string;
}

const Label = ({ icon, text }: LabelProps) => {
  return (
    <div className="flex justify-start items-center gap-3 px-4 py-3 rounded-xl bg-white/20 border border-white/10 backdrop-blur-sm text-green-300">
      {icon}
      <span className="text-green-50 font-medium">{text}</span>
    </div>
  );
};

const loginLabels = [
  {
    icon: <Wallet size={20} />,
    text: "Track every expense",
  },
  {
    icon: <ChartPie size={20} />,
    text: "Simple financial insights",
  },
  {
    icon: <Lock size={20} />,
    text: "Secure authentication",
  },
];

import { Link, useLocation } from "react-router-dom";

export function AuthSwitch() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <div className="flex border-b border-green-200 mb-8 w-sm mx-auto">
      <Link
        to="/login"
        className={`flex-1 text-center px-8 pb-2 text-sm font-medium transition
      ${
        isLogin
          ? "border-b-2 border-green-700 text-green-900"
          : "text-green-600 hover:text-green-800"
      }`}
      >
        Sign in
      </Link>

      <Link
        to="/register"
        className={`flex-1 text-center px-8 pb-2 text-sm font-medium transition
      ${
        !isLogin
          ? "border-b-2 border-green-700 text-green-900"
          : "text-green-600 hover:text-green-800"
      }`}
      >
        Create account
      </Link>
    </div>
  );
}

export function AuthLayout() {
  const location = useLocation();

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden min-h-screen flex items-center justify-center p-4 bg-green-100">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex min-h-screen">
        <section className="w-[42%] flex flex-col bg-linear-to-b from-green-600 via-green-800 to-green-900 text-white items-center justify-center p-12">
          <div className="flex flex-col w-full max-w-md text-center gap-5">
            <h1 className="text-5xl font-bold tracking-tight mb-4">Spendly</h1>

            <p className="text-green-100 text-lg leading-relaxed">
              Your smart expense tracker. Know where every peso goes.
            </p>

            {loginLabels.map((label) => (
              <Label key={label.text} icon={label.icon} text={label.text} />
            ))}
          </div>
        </section>

        <section className="flex-1 flex items-center justify-center p-10 bg-green-50">
          <div className="w-full max-w-xl">
            <AuthSwitch />
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -60, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </>
  );
}
