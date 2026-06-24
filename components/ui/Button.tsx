import { cn } from "@/lib/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sargam-gold disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-sargam-green text-sargam-cream hover:bg-sargam-green/90",
        variant === "secondary" &&
          "border border-sargam-gold bg-white text-sargam-green hover:bg-sargam-cream",
        variant === "ghost" &&
          "text-sargam-crimson hover:bg-sargam-cream/70",
        className,
      )}
      {...props}
    />
  );
}
