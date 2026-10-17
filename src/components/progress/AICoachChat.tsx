import React, { useState, useRef, useEffect } from 'react';
import { sendAICoachMessage } from '../../services/ai';
import { getUserProfile } from '../../db/index';
import { Bot, Send, User, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  time: string;
}

export const AICoachChat: React.FC = () => {
  const profile = getUserProfile();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'mentor',
      text: `Halo! Saya mentor kebugaran pribadi Anda. Di bobot ${profile.currentWeightKg} kg dan tinggi ${profile.heightCm} cm, fokus kita adalah membakar lemak tanpa mencederai sendi lutut. Ada yang bisa saya bantu hari ini?`,
      time: 'Baru saja',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const response = await sendAICoachMessage(text);
      const mentorMsg: ChatMessage = {
        id: `m_${Date.now()}`,
        sender: 'mentor',
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, mentorMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `e_${Date.now()}`,
        sender: 'mentor',
        text: 'Maaf, terjadi sedikit kendala. Namun yang pasti: tetap utamakan keamanan sendi dan minum air putih yang cukup!',
        time: 'Baru saja',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const quickQuestions = [
    'Lutut terasa agak pegal, ganti gerakan apa?',
    'Berapa target kalori defisit harian saya?',
    'Apakah jalan cepat cukup untuk bakar lemak?',
    'Cara push up aman tanpa membebani bahu?',
  ];

  return (
    <div className="w-full bg-[#121214] border border-[#27272A] rounded-2xl shadow-xl flex flex-col h-[480px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#27272A] bg-[#121214]/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#18181B] border border-zinc-700 flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-1.5">
              <span>AI Coach & Mentor</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                {profile.geminiApiKey ? 'Gemini AI Aktif' : 'Smart Offline'}
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">Konsultasi Latihan & Nutrisi</p>
          </div>
        </div>

        {!profile.geminiApiKey && (
          <div
            title="Tambahkan Gemini API Key di Pengaturan untuk model AI cloud penuh"
            className="text-zinc-500 hover:text-white cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-white text-black font-black'
                  : 'bg-[#18181B] border border-zinc-700 text-white'
              }`}
            >
              {msg.sender === 'user' ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5 text-white" />
              )}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 ${
                msg.sender === 'user'
                  ? 'bg-white text-black rounded-tr-none font-medium shadow-sm'
                  : 'bg-[#09090B] border border-[#27272A] text-zinc-200 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <div
                className={`text-[9px] text-right ${
                  msg.sender === 'user' ? 'text-black/60 font-mono' : 'text-zinc-500 font-mono'
                }`}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs pl-9">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>Mentor sedang menganalisis saran terbaik...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions Chips */}
      <div className="px-3 py-2 bg-[#09090B]/60 border-t border-[#27272A] flex gap-1.5 overflow-x-auto no-scrollbar">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-[#18181B] hover:bg-zinc-800 text-[11px] text-zinc-300 font-medium border border-zinc-700 transition cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 bg-[#09090B] border-t border-[#27272A] flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Tanya saran lutut, latihan, atau makanan..."
          className="flex-1 px-4 py-2.5 bg-[#121214] border border-[#27272A] rounded-xl text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-white font-sans"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isThinking}
          className="p-2.5 btn-rally-primary text-black disabled:opacity-50 rounded-xl transition cursor-pointer"
        >
          <Send className="w-4 h-4 fill-black text-black" />
        </button>
      </div>
    </div>
  );
};
