import { UserCircle, Reply, Forward, MoreVertical, Star, CornerUpLeft } from 'lucide-react';

interface EmailMockupProps {
  senderName: string;
  senderAddress?: string;
  subject?: string;
  content: string;
  date?: string;
}

export function EmailMockup({ 
  senderName, 
  senderAddress = 'unknown@example.com', 
  subject = '(no subject)', 
  content,
  date 
}: EmailMockupProps) {
  
  const displayDate = date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#1a1a24] rounded-xl overflow-hidden border border-slate-700 shadow-2xl font-sans text-slate-200">
      
      {/* Email Client Header */}
      <div className="border-b border-slate-700 p-4 bg-[#232332]">
        <h2 className="text-xl font-normal text-white">{subject}</h2>
      </div>

      {/* Email Metadata */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex gap-3">
          <UserCircle className="w-10 h-10 text-slate-400" />
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-[15px]">{senderName}</span>
              <span className="text-xs text-slate-400">&lt;{senderAddress}&gt;</span>
            </div>
            <span className="text-xs text-slate-500">to me</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span className="text-xs">{displayDate}</span>
          <Star className="w-4 h-4 cursor-pointer hover:text-yellow-400 transition-colors" />
          <CornerUpLeft className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
          <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      {/* Email Body */}
      <div className="p-6 pt-2 text-[14px] leading-relaxed">
        <div className="whitespace-pre-wrap font-sans text-slate-300">
          {content}
        </div>
      </div>

      {/* Email Footer Actions */}
      <div className="p-4 border-t border-slate-800 flex gap-2">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-600 rounded-full hover:bg-slate-700 transition-colors">
          <Reply className="w-4 h-4" /> Reply
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-600 rounded-full hover:bg-slate-700 transition-colors">
          <Forward className="w-4 h-4" /> Forward
        </button>
      </div>
    </div>
  );
}
