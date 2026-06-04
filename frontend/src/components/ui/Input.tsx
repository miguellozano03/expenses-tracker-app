import type { InputHTMLAttributes, ReactNode } from "react";
import { Info, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
  error?: string;
};

export const Input = ({ type, icon, error, ...props }: InputProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const isPassword = type === "password";

  const inputType = isPassword ? (isVisible ? "text" : "password") : type;

  return (
    <>
      <div
        className={`flex items-center w-full border gap-3 p-1 rounded-md transition-colors duration-200 ${error ? "border-red-400" : "border-spendly-200 dark:border-dark-border"}`}
      >
        {icon}
        <input {...props} type={inputType} className="w-full outline-none bg-white dark:bg-dark-card text-spendly-900 dark:text-dark-text placeholder:text-spendly-300 dark:placeholder:text-dark-border focus:border-spendly-600 dark:focus:border-dark-border" />
        {isPassword &&
          (isVisible ? (
            <Eye
              size={20}
              className="cursor-pointer text-spendly-600 dark:text-dark-muted"
              onClick={() => setIsVisible(false)}
            />
          ) : (
            <EyeOff
              size={20}
              className="cursor-pointer text-spendly-600 dark:text-dark-muted"
              onClick={() => setIsVisible(true)}
            />
          ))}
      </div>
      {error && (
        <span className="flex items-center gap-1 text-sm text-red-400 italic">
          <Info size={15} /> {error}
        </span>
      )}
    </>
  );
};
