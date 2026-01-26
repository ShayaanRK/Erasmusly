import * as React from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAutoScroll } from "@/components/ui/chat/useAutoScroll";
import { cn } from "@/lib/utils";

const ChatMessageList = React.forwardRef(
   ({ className, children, smooth = false, ...props }, ref) => {
      const { scrollRef, isAtBottom, scrollToBottom, disableAutoScroll } =
         useAutoScroll({
            smooth,
            content: children,
         });

      // Merge the auto-scroll ref with the forwarded ref if needed
      React.useImperativeHandle(ref, () => scrollRef.current);

      return (
         <div className="relative w-full h-full">
            <div
               className={cn(
                  "flex flex-col w-full h-full p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200",
                  className
               )}
               ref={scrollRef}
               onWheel={disableAutoScroll}
               onTouchMove={disableAutoScroll}
               {...props}
            >
               {/* Increased gap for a more modern, spacious feel */}
               <div className="flex flex-col gap-4">{children}</div>
            </div>

            {!isAtBottom && (
               <Button
                  onClick={() => scrollToBottom()}
                  size="icon"
                  variant="outline"
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-full shadow-lg bg-white border-slate-200 hover:bg-slate-50 transition-all animate-bounce"
                  aria-label="Scroll to bottom"
               >
                  <ArrowDown className="size-4 text-slate-600" />
               </Button>
            )}
         </div>
      );
   }
);

ChatMessageList.displayName = "ChatMessageList";

export { ChatMessageList };