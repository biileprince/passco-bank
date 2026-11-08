import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-10 w-full min-w-0 rounded-lg border bg-transparent px-3 py-2 text-base shadow-sm transition-[border-color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-foreground/10",
        "aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/10",
        "aria-[valid=true]:border-green-500 aria-[valid=true]:ring-2 aria-[valid=true]:ring-green-500/10",
        className
      )}
      {...props}
    />
  );
}

export { Input };
