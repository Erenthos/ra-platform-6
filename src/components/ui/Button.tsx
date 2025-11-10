"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98] transition-all shadow-md shadow-indigo-900/30 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none",
        className
      )}
    >
      {children}
    </button>
  );
}

