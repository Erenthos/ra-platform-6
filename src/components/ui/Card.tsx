"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:bg-white/20 transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 text-lg font-semibold text-white", className)}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("text-gray-300 text-sm", className)}>{children}</div>
  );
}

