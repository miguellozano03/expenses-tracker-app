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
        bg-linear-to-r
        from-green-400
        via-green-600
        to-green-700
        hover:brightness-110
        hover:scale-[1.02]
        transition
        duration-300
        py-2
        rounded-xl
        text-white
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
