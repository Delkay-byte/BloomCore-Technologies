import Link from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "inverse";
export type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-contrast hover:bg-accent-strong active:translate-y-px",
  secondary:
    "bg-gold text-gold-contrast hover:bg-gold-strong active:translate-y-px",
  outline:
    "border border-line-strong bg-transparent text-foreground hover:border-foreground hover:bg-surface-2 active:translate-y-px",
  ghost: "text-foreground hover:bg-surface-2 active:translate-y-px",
  inverse:
    "bg-accent-contrast text-accent hover:bg-gold hover:text-gold-contrast active:translate-y-px",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-[0.875rem]",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-[3.25rem] px-6 text-[1rem]",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-[7px] font-semibold tracking-[-0.01em] transition-[background-color,color,border-color,transform] duration-150 " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground " +
  "disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";

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
