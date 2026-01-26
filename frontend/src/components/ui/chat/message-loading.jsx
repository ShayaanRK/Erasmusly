import React from "react";

const MessageLoading = () => {
   return (
      <div className="flex items-center gap-1.5 px-1 py-2">
         <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></div>
         <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"></div>
         <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"></div>
      </div>
   );
};

export default MessageLoading;