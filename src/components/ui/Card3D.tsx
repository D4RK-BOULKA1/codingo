import React from "react";

export type CardVariant = "default" | "blue" | "yellow";

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverEffect?: boolean;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  variant = "default",
  hoverEffect = false,
  className = "",
  ...props
}) => {
  const variantClasses = {
    default: "card-3d",
    blue: "card-3d-blue",
    yellow: "card-3d-yellow",
  }[variant];

  const hoverClass = hoverEffect ? "card-3d-hover cursor-pointer" : "";

  return (
    <div
      className={`${variantClasses} ${hoverClass} p-6 bg-white ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
