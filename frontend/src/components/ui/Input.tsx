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
        className={`flex items-center w-full border gap-3 p-1 rounded-md ${error ? "border-red-400" : "border-gray-300"}`}
      >
        {icon}
        <input {...props} type={inputType} className="w-full outline-none" />
        {isPassword &&
          (isVisible ? (
            <Eye
              size={20}
              className="cursor-pointer"
              onClick={() => setIsVisible(false)}
            />
          ) : (
            <EyeOff
              size={20}
              className="cursor-pointer"
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
