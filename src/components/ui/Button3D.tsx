"use client";

import React from "react";
import Link from "next/link";
import { sounds } from "@/lib/audio/soundEffects";

export type ButtonVariant = "blue" | "yellow" | "white" | "green" | "red" | "disabled";
export type ButtonSize = "sm" | "md" | "lg";

interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  href?: string;
  icon?: React.ReactNode;
  playSound?: boolean;
}

export const Button3D: React.FC<Button3DProps> = ({
  children,
  variant = "blue",
  size = "md",
  fullWidth = false,
  href,
  icon,
  playSound = true,
  className = "",
  disabled,
  onClick,
  ...props
}) => {
  const currentVariant = disabled ? "disabled" : variant;

  const variantClasses = {
    blue: "btn-3d-blue",
    yellow: "btn-3d-yellow",
    white: "btn-3d-white",
    green: "btn-3d-green",
    red: "btn-3d-red",
    disabled: "btn-3d-disabled",
  }[currentVariant];

  const sizeClasses = {
    sm: "px-3 py-2 text-xs rounded-xl",
    md: "px-5 py-3 text-sm rounded-2xl",
    lg: "px-7 py-4 text-base rounded-2xl",
  }[size];

  const widthClass = fullWidth ? "w-full" : "";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (playSound) {
      sounds.playClick();
    }
    if (onClick) {
      onClick(e);
    }
  };

  const content = (
    <>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={`btn-3d ${variantClasses} ${sizeClasses} ${widthClass} ${className}`}
        onClick={() => {
          if (playSound) sounds.playClick();
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={`btn-3d ${variantClasses} ${sizeClasses} ${widthClass} ${className}`}
      {...props}
    >
      {content}
    </button>
  );
};
