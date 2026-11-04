import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Phone, Video, MoreVertical, Camera, Paperclip, Mic, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Message {
  id: string;
  text: string;
  idText?: string;
  isUser: boolean;
}

interface WhatsAppMockupProps {
  senderName: string;
  message?: string;
  messages?: Message[];
  isOnline?: boolean;
  isTyping?: boolean;
}

function MessageBubble({ msg, formatTime }: { msg: Message, formatTime: () => string }) {
  const [isTranslated, setIsTranslated] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleTranslateClick = () => {
    setIsTranslated(prev => !prev);
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 500); // Match animation duration
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: msg.isUser ? 20 : -20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} relative z-10 mb-1 w-full`}
    >
      <motion.div 
        layout
        className={`${msg.isUser ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none' : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'} rounded-lg p-2.5 max-w-[85%] shadow-sm relative group`}
      >
        <div className="flex gap-2 items-start">
          <AnimatePresence mode="wait">
            <motion.p 
              key={isTranslated ? 'id' : 'en'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-[14px] md:text-[15px] leading-relaxed whitespace-pre-wrap flex-1"
            >
              {isTranslated && msg.idText ? msg.idText : msg.text}
            </motion.p>
          </AnimatePresence>
          
          {msg.idText && (
            <button 
              onClick={handleTranslateClick}
              className={`p-1 rounded-full transition-all self-start shrink-0 bg-transparent text-slate-400 hover:text-cyan-400 hover:bg-slate-700/40`}
              title="Terjemahkan"
            >
              <motion.div
                animate={{ rotate: isSpinning ? 360 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Globe2 className="w-4 h-4" />
              </motion.div>
            </button>
          )}
        </div>
        <div className="flex justify-end items-center gap-1 mt-1">
          <span className="text-[9px] md:text-[10px] text-slate-400">{formatTime()}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function WhatsAppMockup({ senderName, message, messages, isOnline = true, isTyping = false }: WhatsAppMockupProps) {
  const displayMessages = messages || (message ? [{ id: '1', text: message, isUser: false }] : []);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  // Optimized smooth scrolling for mobile devices using a short delay
  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
    return () => clearTimeout(scrollTimer);
  }, [displayMessages, isTyping]);

  return (
    <div className="w-full max-w-sm mx-auto bg-[#0b141a] rounded-3xl overflow-hidden border-4 border-slate-700 shadow-2xl font-sans relative flex flex-col h-[500px] md:h-[600px] max-h-[65vh] ring-1 ring-white/10">
      {/* Status bar mockup */}
      <div className="h-6 w-full bg-[#0b141a] flex justify-between items-center px-4 text-[10px] text-slate-400 shrink-0">
        <span>{formatTime()}</span>
        <div className="flex gap-1">
          <div className="w-3 h-2.5 bg-slate-400 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-slate-400 rounded-full"></div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-[#202c33] flex items-center px-2 py-2 gap-2 text-slate-200 shadow-md z-10 shrink-0">
        <button className="flex items-center gap-1 p-1 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <div className="w-8 h-8 md:w-9 md:h-9 bg-slate-600 rounded-full shrink-0 flex items-center justify-center text-xs md:text-sm font-medium">
            {senderName.charAt(0).toUpperCase()}
          </div>
        </button>
        <div className="flex-1 overflow-hidden cursor-pointer">
          <h3 className="font-medium text-sm md:text-base truncate">{senderName}</h3>
          {isOnline && <p className="text-[10px] md:text-xs text-slate-400">online</p>}
        </div>
        <div className="flex gap-3 md:gap-4 px-1 md:px-2 text-slate-300">
          <Video className="w-4.5 h-4.5 md:w-5 md:h-5 cursor-pointer hover:text-white" />
          <Phone className="w-4.5 h-4.5 md:w-5 md:h-5 cursor-pointer hover:text-white" />
          <MoreVertical className="w-4.5 h-4.5 md:w-5 md:h-5 cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* Chat Background */}
      <div className="flex-1 bg-[#0b141a] relative overflow-y-auto p-3 md:p-4 flex flex-col gap-2">
        {/* Subtle patterned background for realism */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        {/* Date overlay */}
        <div className="flex justify-center mb-2 relative z-10">
          <span className="bg-[#182229] text-slate-400 text-[10px] md:text-xs px-2.5 py-0.5 rounded-lg shadow-sm font-mono">TODAY</span>
        </div>
        
        {/* Messages */}
        {displayMessages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} formatTime={formatTime} />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start relative z-10"
          >
            <div className="bg-[#202c33] text-[#e9edef] rounded-lg rounded-tl-none p-3 shadow-sm relative group flex gap-1.5 items-center h-10">
              <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
            </div>
          </motion.div>
        )}

        {/* Scroll Target */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#202c33] p-2 flex items-center gap-2 shrink-0">
        <button className="p-1.5 text-slate-400 hover:text-slate-300 transition-colors">
          <MoreVertical className="w-5 h-5 rotate-90" />
        </button>
        <div className="flex-1 bg-[#2a3942] rounded-full flex items-center px-3 py-1.5 gap-2">
          <button className="text-slate-400 hover:text-slate-300">
            <MoreVertical className="w-4 h-4" />
          </button>
          <input 
            type="text" 
            placeholder="Message" 
            className="flex-1 bg-transparent text-slate-200 outline-none text-xs md:text-sm"
            readOnly
          />
          <button className="text-slate-400 hover:text-slate-300">
            <Paperclip className="w-4.5 h-4.5 -rotate-45" />
          </button>
          <button className="text-slate-400 hover:text-slate-300">
            <Camera className="w-4.5 h-4.5" />
          </button>
        </div>
        <button className="w-9 h-9 bg-[#00a884] hover:bg-[#008f6f] rounded-full flex items-center justify-center text-white shrink-0 transition-colors">
          <Mic className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
