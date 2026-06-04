import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  children: ReactNode;
}

export const Button = ({
  icon,
  children,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`
        flex items-center justify-center gap-2
        w-full
        bg-spendly-800
        text-white
        hover:bg-spendly-900
        dark:bg-spendly-600
        dark:hover:bg-spendly-700
        hover:brightness-110
        hover:scale-[1.02]
        transition transition-colors duration-200
        py-2
        rounded-xl
        font-semibold
        mt-6
        cursor-pointer
        shadow-md
        ${className}
      `}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};
