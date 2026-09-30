/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Chowra 24/7 Operations Control Tower Socket Widget
 * Architecture & Engineering: Chowra Engineering Team
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Bot, User, ShieldCheck, CheckCheck, 
  Circle, Wifi, RefreshCw, Paperclip, Minimize2, Maximize2, 
  Truck, ArrowRight, Clock, HelpCircle, PhoneCall, ChevronDown 
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  actionLink?: {
    label: string;
    sectionId: string;
  };
}

interface LiveChatWidgetProps {
  onNavigateSection?: (sectionId: string) => void;
  onTrackAwb?: (awb: string) => void;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ 
  onNavigateSection, 
  onTrackAwb 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [socketStatus, setSocketStatus] = useState<'CONNECTING' | 'CONNECTED' | 'DISCONNECTED'>('CONNECTING');
  const [socketLatency, setSocketLatency] = useState(24);
  const [showSocketDetails, setShowSocketDetails] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome-1',
      sender: 'agent',
      text: 'Namaste! Welcome to Chowra Logistics 24/7 Control Tower. I am Venu, Senior Operations & Dispatch Specialist at the Sahar Aviation Gateway. How may I assist your shipment today?',
      timestamp: 'Just now',
      status: 'read',
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAgentTyping, isOpen, isMinimized]);

  // Simulated WebSocket connection lifecycle
  useEffect(() => {
    // Initial connection simulation
    const connectTimer = setTimeout(() => {
      setSocketStatus('CONNECTED');
    }, 900);

    // Periodic ping-pong latency update
    const pingInterval = setInterval(() => {
      if (socketStatus === 'CONNECTED') {
        const jitter = Math.floor(18 + Math.random() * 14);
        setSocketLatency(jitter);
      }
    }, 6000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(pingInterval);
    };
  }, [socketStatus]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, isMinimized]);

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch {
      // AudioContext unavailable or blocked by autoplay policy
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const rawText = textToSend || inputText;
    const cleanText = rawText.trim();
    if (!cleanText || socketStatus !== 'CONNECTED') return;

    const userMsgId = `msg-usr-${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: cleanText,
      timestamp: nowTime,
      status: 'sending',
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputText('');

    // Simulate socket ACK (sent -> delivered -> read)
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsgId ? { ...m, status: 'delivered' } : m))
      );
    }, 300);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsgId ? { ...m, status: 'read' } : m))
      );
      setIsAgentTyping(true);
    }, 700);

    // Dynamic simulated customer support reply
    setTimeout(() => {
      setIsAgentTyping(false);
      generateSupportReply(cleanText);
    }, 1800 + Math.random() * 800);
  };

  const generateSupportReply = (query: string) => {
    const q = query.toLowerCase();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let replyText = '';
    let actionLink: ChatMessage['actionLink'] = undefined;

    // Check for AWB patterns (e.g., CHW-8942-IN, BK-CHW-..., or 8942)
    const awbMatch = query.match(/(CHW-\d{4}-[A-Z]{2,3}|BK-CHW-\d+|[0-9]{4,6})/i);

    if (awbMatch || q.includes('track') || q.includes('where is my') || q.includes('status')) {
      const foundAwb = awbMatch ? awbMatch[0].toUpperCase() : 'CHW-8942-IN';
      replyText = `I have queried our dispatch database for ${foundAwb}. Linehaul telemetry shows it is onboard Express Van #MH-02-CW-9921 with Driver Vikramjit Singh, arriving at the delivery hub within 35 minutes.`;
      actionLink = {
        label: `View Live Telemetry (${foundAwb})`,
        sectionId: 'tracker',
      };
      if (onTrackAwb && awbMatch) {
        onTrackAwb(foundAwb);
      }
    } else if (q.includes('pickup') || q.includes('doorstep') || q.includes('schedule') || q.includes('book')) {
      replyText = `Doorstep pickups are running on standard schedules today across all metro pincodes. Our courier vans operate with a 2-hour SLA window. Would you like to schedule your pickup slot now?`;
      actionLink = {
        label: 'Open Doorstep Booking Form',
        sectionId: 'booking',
      };
    } else if (q.includes('rate') || q.includes('cost') || q.includes('price') || q.includes('tariff') || q.includes('calculator')) {
      replyText = `Our freight and courier tariffs are calculated using standard IATA volumetric formulas ((L×W×H)/5000). Commercial air express starts at ₹180/kg, while surface cargo starts at ₹45/kg for multi-box lots.`;
      actionLink = {
        label: 'Calculate Accurate Volumetric Tariff',
        sectionId: 'calculator',
      };
    } else if (q.includes('international') || q.includes('dubai') || q.includes('customs') || q.includes('overseas') || q.includes('air cargo')) {
      replyText = `Our Middle East and global air cargo corridors (BOM-DXB, DEL-LHR, BLR-FRA) provide seamless customs clearance and e-waybill automation. We offer full aircraft charters and consolidated LD3 containers daily.`;
      actionLink = {
        label: 'Explore International Freight',
        sectionId: 'freight',
      };
    } else if (q.includes('history') || q.includes('previous') || q.includes('past booking')) {
      replyText = `You can review all your scheduled pickups, assigned driver phone numbers, and download printable electronic waybills in your Consignment Registry.`;
      actionLink = {
        label: 'Open Booking History & Registry',
        sectionId: 'history',
      };
    } else if (q.includes('contact') || q.includes('phone') || q.includes('toll free') || q.includes('call')) {
      replyText = `You can reach our 24/7 National Dispatch Hotline toll-free at +91 90000 00000 (+91 90000 00000) or email contact@chowralogistics.example.`;
      actionLink = {
        label: 'Contact Corporate Desk',
        sectionId: 'contact',
      };
    } else {
      replyText = `Thank you for sharing the details. I have logged this into our Control Tower ticket queue (Ticket #SUP-${Math.floor(1000 + Math.random() * 9000)}). Our operations team will ensure your shipment requirements are met immediately. Anything else I can assist with?`;
    }

    const agentMsg: ChatMessage = {
      id: `msg-agent-${Date.now()}`,
      sender: 'agent',
      text: replyText,
      timestamp: nowTime,
      actionLink,
    };

    setMessages((prev) => [...prev, agentMsg]);
    playChime();

    if (!isOpen) {
      setUnreadCount((c) => c + 1);
    }
  };

  const handleActionLinkClick = (sectionId: string) => {
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickPrompts = [
    'Track consignment #CHW-8942-IN',
    'Schedule urgent doorstep pickup',
    'Calculate express shipping rate',
    'International customs clearance info',
  ];

  return (
    <div className="relative flex flex-col items-end">
      
      {/* Expanded Chat Box */}
      {isOpen && (
        <div 
          className={`absolute bottom-14 right-0 w-[calc(100vw-2.5rem)] sm:w-[390px] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 z-50 animate-in fade-in slide-in-from-bottom-5 ${
            isMinimized ? 'h-16' : 'h-[520px] max-h-[75vh]'
          }`}
          style={{
            boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 191, 114, 0.15)'
          }}
        >
          {/* Header Bar */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-slate-950 text-xs shadow-md"
                  style={{ background: 'linear-gradient(135deg, #008793, #00bf72)' }}
                >
                  <Bot className="w-5 h-5 text-slate-950" />
                </div>
                <span 
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950"
                  style={{ backgroundColor: socketStatus === 'CONNECTED' ? '#00bf72' : '#f59e0b' }}
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-display font-extrabold text-white text-xs sm:text-sm">
                    Chowra Support Team
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-[#a8eb12] font-semibold border border-emerald-500/30">
                    Lead Dispatcher
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>24/7 Logistics Dispatch Desk</span>
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowSocketDetails(!showSocketDetails)}
                title="Toggle WebSocket connection telemetry"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer text-xs"
              >
                <Wifi className="w-4 h-4 text-[#00bf72]" />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Optional WebSocket Telemetry Drawer */}
          {showSocketDetails && !isMinimized && (
            <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 text-[10px] font-data text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[#a8eb12] font-semibold">wss://stream.chowralogistics.example/v2/chat</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-white">{socketLatency}ms RTT</span>
                <span className="text-emerald-400">TLS 1.3</span>
              </div>
            </div>
          )}

          {/* Main Messages Scroll Area */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-slate-900/60">
                
                {/* Security encryption banner */}
                <div className="p-2 bg-slate-950/70 border border-slate-800/80 rounded-xl text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00bf72]" />
                  <span>Real-time dispatch session secured via 256-bit SSL encryption</span>
                </div>

                {messages.map((m) => {
                  const isUser = m.sender === 'user';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1 animate-in fade-in duration-200`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed text-xs shadow-sm ${
                          isUser
                            ? 'bg-gradient-to-r from-[#008793] to-[#00bf72] text-slate-950 font-medium rounded-tr-xs'
                            : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-xs'
                        }`}
                      >
                        <p>{m.text}</p>

                        {/* Interactive In-Chat Navigation Link */}
                        {m.actionLink && (
                          <div className="mt-2.5 pt-2 border-t border-slate-800">
                            <button
                              type="button"
                              onClick={() => handleActionLinkClick(m.actionLink!.sectionId)}
                              className="w-full py-1.5 px-3 rounded-lg text-[11px] font-bold text-slate-950 flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-[1.01]"
                              style={{
                                background: 'linear-gradient(135deg, #00bf72, #a8eb12)'
                              }}
                            >
                              <span>{m.actionLink.label}</span>
                              <ArrowRight className="w-3 h-3 text-slate-950" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-data px-1">
                        <span>{m.timestamp}</span>
                        {isUser && m.status && (
                          <span>
                            {m.status === 'read' ? (
                              <CheckCheck className="w-3 h-3 text-[#a8eb12]" />
                            ) : m.status === 'delivered' ? (
                              <CheckCheck className="w-3 h-3 text-slate-400" />
                            ) : (
                              <Circle className="w-2.5 h-2.5 text-slate-500 animate-pulse" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Agent Typing Indicator */}
                {isAgentTyping && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00bf72] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00bf72] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00bf72] animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-[10px] text-slate-400 font-data ml-1">Venu is typing...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
                {quickPrompts.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(p)}
                    className="py-1 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-[#a8eb12] border border-slate-800 whitespace-nowrap cursor-pointer transition-colors shrink-0"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Message Input Footer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type AWB (e.g. CHW-8942-IN), rate inquiry, or question..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00bf72] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!inputText.trim() || socketStatus !== 'CONNECTED'}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-950 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)'
                  }}
                  title="Send message via real-time WebSocket"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Trigger Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
          }}
          className="group relative flex items-center gap-2.5 py-2.5 px-4 rounded-full text-slate-950 font-extrabold text-xs shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border-2 border-slate-950"
          style={{
            background: 'linear-gradient(135deg, #008793 0%, #00bf72 50%, #a8eb12 100%)',
            boxShadow: '0 8px 30px rgba(0, 191, 114, 0.45)'
          }}
          aria-label="Open 24/7 Live Logistics Chat Support"
        >
          {/* Animated online pulse */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-950" />
          </span>

          <MessageSquare className="w-4 h-4 text-slate-950" />
          <span className="font-bold tracking-tight">Live Support</span>

          {/* Unread badge */}
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center border-2 border-slate-950 shadow-md animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

    </div>
  );
};
