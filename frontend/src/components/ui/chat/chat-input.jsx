import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const ChatInput = React.forwardRef(({ className, ...props }, ref) => (
   <Textarea
      autoComplete="off"
      ref={ref}
      name="message"
      // Enhanced styling: Soft background, pill-like rounding, and better focus states
      className={cn(
         "min-h-[44px] max-h-40 w-full resize-none bg-slate-100/50 px-4 py-3 text-sm transition-colors",
         "placeholder:text-slate-500",
         "focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:outline-none",
         "disabled:cursor-not-allowed disabled:opacity-50",
         "rounded-2xl flex items-center border-none shadow-inner",
         className,
      )}
      {...props}
   />
));

ChatInput.displayName = "ChatInput";

export { ChatInput };