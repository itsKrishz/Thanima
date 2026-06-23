"use client";

import { cn } from "@/lib/utils/cn";

type RadioOption<T extends string> = {
  label: string;
  value: T;
};

type RadioGroupProps<T extends string> = {
  name: string;
  label: string;
  value: T;
  options: RadioOption<T>[];
  onChange: (value: T) => void;
  error?: string;
  className?: string;
};

export function RadioGroup<T extends string>({
  name,
  label,
  value,
  options,
  onChange,
  error,
  className,
}: RadioGroupProps<T>) {
  return (
    <fieldset className="space-y-3">
      <legend className="block text-sm font-medium text-sargam-green">
        {label}
      </legend>
      <div className={cn("grid gap-3", className || (options.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"))}>
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const checked = value === option.value;

          return (
            <label
              key={option.value}
              htmlFor={id}
              className={cn(
                "flex cursor-pointer items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium transition",
                checked
                  ? "border-sargam-green bg-sargam-green text-sargam-cream"
                  : "border-sargam-gold/40 bg-white text-sargam-green hover:border-sargam-gold",
              )}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {error ? <p className="text-sm text-sargam-crimson">{error}</p> : null}
    </fieldset>
  );
}
