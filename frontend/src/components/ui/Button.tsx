"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "success" | "outline" | "ghost";
  withArrow?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  withArrow = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={clsx(
        "w-full h-[52px] rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all",
        variant === "primary" && "btn-primary text-white",
        variant === "success" && "btn-success text-black",
        variant === "outline" && "border border-border-strong text-text bg-surface",
        variant === "ghost" && "text-text-dim",
        disabled && "opacity-40 pointer-events-none",
        className
      )}
      {...rest}
    >
      {children}
      {withArrow && <ArrowRight size={17} strokeWidth={2.5} />}
    </button>
  );
}
