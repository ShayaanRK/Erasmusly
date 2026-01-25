import { useState, useEffect, useRef } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { Send, User } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const ENDPOINT = 'http://localhost:5000';
var socket;

const Chat = () => {
   const { user } = useAuth();
   const [chats, setChats] = useState([]);
   const [selectedChat, setSelectedChat] = useState(null);
   const [messages, setMessages] = useState([]);
   const [newMessage, setNewMessage] = useState('');
   const [searchParams] = useSearchParams();
   const scrollRef = useRef();

   useEffect(() => {
      socket = io(ENDPOINT);
      socket.on('connection', () => console.log('Connected to socket'));
      return () => socket.disconnect();
   }, []);

   useEffect(() => {
      const getChats = async () => {
         const { data } = await api.get('/chat');
         setChats(data);

         const preSelectId = searchParams.get('id');
         if (preSelectId) {
            const found = data.find(c => c._id === preSelectId);
            if (found) setSelectedChat(found);
         }
      }
      getChats();
   }, [user]);

   useEffect(() => {
      if (!selectedChat) return;

      // Join room
      socket.emit('join_room', selectedChat._id);
      setMessages(selectedChat.messages || []);

      // Listen for messages
      socket.on('receive_message', (message) => {
         if (selectedChat._id === message.room) {
            // Ideally backend sends full message object, here we simulate or fetch
            // For MVP, if we receive a message signal, we might just append it if fits format
            // Or fetch latest. Let's assume message contains data.
            setMessages((prev) => [...prev, message]);
         }
      });

      return () => {
         socket.off('receive_message');
      }
   }, [selectedChat]);

   useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const handleSend = async (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;

      try {
         const { data } = await api.post('/chat/message', {
            chatId: selectedChat._id,
            content: newMessage
         });

         // The backend returns the UPDATED chat object with messages
         const sentMsg = data.messages[data.messages.length - 1];

         // Emit to socket
         socket.emit('send_message', {
            room: selectedChat._id,
            ...sentMsg,
            sender: { _id: user._id } // Optimistic update simulation for receiver
         });

         setMessages(data.messages);
         setNewMessage('');
      } catch (error) {
         console.error(error);
      }
   };

   const getSender = (participants) => {
      return participants.find(p => p._id !== user._id);
   }

   return (
      <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm text-sm md:text-base overflow-hidden">
         {/* Sidebar */}
         <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 border-r border-slate-200 flex-col`}>
            <div className="p-4 border-b border-slate-100 font-bold text-lg text-slate-700">Messages</div>
            <div className="flex-1 overflow-y-auto">
               {chats.map(chat => {
                  const other = getSender(chat.participants);
                  return (
                     <div
                        key={chat._id}
                        onClick={() => setSelectedChat(chat)}
                        className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${selectedChat?._id === chat._id ? 'bg-primary-50' : ''}`}
                     >
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 overflow-hidden">
                              <img src={other?.profilePicture} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/40'} />
                           </div>
                           <div>
                              <h4 className="font-semibold text-slate-800">{other?.name}</h4>
                              <p className="text-slate-500 text-xs truncate w-40">
                                 {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : 'Start chatting'}
                              </p>
                           </div>
                        </div>
                     </div>
                  )
               })}
            </div>
         </div>

         {/* Chat Area */}
         <div className={`${!selectedChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-slate-50/50`}>
            {selectedChat ? (
               <>
                  <div className="p-4 bg-white border-b border-slate-100 flex items-center gap-3 shadow-sm z-10">
                     <button className="md:hidden mr-2" onClick={() => setSelectedChat(null)}>←</button>
                     <h3 className="font-bold text-slate-800">{getSender(selectedChat.participants)?.name}</h3>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                     {messages.map((m, i) => {
                        const isMe = m.sender._id === user._id || m.sender === user._id;
                        return (
                           <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[70%] p-3 rounded-2xl ${isMe ? 'bg-primary-500 text-white rounded-br-none' : 'bg-white text-slate-800 shadow-sm rounded-bl-none'}`}>
                                 <p>{m.text}</p>
                                 <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-primary-100' : 'text-slate-400'}`}>
                                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                 </span>
                              </div>
                           </div>
                        )
                     })}
                     <div ref={scrollRef} />
                  </div>

                  <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                     <input
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        className="input-field rounded-full"
                        placeholder="Type a message..."
                     />
                     <button type="submit" className="bg-primary-500 text-white p-3 rounded-full hover:bg-primary-600 transition-colors">
                        <Send size={20} />
                     </button>
                  </form>
               </>
            ) : (
               <div className="flex-1 flex items-center justify-center text-slate-400">
                  Select a conversation to start chatting
               </div>
            )}
         </div>
      </div>
   );
};

export default Chat;
