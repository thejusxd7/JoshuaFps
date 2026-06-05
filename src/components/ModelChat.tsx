import React, { useState, useRef, useEffect, FormEvent } from "react";
import { MessageSquare, Send, X, Bot, Sparkles, AlertCircle } from "lucide-react";
import { ChatMessage, ModelProfile } from "../types";
import { playClickSound, playChimeSound } from "../utils/audio";

interface ModelChatProps {
  profile: ModelProfile;
}

export default function ModelChat({ profile }: ModelChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: `Hello darling! I'm ${profile.name}. Welcome to my cherry-red sanctuary. Talk to me about fashion, inspiration, or whatever's on your mind today. 🌹✨`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<"none" | "no-key" | "failed">("none");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    playClickSound(profile.soundEnabled);
    setErrorStatus("none");

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Map history for the server
      const chatHistory = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.text,
          history: chatHistory,
          modelName: profile.name,
          botBio: profile.bio,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "API_KEY_MISSING") {
          setErrorStatus("no-key");
        } else {
          setErrorStatus("failed");
        }
        throw new Error(data.message || "Failed to communicate with the Model server.");
      }

      const botMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        text: data.text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      playChimeSound(profile.soundEnabled);
    } catch (err) {
      console.error(err);
      if (errorStatus === "none") {
        setErrorStatus("failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Sparkly Chat Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          playClickSound(profile.soundEnabled);
        }}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center gap-2 p-4 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/40 hover:shadow-red-600/50 hover:scale-105 transition-all duration-300 border border-red-500/30 group"
        id="open-model-chat-btn"
      >
        <MessageSquare className="w-6 h-6 animate-pulse" />
        <span className="hidden md:inline font-sans font-medium text-sm pr-1">Chat with {profile.name}</span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping pointer-events-none opacity-40" />
      </button>

      {/* Slide-out Glossy Red Chat Dashboard */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end transition-opacity duration-300">
          {/* Dismiss Back-backdrop Click */}
          <div className="flex-1" onClick={() => {
            setIsOpen(false);
            playClickSound(profile.soundEnabled);
          }} />

          {/* Chat Container */}
          <div className="w-full max-w-md h-full bg-neutral-950/90 border-l border-red-900/50 flex flex-col relative overflow-hidden backdrop-blur-md shadow-2xl">
            {/* Top Glossy Headers */}
            <div className="p-4 bg-gradient-to-r from-red-950/80 to-neutral-950 border-b border-red-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-10 h-10 rounded-full border border-red-500/40 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-neutral-950" />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-white tracking-wide text-sm">{profile.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <p className="font-mono text-[10px] uppercase tracking-widest text-red-400">Crimson Model Companion</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  playClickSound(profile.soundEnabled);
                }}
                className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-red-950 transition-colors"
                id="close-chat-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ambient Red Glow in Background */}
            <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-red-900/10 blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-red-800/10 blur-3xl pointer-events-none -z-10" />

            {/* Chat history messages list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md transition-all ${
                      msg.role === "user"
                        ? "bg-red-650 text-white rounded-tr-none border border-red-500/20"
                        : "bg-neutral-900/80 text-neutral-200 rounded-tl-none border border-red-900/30"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <time className="block text-[9px] text-neutral-400/70 text-right mt-1.5">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                </div>
              ))}

              {/* Loader response states */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-900/80 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-neutral-300 border border-red-900/30 shadow-md flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce" />
                    </span>
                    <span className="font-sans text-xs text-neutral-400">Model thinking...</span>
                  </div>
                </div>
              )}

              {/* Custom Error State (API key guidelines helper) */}
              {errorStatus !== "none" && (
                <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-3 text-xs text-red-200 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">
                        {errorStatus === "no-key" ? "Companion Key Required" : "Transmission Disrupted"}
                      </p>
                      <p className="text-red-300/80 mt-0.5">
                        {errorStatus === "no-key"
                          ? "I need a standard GEMINI_API_KEY to chat with you! Please add your Gemini key in the Settings > Secrets configuration panel."
                          : "Something went wrong sending the message. Let's try once more."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={scrollRef} />
            </div>

            {/* Footer Input Area */}
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-red-900/30 bg-neutral-950/80 backdrop-blur-md flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Tell ${profile.name} anything...`}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 focus:bg-neutral-900 text-white text-sm placeholder:text-neutral-500 border border-red-950 focus:border-red-650 focus:outline-none transition-colors duration-200"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3 rounded-xl bg-red-650 hover:bg-red-600 disabled:bg-neutral-800 disabled:text-neutral-500 text-white shadow-md shadow-red-950/40 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
                id="send-message-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
