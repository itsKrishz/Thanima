import { cn } from "@/lib/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-sargam-green">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "w-full rounded-xl border border-sargam-gold/40 bg-white px-4 py-3 text-sm text-sargam-green placeholder:text-sargam-green/40 focus:border-sargam-gold focus:outline-none focus:ring-2 focus:ring-sargam-gold/30",
          error && "border-sargam-crimson focus:border-sargam-crimson focus:ring-sargam-crimson/30",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-sm text-sargam-crimson">{error}</p> : null}
    </div>
  );
}
