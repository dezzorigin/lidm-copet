import { useEffect, useMemo, useRef, useState } from 'react';
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
              type="button"
              onClick={handleTranslateClick}
              aria-label={isTranslated ? 'Tampilkan pesan Inggris' : 'Terjemahkan pesan ke Indonesia'}
              aria-pressed={isTranslated}
              className="shrink-0 self-start rounded-full bg-transparent p-1 text-slate-400 transition-all hover:bg-slate-700/40 hover:text-cyan-400"
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
  const displayMessages = useMemo<Message[]>(
    () => messages || (message ? [{ id: '1', text: message, isUser: false }] : []),
    [messages, message],
  );
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
    <div className="relative mx-auto flex h-[500px] max-h-[65vh] w-full max-w-sm flex-col overflow-hidden rounded-sm border-4 border-tinta bg-[#0b141a] font-sans md:h-[600px] dark:border-kertas-gelap/60">
      {/* Status bar mockup */}
      <div className="flex h-6 w-full shrink-0 items-center justify-between bg-[#0b141a] px-4 text-[10px] text-slate-400" aria-hidden="true">
        <span>{formatTime()}</span>
        <div className="flex gap-1">
          <div className="w-3 h-2.5 bg-slate-400 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-slate-400 rounded-full"></div>
        </div>
      </div>

      {/* Header — ikon-ikon di sini adalah hiasan mockup telepon, bukan
          tombol aplikasi: dirender sebagai span agar tidak ada tombol mati. */}
      <div className="z-10 flex shrink-0 items-center gap-2 bg-[#202c33] px-2 py-2 text-slate-200" aria-hidden="true">
        <span className="flex items-center gap-1 p-1">
          <ArrowLeft className="w-5 h-5" />
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-600 text-xs font-medium md:h-9 md:w-9 md:text-sm">
            {senderName.charAt(0).toUpperCase()}
          </span>
        </span>
        <div className="flex-1 overflow-hidden">
          <h3 className="truncate text-sm font-medium md:text-base">{senderName}</h3>
          {isOnline && <p className="text-[10px] text-slate-400 md:text-xs">online</p>}
        </div>
        <div className="flex gap-3 px-1 text-slate-300 md:gap-4 md:px-2">
          <Video className="h-5 w-5" />
          <Phone className="h-5 w-5" />
          <MoreVertical className="h-5 w-5" />
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

      {/* Input Area — hiasan mockup, bukan input sungguhan. */}
      <div className="flex shrink-0 items-center gap-2 bg-[#202c33] p-2" aria-hidden="true">
        <span className="p-1.5 text-slate-400">
          <MoreVertical className="w-5 h-5 rotate-90" />
        </span>
        <div className="flex flex-1 items-center gap-2 rounded-full bg-[#2a3942] px-3 py-1.5">
          <span className="text-slate-400">
            <MoreVertical className="w-4 h-4" />
          </span>
          <span className="flex-1 text-xs text-slate-500 md:text-sm">Message</span>
          <span className="text-slate-400">
            <Paperclip className="h-5 w-5 -rotate-45" />
          </span>
          <span className="text-slate-400">
            <Camera className="h-5 w-5" />
          </span>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white">
          <Mic className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
