import React, { useState, useRef, useEffect } from 'react';
import API from '../../utils/api';
import { Bot, X, Send, Sparkles, MessageCircle } from 'lucide-react';

const SUGGESTIONS = [
  '🍚 Food donations இருக்கா?',
  '👕 Clothes need பண்றோம்',
  '📚 Books கிடைக்குமா?',
  '💊 Medical supplies இருக்கா?',
];

const DonifyBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '👋 Hi! I\'m Donify Assistant.\nI can help you find donations, create requests, and more!\n\nWhat do you need today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // Stop pulse after first open
  useEffect(() => {
    if (open) setPulse(false);
  }, [open]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const { data } = await API.post('/bot/chat', { message: msg });
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: '⚠️ Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===================== FLOATING BUTTON ===================== */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-5 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 8px 32px rgba(124,58,237,0.45)' }}
        aria-label="Open Donify Assistant"
      >
        {open
          ? <X size={22} className="text-white" />
          : <MessageCircle size={22} className="text-white" />
        }

        {/* Pulse ring — first time வரும் */}
        {pulse && !open && (
          <>
            <span className="absolute inset-0 rounded-2xl animate-ping"
              style={{ background: 'rgba(124,58,237,0.4)' }} />
            {/* Tooltip */}
            <span className="absolute right-16 bottom-1 bg-[#1a1d27] text-white text-xs font-medium px-3 py-1.5 rounded-xl border border-white/10 whitespace-nowrap shadow-lg">
              💬 Any doubts? Ask me!
            </span>
          </>
        )}
      </button>

      {/* ===================== CHAT WINDOW ===================== */}
      <div className={`fixed bottom-24 right-4 z-50 w-80 rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl transition-all duration-300 origin-bottom-right ${
        open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none'
      }`}
        style={{ height: '480px', background: '#13151f' }}>

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.15))' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
            <Sparkles size={17} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm">Donify Assistant</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <p className="text-xs text-emerald-400">Online • AI-powered</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex items-end gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'bot' && (
                <div className="w-6 h-6 rounded-lg bg-violet-600/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mb-0.5">
                  <Bot size={12} className="text-violet-400" />
                </div>
              )}
              <div className={`max-w-[82%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'text-white rounded-br-sm'
                  : 'text-white/80 rounded-bl-sm border border-white/8'
              }`}
                style={m.role === 'user'
                  ? { background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }
                  : { background: 'rgba(255,255,255,0.04)' }}>
                {m.text}
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {loading && (
            <div className="flex items-end gap-2 justify-start">
              <div className="w-6 h-6 rounded-lg bg-violet-600/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                <Bot size={12} className="text-violet-400" />
              </div>
              <div className="px-3 py-3 rounded-2xl rounded-bl-sm border border-white/8"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <span className="flex gap-1.5">
                  {[0, 150, 300].map(d => (
                    <span key={d} className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${d}ms` }} />
                  ))}
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick suggestions — first message only */}
        {messages.length <= 1 && (
          <div className="px-3 pb-2 flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0">
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-violet-500/30 text-violet-400 hover:bg-violet-500/15 transition-all whitespace-nowrap active:scale-95">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-white/8 flex gap-2 flex-shrink-0">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask about donations..."
            className="flex-1 rounded-xl px-3 py-2 text-sm text-white outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          <button onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-30 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
            <Send size={15} className="text-white" />
          </button>
        </div>
      </div>
    </>
  );
};

export default DonifyBot;