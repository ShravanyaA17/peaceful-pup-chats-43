import React from "react";
import { cn } from "@/lib/utils";

interface RadioButtonGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
    color?: string;
  }>;
  className?: string;
}

export function RadioButtonGroup({
  name,
  value,
  onChange,
  options,
  className,
}: RadioButtonGroupProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex items-center justify-center px-3 py-2 rounded-lg border-2 cursor-pointer transition-all text-sm font-medium min-w-[60px]",
            value === option.value
              ? option.color || "border-slate-600 bg-slate-600 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}
