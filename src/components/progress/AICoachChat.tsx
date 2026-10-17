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
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex flex-col h-[480px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-strava-orange to-amber-500 flex items-center justify-center text-white shadow-md shadow-strava-orange/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-1.5">
              <span>AI Coach & Mentor</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                {profile.geminiApiKey ? 'Gemini AI Aktif' : 'Smart Offline'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Konsultasi Latihan & Nutrisi</p>
          </div>
        </div>

        {!profile.geminiApiKey && (
          <div
            title="Tambahkan Gemini API Key di Pengaturan untuk model AI cloud penuh"
            className="text-slate-500 hover:text-amber-400 cursor-pointer"
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
                  ? 'bg-strava-orange text-white'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {msg.sender === 'user' ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5 text-strava-orange" />
              )}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 ${
                msg.sender === 'user'
                  ? 'bg-strava-orange text-white rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <div
                className={`text-[9px] text-right ${
                  msg.sender === 'user' ? 'text-white/70' : 'text-slate-500'
                }`}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
            <span className="w-2 h-2 rounded-full bg-strava-orange animate-ping" />
            <span>Mentor sedang menganalisis saran terbaik...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions Chips */}
      <div className="px-3 py-2 bg-slate-950/40 border-t border-slate-800/80 flex gap-1.5 overflow-x-auto no-scrollbar">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-[11px] text-slate-300 font-medium border border-slate-700/50 transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Tanya saran lutut, latihan, atau makanan..."
          className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-strava-orange"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isThinking}
          className="p-2.5 bg-strava-orange hover:bg-strava-hover disabled:opacity-50 text-white rounded-xl shadow-md transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
