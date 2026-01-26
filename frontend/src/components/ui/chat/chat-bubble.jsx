import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "../avatar";
import MessageLoading from "./message-loading";
import { Button } from "../button";

// --- Variants ---
const chatBubbleVariant = cva(
   "flex gap-3 max-w-[85%] md:max-w-[70%] items-end relative group mb-4",
   {
      variants: {
         variant: {
            received: "self-start",
            sent: "self-end flex-row-reverse",
         },
         layout: {
            default: "",
            ai: "max-w-full w-full items-start bg-slate-50 p-6 rounded-none",
         },
      },
      defaultVariants: {
         variant: "received",
         layout: "default",
      },
   }
);

const chatBubbleMessageVariants = cva(
   "p-4 px-5 text-[15px] font-semibold leading-snug shadow-md transition-all",
   {
      variants: {
         variant: {
            // Vibrant White/Grey for Received
            received: "bg-white text-slate-900 rounded-[24px] rounded-bl-[4px] border border-slate-100",
            // The "Vibrant Blue" from your image
            sent: "bg-[#006aff] text-white rounded-[24px] rounded-br-[4px] shadow-blue-500/20",
         },
         layout: {
            default: "",
            ai: "border-none bg-transparent p-0 shadow-none text-slate-900",
         },
      },
      defaultVariants: {
         variant: "received",
         layout: "default",
      },
   }
);

// --- Components ---

const ChatBubble = React.forwardRef(({ className, variant, layout, children, ...props }, ref) => (
   <div
      className={cn(chatBubbleVariant({ variant, layout, className }))}
      ref={ref}
      {...props}
   >
      {React.Children.map(children, (child) =>
         React.isValidElement(child)
            ? React.cloneElement(child, { variant, layout })
            : child
      )}
   </div>
));
ChatBubble.displayName = "ChatBubble";

const ChatBubbleAvatar = ({ src, fallback, className }) => (
   <Avatar className={cn("h-9 w-9 border-2 border-white shadow-sm", className)}>
      <AvatarImage src={src} alt="Avatar" />
      <AvatarFallback className="bg-slate-100 text-xs">{fallback}</AvatarFallback>
   </Avatar>
);

const ChatBubbleMessage = React.forwardRef(
   ({ className, variant, layout, isLoading = false, children, ...props }, ref) => (
      <div
         className={cn(
            chatBubbleMessageVariants({ variant, layout, className }),
            "break-words max-w-full whitespace-pre-wrap leading-relaxed"
         )}
         ref={ref}
         {...props}
      >
         {isLoading ? (
            <div className="flex items-center py-1">
               <MessageLoading />
            </div>
         ) : (
            children
         )}
      </div>
   )
);
ChatBubbleMessage.displayName = "ChatBubbleMessage";

// --- Updated Timestamp to match image (Light blue/white text inside bubble) ---
const ChatBubbleTimestamp = ({ timestamp, variant, className, ...props }) => (
   <div
      className={cn(
         "text-[10px] mt-1 font-medium opacity-70 tracking-tight",
         variant === "sent" ? "text-blue-100" : "text-slate-500",
         className
      )}
      {...props}
   >
      {timestamp}
   </div>
);

const ChatBubbleAction = ({ icon, onClick, className, variant = "ghost", size = "icon", ...props }) => (
   <Button
      variant={variant}
      size={size}
      className={cn("h-7 w-7 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100", className)}
      onClick={onClick}
      {...props}
   >
      {React.cloneElement(icon, { size: 14 })}
   </Button>
);

const ChatBubbleActionWrapper = React.forwardRef(({ variant, className, children, ...props }, ref) => (
   <div
      ref={ref}
      className={cn(
         "absolute top-1/2 -translate-y-1/2 flex opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2",
         variant === "sent" ? "-left-2 -translate-x-full flex-row" : "-right-2 translate-x-full",
         className
      )}
      {...props}
   >
      {children}
   </div>
));
ChatBubbleActionWrapper.displayName = "ChatBubbleActionWrapper";

export {
   ChatBubble,
   ChatBubbleAvatar,
   ChatBubbleMessage,
   ChatBubbleTimestamp,
   ChatBubbleAction,
   ChatBubbleActionWrapper,
};