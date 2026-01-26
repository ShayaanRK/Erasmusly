import { useState, useEffect, useRef } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { Send, MessageSquare } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { cn } from "@/lib/utils";

const ENDPOINT = 'http://localhost:5000';
var socket;

const Chat = () => {
   const { user, loading } = useAuth();
   const [chats, setChats] = useState([]);
   const [selectedChat, setSelectedChat] = useState(null);
   const [messages, setMessages] = useState([]);
   const [newMessage, setNewMessage] = useState('');
   const [searchParams] = useSearchParams();
   const scrollRef = useRef();

   // Socket setup
   useEffect(() => {
      socket = io(ENDPOINT);
      socket.on('connection', () => console.log('Connected to socket'));
      return () => socket.disconnect();
   }, []);

   // Fetch chats
   useEffect(() => {
      setSelectedChat(null);
      setMessages([]);
      setChats([]);

      if (!user) return;

      const getChats = async () => {
         try {
            const { data } = await api.get('/chat');
            setChats(data);

            const preSelectId = searchParams.get('id');
            if (preSelectId) {
               const found = data.find(c => c._id === preSelectId);
               if (found) setSelectedChat(found);
            }
         } catch (error) {
            console.error("Failed to fetch chats:", error);
         }
      }
      getChats();
   }, [user, searchParams]);

   // Fetch messages when chat selected
   useEffect(() => {
      if (!selectedChat) return;

      const getMessages = async () => {
         try {
            const { data } = await api.get(`/message/${selectedChat._id}`);
            setMessages(data);
            socket.emit('join chat', selectedChat._id);
         } catch (error) {
            console.error("Failed to fetch messages:", error);
         }
      };
      getMessages();
   }, [selectedChat]);

   // Socket listener for new messages
   useEffect(() => {
      socket.on('message received', (newMsg) => {
         if (selectedChat && newMsg.chat === selectedChat._id) {
            setMessages(prev => [...prev, newMsg]);
         }
      });
   }, [selectedChat]);

   // Auto-scroll to bottom
   useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   // Send message
   const handleSend = async (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;

      try {
         const { data } = await api.post('/message', {
            chatId: selectedChat._id,
            text: newMessage
         });
         socket.emit('new message', data);
         setMessages(prev => [...prev, data]);
         setNewMessage('');
      } catch (error) {
         console.error("Failed to send message:", error);
      }
   };

   // Get other user in chat
   const getSender = (participants) => {
      if (!participants || !user) return null;
      const currentUserId = user._id || user.id;
      return participants.find(p => (p._id || p.id || p) !== currentUserId);
   };

   // Loading state
   if (loading || !user) {
      return (
         <div className="flex-1 flex items-center justify-center bg-slate-50/50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
         </div>
      );
   }

   return (
      <div className="flex h-[calc(100vh-100px)] w-full overflow-hidden">
         {/* Sidebar - Contacts List */}
         <div className={cn(
            "flex flex-col bg-slate-50/30 border-r border-slate-200 shrink-0",
            selectedChat ? "hidden md:flex w-80 lg:w-96" : "flex w-full"
         )}>
            {/* Sidebar Header */}
            <div className="h-20 shrink-0 px-6 py-4 border-b border-slate-200 bg-white/50 backdrop-blur-md flex items-center">
               <h2 className="font-black text-2xl text-slate-800 tracking-tight">Messages</h2>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-1">
               {chats.map((chat, index) => {
                  const other = getSender(chat.participants);
                  const isOnline = index === 0;
                  const isSelected = selectedChat?._id === chat._id;

                  return (
                     <div
                        key={chat._id}
                        onClick={() => setSelectedChat(chat)}
                        className={cn(
                           "p-4 rounded-2xl cursor-pointer transition-all duration-200 flex items-center gap-4",
                           isSelected
                              ? "bg-primary text-white shadow-lg shadow-primary/20"
                              : "hover:bg-white hover:shadow-md text-slate-800"
                        )}
                     >
                        <div className={cn(
                           "relative w-12 h-12 rounded-full shrink-0 overflow-hidden border-2",
                           isSelected ? "border-white/50" : "border-slate-100"
                        )}>
                           <img
                              src={other?.profilePicture || 'https://via.placeholder.com/150'}
                              className="w-full h-full object-cover"
                              alt={other?.name}
                           />
                           {isOnline && <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className="font-bold truncate">{other?.name || 'User'}</h4>
                           <p className={cn(
                              "text-xs truncate opacity-70",
                              isSelected ? "text-white/80" : "text-slate-500"
                           )}>
                              {chat.messages?.length > 0 ? chat.messages[chat.messages.length - 1].text : 'Start a conversation'}
                           </p>
                        </div>
                     </div>
                  )
               })}
            </div>
         </div>

         {/* Chat Area */}
         <div className={cn(
            "flex-1 flex flex-col h-full min-h-0 overflow-hidden bg-slate-50/50 relative",
            !selectedChat && "hidden md:flex items-center justify-center"
         )}>
            {selectedChat ? (
               <>
                  {/* Decorative Background */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

                  {/* Header - Fixed at top */}
                  <div className="h-20 shrink-0 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between shadow-sm z-20">
                     <div className="flex items-center gap-4">
                        <button
                           className="md:hidden p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
                           onClick={() => setSelectedChat(null)}
                        >
                           <MessageSquare size={20} className="text-slate-400" />
                        </button>
                        <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden shrink-0">
                           <img
                              src={getSender(selectedChat.participants)?.profilePicture || 'https://via.placeholder.com/150'}
                              className="w-full h-full object-cover"
                              alt="Recipient"
                           />
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-800 leading-tight">
                              {getSender(selectedChat.participants)?.name || 'Loading...'}
                           </h3>
                           <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Active Now</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Messages - Scrollable area */}
                  <div className="flex-1 overflow-y-auto min-h-0 p-6 md:p-8 space-y-6 relative z-10">
                     {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-40">
                           <p className="text-sm font-medium">No messages yet. Send a wave! 👋</p>
                        </div>
                     )}
                     {messages.map((m, i) => {
                        const isMe = m.sender?._id === user?._id || m.sender === user?._id;
                        return (
                           <div key={i} className={cn(
                              "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
                              isMe ? "justify-end" : "justify-start"
                           )}>
                              <div className={cn(
                                 "max-w-[85%] md:max-w-[70%] px-5 py-3.5 rounded-2xl shadow-sm",
                                 isMe
                                    ? "bg-primary text-white rounded-br-none"
                                    : "bg-white text-slate-800 rounded-bl-none border border-slate-100"
                              )}>
                                 <p className="leading-relaxed break-words text-sm md:text-[15px]">{m.text}</p>
                                 <span className={cn(
                                    "text-[10px] block mt-1.5 font-medium opacity-60",
                                    isMe ? "text-right" : "text-left"
                                 )}>
                                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                 </span>
                              </div>
                           </div>
                        )
                     })}
                     <div ref={scrollRef} className="h-2" />
                  </div>

                  {/* Footer - Fixed at bottom */}
                  <form
                     onSubmit={handleSend}
                     className="shrink-0 px-6 py-4 bg-white border-t border-slate-100 z-20 flex gap-3 items-center"
                  >
                     <div className="flex-1 relative">
                        <input
                           value={newMessage}
                           onChange={e => setNewMessage(e.target.value)}
                           className="w-full pl-6 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400 font-medium shadow-inner"
                           placeholder="Message..."
                        />
                     </div>
                     <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-primary text-white p-4 rounded-2xl hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:scale-100 shrink-0"
                     >
                        <Send size={22} />
                     </button>
                  </form>
               </>
            ) : (
               <div className="flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                  <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 animate-bounce duration-[3000ms]">
                     <MessageSquare size={48} className="text-primary/40" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">Your Inbox</h2>
                  <p className="max-w-xs text-sm font-medium leading-relaxed">
                     Select a conversation from the sidebar to start chatting with your potential roommates or hosts.
                  </p>
               </div>
            )}
         </div>
      </div>
   );
};

export default Chat;
