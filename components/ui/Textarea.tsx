import { cn } from "@/lib/utils/cn";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <div className="space-y-2">
      <label
        htmlFor={textareaId}
        className="block text-sm font-medium text-sargam-green"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        className={cn(
          "min-h-28 w-full rounded-xl border border-sargam-gold/40 bg-white px-4 py-3 text-sm text-sargam-green placeholder:text-sargam-green/40 focus:border-sargam-gold focus:outline-none focus:ring-2 focus:ring-sargam-gold/30",
          error && "border-sargam-crimson focus:border-sargam-crimson focus:ring-sargam-crimson/30",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-sm text-sargam-crimson">{error}</p> : null}
    </div>
  );
}
