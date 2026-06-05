import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Instagram, 
  Phone, 
  Gamepad2, 
  Youtube, 
  HeartHandshake, 
  Flame, 
  Share2, 
  Check, 
  ExternalLink,
  Volume2,
  VolumeX,
  CreditCard,
  Copy
} from "lucide-react";
import { ModelProfile, LinkItem, ThemeStyle } from "./types";
import { playClickSound, playHoverSound, playChimeSound } from "./utils/audio";
import RedParticles from "./components/RedParticles";

const DEFAULT_PROFILE: ModelProfile = {
  name: "Joshua FPS",
  title: "Kami ✞",
  bio: "Kami ✞",
  avatarUrl: "https://i.imgur.com/hZqI9lA.jpeg",
  theme: "shiny-cherry",
  soundEnabled: true,
  ambientSoundEnabled: false,
  instagram: "https://www.instagram.com/joshuafps",
  discord: "https://discord.gg/NdKuWNQEYq",
  whatsapp: "https://chat.whatsapp.com/LHD8fxZ0hWHHNczacsyhuk",
  youtube: "https://youtube.com/@mrzjoshua",
  donation: "www.joshuasibu123@okaxis", // UPI ID
};

export default function App() {
  const [profile, setProfile] = useState<ModelProfile>(DEFAULT_PROFILE);
  const [copied, setCopied] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      console.warn("navigator.clipboard failed, attempting fallback:", err);
    }

    // Try fallback legacy standard mechanism
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error("Fallback clipboard copy failed:", err);
      return false;
    }
  };

  const handleLinkClick = (id: string, url: string) => {
    playClickSound(profile.soundEnabled);
    // Smoothly opens link in new tab safe from frame blocks
    window.open(url, "_blank", "noreferrer");
  };

  const handleShare = async () => {
    playChimeSound(profile.soundEnabled);
    const success = await copyToClipboard(window.location.href);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDirectUpiPayment = async () => {
    playChimeSound(profile.soundEnabled);
    const upiUri = `upi://pay?pa=${profile.donation}&pn=Joshua%2520FPS&cu=INR`;
    
    // Attempt deep link redirect for compatible payment apps on mobiles
    try {
      window.location.href = upiUri;
    } catch (e) {
      console.warn("Direct deep-linking is not supported on this platform", e);
    }
    
    // Also copy to clipboard for absolute convenience on desktops or non-compatible environments
    const success = await copyToClipboard(profile.donation);
    if (success) {
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 3000);
    }
  };

  // Compile active showcase links list
  const links = [
    {
      id: "instagram",
      label: "Instagram Profile",
      icon: "Instagram",
      url: profile.instagram,
      colorClass: "from-rose-600 to-pink-600 hover:shadow-rose-600/35",
      subtitle: "@joshuafps",
    },
    {
      id: "discord",
      label: "Discord Community",
      icon: "Gamepad2",
      url: profile.discord,
      colorClass: "from-indigo-600 to-violet-600 hover:shadow-indigo-600/35",
      subtitle: "Join the Server",
    },
    {
      id: "whatsapp",
      label: "WhatsApp Family",
      icon: "Phone",
      url: profile.whatsapp,
      colorClass: "from-emerald-600 to-teal-600 hover:shadow-emerald-600/35",
      subtitle: "Join Chat Group",
    },
    {
      id: "youtube",
      label: "Official YouTube Channel",
      icon: "Youtube",
      url: profile.youtube,
      colorClass: "from-red-650 to-red-500 hover:shadow-red-600/35",
      subtitle: "@mrzjoshua",
    },
  ];

  // Render icons dynamically from Lucide library safely
  const renderIcon = (name: string) => {
    switch (name) {
      case "Instagram":
        return <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />;
      case "Gamepad2":
        return <Gamepad2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />;
      case "Phone":
        return <Phone className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />;
      case "Youtube":
        return <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />;
      default:
        return <Flame className="w-5 h-5" />;
    }
  };

  // Ensure current theme styling classes are strictly implemented
  const themeStyle = {
    card: "glass-card shadow-2xl rounded-[40px] p-8 animate-fade-in",
    textHeader: "text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-white hover:brightness-110 transition-all font-extrabold drop-shadow-[0_0_12px_rgba(239,68,68,0.25)]",
    btn: "link-button text-white",
  };

  return (
    <div className="relative w-full min-h-screen text-white flex flex-col items-center justify-center p-4 md:p-8 select-none overflow-hidden font-sans shiny-red-bg">
      
      {/* Dynamic Crimson Particles backdrop */}
      <RedParticles />

      {/* Extreme smooth visual lighting blobs in background */}
      <div className="absolute top-20 left-40 w-64 h-64 bg-red-900/15 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-40 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />



      {/* Core links container dashboard */}
      <div className="w-full max-w-xl z-20 my-10 relative animate-float">
        <AnimatePresence mode="wait">
          <motion.div
            key={profile.name}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.8, cubicBezier: [0.175, 0.885, 0.32, 1.275] }}
            className={`w-full rounded-[40px] p-6 md:p-10 ${themeStyle.card} relative flex flex-col items-center`}
          >

            {/* Quick Share Link Trigger */}
            <button
              onClick={handleShare}
              className="absolute top-6 right-6 p-2 rounded-xl bg-neutral-900/60 hover:bg-red-950/30 text-neutral-400 hover:text-red-400 border border-neutral-800 hover:border-red-900/40 transition-colors duration-200"
              title="Copy link to clipboard"
              id="share-profile-btn"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Avatar block with shiny 3D glossy ring */}
            <div className="relative mb-6 animate-float-subtle">
              <div className="absolute -inset-1 rounded-full bg-red-600 blur opacity-40 animate-pulse"></div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-24 h-24 rounded-full bg-neutral-850 p-1 border-2 border-red-500 overflow-hidden relative z-10 shadow-lg shadow-red-900/30"
              >
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Quick fallback in case of direct link blocks
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400";
                  }}
                />
              </motion.div>
            </div>

            {/* Title / Header block */}
            <h1 className={`font-sans font-bold text-3xl text-center tracking-tight mb-1 ${themeStyle.textHeader}`}>
              {profile.name}
            </h1>
            
            <p className="font-sans text-red-400/80 text-sm font-medium mb-8 text-center px-4 leading-relaxed italic">
              {profile.title}
            </p>

            {/* Links Section */}
            <div className="w-full space-y-4 mb-6">
              {links.map((link, index) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onClick={() => handleLinkClick(link.id, link.url)}
                  onMouseEnter={() => playHoverSound(profile.soundEnabled)}
                  className={`w-full py-4 px-6 rounded-2xl ${themeStyle.btn} flex items-center justify-between text-left transition-all duration-300 group hover:-translate-y-0.5 cursor-pointer`}
                  id={`link-node-${link.id}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-xl bg-black/20 text-white flex items-center justify-center">
                      {renderIcon(link.icon)}
                    </div>
                    <div>
                      <span className="font-sans font-bold text-sm text-white block">
                        {link.label}
                      </span>
                      <span className="block text-[10px] text-red-200/60 font-mono tracking-wide mt-0.5 max-w-[200px] md:max-w-xs truncate">
                        {link.subtitle}
                      </span>
                    </div>
                  </div>

                  <span className="opacity-50 group-hover:opacity-100 transition-opacity duration-300 font-semibold text-lg">→</span>
                </motion.button>
              ))}

              {/* Directly Payout UPI Button Highlight */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.1, duration: 0.5 }}
                onClick={handleDirectUpiPayment}
                onMouseEnter={() => playHoverSound(profile.soundEnabled)}
                className="w-full py-5 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-750 text-white border border-red-400/30 hover:border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.45)] hover:shadow-[0_0_35px_rgba(239,68,68,0.6)] flex items-center justify-between text-left transition-all duration-300 hover:scale-[1.02] cursor-pointer group relative overflow-hidden"
                id="direct-upi-btn"
              >
                {/* Shiny white dynamic scanline sheen trigger */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[wiggle_1.5s_ease-in-out_infinite]" style={{ animation: "reflection 3s infinite" }} />
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-2.5 rounded-xl bg-white/10 text-white flex items-center justify-center animate-pulse">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-sans font-extrabold text-sm md:text-md uppercase tracking-wider text-white block">
                      Donate Directly (UPI Payout)
                    </span>
                    <span className="block text-[10px] text-rose-100/80 font-mono tracking-wide mt-0.5">
                      {upiCopied ? "✓ UPI ID Copied to Clipboard!" : `UPI ID: ${profile.donation}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 relative z-10">
                  <span className="text-[9px] uppercase font-bold px-2 py-1 rounded bg-black/30 border border-white/20">
                    INSTANT
                  </span>
                  <ExternalLink className="w-4 h-4 text-white group-hover:scale-110 transition-transform shrink-0" />
                </div>
              </motion.button>
            </div>

            {/* Footer with custom decorative dots */}
            <div className="mt-8 flex flex-col items-center opacity-40">
              <div className="flex space-x-4 mb-3">
                 <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></div>
                 <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                 <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold font-mono">
                © {new Date().getFullYear()} {profile.name} • All Rights Reserved
              </p>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
