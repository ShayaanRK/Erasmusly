import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { Send, MessageSquare, ChevronLeft, Phone, Video, Search, MoreVertical } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { cn } from "../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
   ChatBubble,
   ChatBubbleAvatar,
   ChatBubbleMessage,
   ChatBubbleTimestamp,
} from "../components/ui/chat/chat-bubble";
import { ChatMessageList } from "../components/ui/chat/chat-message-list";
import { ChatInput } from "../components/ui/chat/chat-input";

const ENDPOINT = 'http://localhost:5000';
var socket;

const Chat = () => {
   const { user, loading } = useAuth();
   const [chats, setChats] = useState([]);
   const [selectedChat, setSelectedChat] = useState(null);
   const [messages, setMessages] = useState([]);
   const [newMessage, setNewMessage] = useState('');
   const [searchParams] = useSearchParams();

   // Socket setup
   useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit('setup', user);
      socket.on('connected', () => console.log('Socket Connected'));
      return () => {
         socket.disconnect();
      };
   }, [user]);

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
      if (!socket) return;

      const messageHandler = (newMsg) => {
         if (selectedChat && newMsg.chat === selectedChat._id) {
            setMessages(prev => [...prev, newMsg]);
         }
      };

      socket.on('message received', messageHandler);

      return () => {
         socket.off('message received', messageHandler);
      };
   }, [selectedChat]);

   const handleSend = async () => {
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

   const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
         e.preventDefault();
         handleSend();
      }
   };

   // Get other user helper
   const getSender = (participants) => {
      if (!participants || !user) return null;
      const currentUserId = user._id || user.id;
      return participants.find(p => (p._id || p.id || p) !== currentUserId);
   };

   if (loading || !user) {
      return (
         <div className="flex-1 flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
         </div>
      );
   }

   return (
      <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-50">
         {/* SIDEBAR */}
         <div className={cn(
            "flex flex-col bg-white border-r border-slate-200 shrink-0 transition-all duration-300",
            selectedChat ? "hidden md:flex w-80 lg:w-[320px]" : "flex w-full"
         )}>
            <div className="p-6 pb-2">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="font-black text-2xl text-slate-950 tracking-tight">Chats</h2>
                  <Button variant="ghost" size="icon" className="rounded-full">
                     <MoreVertical size={20} className="text-slate-400" />
                  </Button>
               </div>
               <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                     placeholder="Search messages..."
                     className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-600/20 outline-none transition-all"
                  />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 px-3 pb-4 space-y-1 custom-scrollbar">
               {chats.map((chat, index) => {
                  const other = getSender(chat.participants);
                  const isOnline = index === 0; // Mock online status
                  const isSelected = selectedChat?._id === chat._id;

                  return (
                     <div
                        key={chat._id}
                        onClick={() => setSelectedChat(chat)}
                        className={cn(
                           "p-3 rounded-2xl cursor-pointer transition-all duration-200 flex items-center gap-3",
                           isSelected
                              ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                              : "hover:bg-slate-100 text-slate-900"
                        )}
                     >
                        <div className="relative shrink-0">
                           <Avatar className={cn(
                              "w-12 h-12 border-2",
                              isSelected ? "border-white/20" : "border-transparent"
                           )}>
                              <AvatarImage src={other?.profilePicture} className="object-cover" />
                              <AvatarFallback className={cn(isSelected ? "bg-white/10" : "bg-slate-100")}>
                                 {other?.name?.charAt(0) || 'U'}
                              </AvatarFallback>
                           </Avatar>
                           {isOnline && (
                              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-baseline mb-0.5">
                              <h4 className="font-bold truncate text-sm tracking-tight">{other?.name || 'User'}</h4>
                              <span className={cn("text-[10px] font-medium", isSelected ? "text-white/60" : "text-slate-400")}>
                                 {chat.messages?.length > 0 ? '12:45' : ''}
                              </span>
                           </div>
                           <p className={cn(
                              "text-xs truncate font-medium",
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

         {/* MAIN CHAT AREA */}
         <div className={cn(
            "flex flex-1 flex-col h-full overflow-hidden bg-slate-50 relative",
            !selectedChat && "hidden md:flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-indigo-50"
         )}>
            {selectedChat ? (
               <div className="flex flex-col h-full w-full">
                  {/* HEADER */}
                  <div className="h-16 shrink-0 px-6 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between z-20">
                     <div className="flex items-center gap-3">
                        <Button
                           variant="ghost"
                           size="icon"
                           className="md:hidden -ml-2 h-9 w-9 rounded-full"
                           onClick={() => setSelectedChat(null)}
                        >
                           <ChevronLeft size={20} className="text-slate-600" />
                        </Button>
                        <div className="relative">
                           <Avatar className="w-10 h-10 border border-slate-100">
                              <AvatarImage src={getSender(selectedChat.participants)?.profilePicture} className="object-cover" />
                              <AvatarFallback className="bg-slate-100">{getSender(selectedChat.participants)?.name?.charAt(0)}</AvatarFallback>
                           </Avatar>
                           <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div className="min-w-0">
                           <h3 className="font-bold text-slate-950 leading-tight truncate text-sm">
                              {getSender(selectedChat.participants)?.name}
                           </h3>
                           <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                              Active Now
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-primary-600">
                           <Phone size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-primary-600">
                           <Video size={18} />
                        </Button>
                        <Separator orientation="vertical" className="h-6 mx-2" />
                        <Button variant="ghost" size="icon" className="rounded-full text-slate-400">
                           <MoreVertical size={18} />
                        </Button>
                     </div>
                  </div>

                  {/* MESSAGES LIST */}
                  <ChatMessageList className="flex-1 bg-slate-50/50" content={messages}>
                     {messages.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-30 h-full mt-20">
                           <MessageSquare size={48} className="mb-4 text-slate-400" />
                           <p className="text-sm font-bold uppercase tracking-[0.2em]">Zero messages here</p>
                           <p className="text-xs font-medium">Be the first to say hello!</p>
                        </div>
                     )}
                     {messages.map((m, i) => {
                        const isMe = m.sender?._id === user?._id || m.sender === user?._id;
                        const otherSender = getSender(selectedChat.participants);

                        return (
                           <ChatBubble key={i} variant={isMe ? "sent" : "received"}>
                              {!isMe && (
                                 <ChatBubbleAvatar
                                    src={otherSender?.profilePicture}
                                    fallback={otherSender?.name?.charAt(0)}
                                 />
                              )}
                              <ChatBubbleMessage variant={isMe ? "sent" : "received"}>
                                 {m.text}
                                 <ChatBubbleTimestamp
                                    timestamp={new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    className={cn("mt-1", isMe ? "text-white/60" : "text-slate-400")}
                                 />
                              </ChatBubbleMessage>
                           </ChatBubble>
                        );
                     })}
                  </ChatMessageList>

                  {/* FOOTER INPUT */}
                  <div className="p-4 bg-white border-t border-slate-200 z-20">
                     <div className="flex gap-3 items-center max-w-5xl mx-auto">
                        <ChatInput
                           value={newMessage}
                           onChange={e => setNewMessage(e.target.value)}
                           onKeyDown={handleKeyDown}
                           placeholder="Type your message..."
                           className="flex-1"
                        />
                        <Button
                           onClick={handleSend}
                           disabled={!newMessage.trim()}
                           size="icon"
                           className="h-11 w-11 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-600/20 transition-all active:scale-95 shrink-0"
                        >
                           <Send size={18} />
                        </Button>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                  <div className="w-20 h-20 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center mb-6 border border-slate-100 animate-in zoom-in-50 duration-500">
                     <MessageSquare size={40} className="text-primary-600/40" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-950 mb-2 tracking-tight">Your Inbox</h2>
                  <p className="max-w-xs text-xs font-bold uppercase tracking-widest leading-relaxed opacity-40">
                     Select a conversation to start your next adventure.
                  </p>
               </div>
            )}
         </div>
      </div>
   );
};

export default Chat;
