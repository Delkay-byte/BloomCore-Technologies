import Link from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "inverse";
export type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-contrast hover:bg-accent-strong",
  secondary: "bg-gold text-[#15170f] hover:bg-[#c8922f]",
  outline:
    "border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
  ghost: "text-foreground hover:bg-surface-2",
  inverse: "bg-background text-foreground hover:bg-gold hover:text-[#15170f]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-[0.875rem]",
  md: "h-12 px-6 text-[0.9375rem]",
  lg: "h-[3.25rem] px-7 text-[1rem]",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-none font-medium tracking-tight transition-colors duration-200 " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground " +
  "disabled:pointer-events-none disabled:opacity-50";

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(baseStyles, variantStyles[variant], sizeStyles[size], className);
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return <button className={buttonClasses({ variant, size, className })} {...props} />;
}

export type ButtonLinkProps = React.ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />;
}
