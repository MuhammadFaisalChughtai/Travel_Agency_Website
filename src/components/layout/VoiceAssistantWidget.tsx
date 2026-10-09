"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  MessageCircle,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  Plane,
  RotateCcw,
} from "lucide-react";

interface FeaturedItem {
  title: string;
  subtitle: string;
  url: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  featuredItems?: FeaturedItem[];
  suggestedAction?: { type: string; url?: string; label?: string } | null;
}

export function VoiceAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm Sara, your Terrific Travel assistant. Tap the mic and ask me about flight deals, Umrah packages, holidays, or visa requirements!",
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setSpeechSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-GB";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn("[Voice Recognition Error]:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Automatically submit final captured speech if available
        setTranscript((prev) => {
          if (prev.trim()) {
            handleSend(prev.trim());
          }
          return "";
        });
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    if (isOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isListening, isLoading]);

  // Speech Synthesis helper
  const speakResponse = (text: string) => {
    if (!soundEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop prior speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-GB";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select a natural British English voice if available
      const voices = window.speechSynthesis.getVoices();
      const britishVoice = voices.find(
        (v) =>
          (v.lang === "en-GB" || v.lang.includes("GB")) &&
          (v.name.includes("Female") || v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Serena"))
      ) || voices.find((v) => v.lang === "en-GB") || voices.find((v) => v.lang.startsWith("en"));

      if (britishVoice) {
        utterance.voice = britishVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("[Speech Synthesis Error]:", err);
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (isSpeaking) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }

    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Recognition start error:", e);
      }
    }
  };

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    // Add user message to UI
    const updatedHistory: ChatMessage[] = [
      ...messages,
      { role: "user", content: userText },
    ];
    setMessages(updatedHistory);
    setIsLoading(true);

    try {
      const res = await fetch("/api/voice-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(-4).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (data.reply) {
        const assistantMsg: ChatMessage = {
          role: "assistant",
          content: data.reply,
          featuredItems: data.featuredItems || [],
          suggestedAction: data.suggestedAction || null,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        speakResponse(data.reply);
      } else {
        throw new Error(data.error || "No reply returned.");
      }
    } catch (err: any) {
      console.error("[Voice Assistant Chat Error]:", err);
      const errorMsg: ChatMessage = {
        role: "assistant",
        content:
          "I apologize, I'm having trouble connecting right now. Please call us at 01215 291630 or message us on WhatsApp at 07888 461474!",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Positioned cleanly on bottom right) */}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-2">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Terrific Travel AI Voice Assistant"
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#6b4f4f] hover:bg-[#483434] text-[#fff3e4] rounded-full shadow-2xl hover:shadow-[#6b4f4f]/50 border border-[#eed6c4]/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {/* Glowing Pulse Orb */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#eed6c4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#eed6c4]"></span>
            </span>

            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm tracking-wide font-heading">
              <Mic className="w-4 h-4 text-[#eed6c4] group-hover:scale-110 transition-transform" />
              <span>Ask AI Voice</span>
            </div>

            {/* Quick badge */}
            <span className="bg-[#eed6c4]/20 text-[#eed6c4] text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-md">
              Terrific Travel
            </span>
          </button>
        )}
      </div>

      {/* Slide-over Voice Assistant Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[1000] w-[calc(100vw-32px)] sm:w-[380px] max-w-[420px] h-[550px] max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#eed6c4]/60 flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6b4f4f] via-[#543b3b] to-[#382626] text-[#fff3e4] p-4 flex items-center justify-between border-b border-[#eed6c4]/20 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#eed6c4]/20 border border-[#eed6c4]/40 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4 text-[#eed6c4]" />
                </div>
                {isSpeaking && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-heading font-black text-sm text-[#fff3e4]">
                    Sara • Travel Voice AI
                  </h4>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-bold">
                    Terrific Only
                  </span>
                </div>
                <p className="text-[11px] text-[#eed6c4]/80">
                  {isSpeaking
                    ? "Speaking response..."
                    : isListening
                    ? "Listening to you..."
                    : "Terrific Travel Specialist"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  if (soundEnabled && typeof window !== "undefined") {
                    window.speechSynthesis?.cancel();
                    setIsSpeaking(false);
                  }
                }}
                title={soundEnabled ? "Mute Voice Audio" : "Unmute Voice Audio"}
                className="p-1.5 text-[#eed6c4]/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4 text-red-300" />
                )}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (typeof window !== "undefined") {
                    window.speechSynthesis?.cancel();
                    setIsSpeaking(false);
                  }
                  if (isListening && recognitionRef.current) {
                    recognitionRef.current.stop();
                  }
                }}
                className="p-1.5 text-[#eed6c4]/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Contact Bar */}
          <div className="bg-[#f5f0eb] px-4 py-2 border-b border-slate-200/60 flex items-center justify-between text-[11px] text-slate-700">
            <span className="font-semibold text-slate-500">Fast Contact Desk:</span>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/447888461474?text=Hello%20Terrific%20Travel%2C%20I%20am%20chatting%20with%20your%20AI%20and%20would%20like%20to%20speak%20to%20an%20agent."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                <MessageCircle className="w-3 h-3 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
              <a
                href="tel:01215291630"
                className="flex items-center gap-1 font-bold text-[#6b4f4f] hover:text-[#483434] transition-colors"
              >
                <PhoneCall className="w-3 h-3" />
                <span>01215 291630</span>
              </a>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                    msg.role === "user"
                      ? "bg-[#6b4f4f] text-[#fff3e4] rounded-br-xs font-medium"
                      : "bg-[#f5f0eb] text-slate-800 rounded-bl-xs border border-slate-200/80 leading-relaxed shadow-xs"
                  }`}
                >
                  <p>{msg.content}</p>
                </div>

                {/* Featured Products / Quick Link Cards */}
                {msg.featuredItems && msg.featuredItems.length > 0 && (
                  <div className="mt-2 w-full max-w-[90%] space-y-1.5 pl-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Recommended Deals:
                    </span>
                    {msg.featuredItems.map((item, i) => (
                      <Link
                        key={i}
                        href={item.url}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#eed6c4] hover:border-[#6b4f4f] hover:shadow-md transition-all group"
                      >
                        <div className="truncate pr-2">
                          <p className="font-bold text-slate-800 truncate text-[11px] group-hover:text-[#6b4f4f]">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {item.subtitle}
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#6b4f4f] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Suggested Action Button */}
                {msg.suggestedAction?.url && (
                  <Link
                    href={msg.suggestedAction.url}
                    onClick={() => setIsOpen(false)}
                    className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#6b4f4f] bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs hover:bg-[#f5f0eb] transition-colors"
                  >
                    <span>{msg.suggestedAction.label || "View Options"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}

            {/* Live User Voice Transcript while speaking */}
            {isListening && transcript && (
              <div className="flex justify-end">
                <div className="bg-[#6b4f4f]/80 text-[#fff3e4] rounded-2xl rounded-br-xs px-3 py-2 text-xs italic animate-pulse">
                  "{transcript}"
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs pl-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#6b4f4f] animate-ping" />
                <span>Checking Terrific Travel database...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Voice Interaction Bottom Console */}
          <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2">
            {/* Visual Waveform / Mic Bar */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleListening}
                disabled={isLoading}
                aria-label={isListening ? "Stop listening" : "Start speaking"}
                className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-md ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600 text-white scale-110 shadow-red-500/40 ring-4 ring-red-200 animate-pulse"
                    : isSpeaking
                    ? "bg-emerald-600 text-white"
                    : "bg-[#6b4f4f] hover:bg-[#382626] text-[#fff3e4] hover:scale-105"
                }`}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5 text-[#eed6c4]" />
                )}
              </button>

              {/* Status / Instructions */}
              <div className="flex-1 leading-tight">
                {isListening ? (
                  <div>
                    <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-ping inline-block" />
                      Listening to your query...
                    </span>
                    <p className="text-[10px] text-slate-400">
                      Tap the red mic when finished speaking
                    </p>
                  </div>
                ) : isSpeaking ? (
                  <div>
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                      Sara is speaking...
                    </span>
                    <p className="text-[10px] text-slate-400">
                      Tap mic to interrupt or speak again
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-bold text-slate-700">
                      Tap microphone to speak
                    </span>
                    <p className="text-[10px] text-slate-400">
                      Ask about flights, Umrah, holidays, or visas
                    </p>
                  </div>
                )}
              </div>

              {/* Reset History button */}
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.speechSynthesis?.cancel();
                    setIsSpeaking(false);
                  }
                  setMessages([
                    {
                      role: "assistant",
                      content:
                        "Chat reset! What destination or package can I help you find today?",
                    },
                  ]);
                }}
                title="Reset conversation"
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="flex gap-1.5 overflow-x-auto pt-1 pb-0.5 no-scrollbar text-[10px]">
              <button
                type="button"
                onClick={() => handleSend("Do you have cheap flights to Jeddah?")}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#f5f0eb] hover:bg-[#eed6c4]/40 text-slate-700 font-semibold border border-slate-200 transition-colors"
              >
                ✈️ Flights to Jeddah
              </button>
              <button
                type="button"
                onClick={() => handleSend("Show me 5 star Umrah packages for 2 people")}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#f5f0eb] hover:bg-[#eed6c4]/40 text-slate-700 font-semibold border border-slate-200 transition-colors"
              >
                🕋 5-Star Umrah
              </button>
              <button
                type="button"
                onClick={() => handleSend("What holiday deals do you have for Dubai?")}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#f5f0eb] hover:bg-[#eed6c4]/40 text-slate-700 font-semibold border border-slate-200 transition-colors"
              >
                🏖️ Dubai Holidays
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
