import { useState } from "react";
import { Sliders, X, Sparkles, Volume2, VolumeX, RefreshCw, Instagram, Gamepad2, Phone, Youtube, HeartHandshake, Eye, AlignLeft, User, MessageCircle } from "lucide-react";
import { ModelProfile, ThemeStyle } from "../types";
import { playClickSound, playChimeSound } from "../utils/audio";

interface DashboardEditorProps {
  profile: ModelProfile;
  onChange: (updated: ModelProfile) => void;
  onReset: () => void;
}

export default function DashboardEditor({ profile, onChange, onReset }: DashboardEditorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Maintain local form state to let user customize before applying
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [theme, setTheme] = useState<ThemeStyle>(profile.theme);
  const [soundEnabled, setSoundEnabled] = useState(profile.soundEnabled);
  const [ambientSoundEnabled, setAmbientSoundEnabled] = useState(profile.ambientSoundEnabled);
  const [instagram, setInstagram] = useState(profile.instagram);
  const [discord, setDiscord] = useState(profile.discord);
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp);
  const [youtube, setYoutube] = useState(profile.youtube);
  const [donation, setDonation] = useState(profile.donation);

  const themeOptions: { value: ThemeStyle; label: string; desc: string }[] = [
    { value: "glowing-crimson", label: "Glowing Crimson", desc: "Velvet red borders and radiant shadows" },
    { value: "dark-velvet", label: "Dark Velvet", desc: "Very elegant deep burgundy shades and minimal white text" },
    { value: "shiny-cherry", label: "Shiny Cherry", desc: "Glossy glassmorphic reflections with high chrome highlights" },
    { value: "liquid-ruby", label: "Liquid Ruby", desc: "Pulsating translucent fluid backdrops and active neon effects" },
  ];

  const presetAvatars = [
    { name: "Default (Stunning Crimson AI)", url: profile.avatarUrl }, // Keep current
    { name: "Alternative Elegant (Scarlet Luxe)", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400" },
    { name: "Aesthetic Crimson Render", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400" },
  ];

  const handleSave = () => {
    const updatedProfile: ModelProfile = {
      name,
      title,
      bio,
      avatarUrl,
      theme,
      soundEnabled,
      ambientSoundEnabled,
      instagram,
      discord,
      whatsapp,
      youtube,
      donation,
    };
    onChange(updatedProfile);
    playChimeSound(soundEnabled);
    setIsOpen(false);
  };

  const handleResetClick = () => {
    onReset();
    playChimeSound(profile.soundEnabled);
    setIsOpen(false);
    // Sync states back
    setTimeout(() => {
      window.location.reload(); // Quick refresh to reset form states perfectly
    }, 150);
  };

  return (
    <>
      {/* Editor Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          playClickSound(profile.soundEnabled);
        }}
        className="fixed top-4 right-4 z-40 p-2.5 rounded-xl bg-neutral-900/80 hover:bg-red-950/40 text-neutral-400 hover:text-red-500 border border-neutral-800/85 hover:border-red-900/50 backdrop-blur-md shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
        id="open-editor-btn"
      >
        <Sliders className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300 text-red-500" />
        <span className="text-xs font-mono tracking-wider font-semibold uppercase">Customize Profile</span>
      </button>

      {/* Editor Drawer Modal Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-start p-4 overflow-y-auto">
          {/* Main Panel Content Card */}
          <div className="w-full max-w-lg bg-neutral-950 border border-red-900/40 rounded-3xl p-6 md:p-8 flex flex-col gap-6 relative shadow-2xl glass-reflection">
            
            {/* Header section with Close */}
            <div className="flex items-center justify-between border-b border-red-950/60 pb-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-red-500 animate-pulse" />
                <div>
                  <h2 className="font-sans font-bold text-white text-lg tracking-tight">Showcase Customizer</h2>
                  <p className="font-mono text-[10px] uppercase text-neutral-500 tracking-wider">Dynamic Shiny Red Layout</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  playClickSound(profile.soundEnabled);
                }}
                className="p-1.5 rounded-xl bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-red-900/50 transition-all duration-200"
                id="close-editor-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customizer form inputs body */}
            <div className="flex-1 space-y-6 overflow-y-auto pr-2 max-h-[65vh]">
              
              {/* Section 1: Model Personality Profile Info */}
              <div className="space-y-4">
                <h3 className="font-mono text-[11px] uppercase text-red-500 font-bold tracking-widest border-b border-red-950/30 pb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-red-500" /> Model Profile Identity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-sans text-[11px] text-neutral-400 font-medium">Model Persona Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-red-750 focus:outline-none text-white text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-sans text-[11px] text-neutral-400 font-medium">Subtitle / Occupation</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-red-750 focus:outline-none text-white text-sm"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-sans text-[11px] text-neutral-400 font-medium flex items-center gap-1">
                    <AlignLeft className="w-3 h-3 text-neutral-400" /> Model Bio Biography
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-red-750 focus:outline-none text-white text-sm resize-none"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                
                {/* Custom Avatar PRESENTS or input url */}
                <div className="space-y-2">
                  <label className="font-sans text-[11px] text-neutral-400 font-medium">Profile Avatar Image</label>
                  <div className="grid grid-cols-3 gap-2">
                    {presetAvatars.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAvatarUrl(av.url);
                          playClickSound(soundEnabled);
                        }}
                        className={`p-1.5 rounded-xl border text-[10px] text-left truncate flex flex-col items-center gap-1.5 transition-all ${
                          avatarUrl === av.url
                            ? "bg-red-950/30 border-red-500 text-white"
                            : "bg-neutral-900 border-neutral-850 hover:border-red-900/50 text-neutral-400"
                        }`}
                      >
                        <img
                          src={av.url}
                          alt={av.name}
                          className="w-10 h-10 rounded-full object-cover border border-neutral-800"
                          referrerPolicy="no-referrer"
                        />
                        <span className="max-w-full truncate text-[9px] text-center">{idx === 0 ? "Crimson Render" : `Preset ${idx}`}</span>
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1 mt-2">
                    <span className="text-[10px] text-neutral-500">Or enter custom Image URL:</span>
                    <input
                      type="text"
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 focus:border-red-750 focus:outline-none text-white text-xs"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Glow Themes & Sound Options */}
              <div className="space-y-4">
                <h3 className="font-mono text-[11px] uppercase text-red-500 font-bold tracking-widest border-b border-red-950/30 pb-1.5 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-red-500" /> Crimson Theme & Feedback
                </h3>
                
                {/* Themes list Selection grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setTheme(opt.value);
                        playClickSound(soundEnabled);
                      }}
                      className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        theme === opt.value
                          ? "bg-gradient-to-br from-red-950/40 to-neutral-900 border-red-500 text-white shadow-md shadow-red-950/10"
                          : "bg-neutral-900 border-neutral-800 hover:border-red-950 hover:bg-neutral-900/70 text-neutral-300"
                      }`}
                    >
                      <span className="font-sans font-bold text-xs">{opt.label}</span>
                      <span className="text-[10px] text-neutral-400">{opt.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Sounds and FX toggles */}
                <div className="bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-850/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-sans font-semibold text-xs text-white">Synthesized UI Sounds</h4>
                      <p className="text-[10px] text-neutral-450 mt-0.5">Tactile frequencies upon hover and interaction</p>
                    </div>
                    <button
                      onClick={() => {
                        setSoundEnabled(!soundEnabled);
                        playClickSound(!soundEnabled);
                      }}
                      className={`p-2 rounded-xl border transition-colors ${
                        soundEnabled
                          ? "bg-red-900/20 border-red-650 text-red-400 hover:bg-red-900/30"
                          : "bg-neutral-950 border-neutral-800 text-neutral-500 hover:bg-neutral-900"
                      }`}
                      id="sound-fx-toggle"
                    >
                      {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-red-950/30">
                    <div>
                      <h4 className="font-sans font-semibold text-xs text-white">Synthesized Backing Drone</h4>
                      <p className="text-[10px] text-neutral-450 mt-0.5">Warm low frequency continuous red synthesizer pad</p>
                    </div>
                    <button
                      onClick={() => {
                        setAmbientSoundEnabled(!ambientSoundEnabled);
                        playClickSound(soundEnabled);
                      }}
                      className={`p-2 rounded-xl border transition-colors ${
                        ambientSoundEnabled
                          ? "bg-red-900/20 border-red-650 text-red-400 hover:bg-red-900/30"
                          : "bg-neutral-950 border-neutral-800 text-neutral-500 hover:bg-neutral-900"
                      }`}
                      id="ambient-sound-toggle"
                    >
                      {ambientSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 3: Social showcase links customization */}
              <div className="space-y-4">
                <h3 className="font-mono text-[11px] uppercase text-red-500 font-bold tracking-widest border-b border-red-950/30 pb-1.5 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-red-500" /> Link Destinations
                </h3>
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2 bg-neutral-900/40 p-1.5 rounded-xl border border-neutral-800/60 focus-within:border-red-950">
                    <div className="p-2 rounded-lg bg-pink-900/20 text-pink-500">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[9px] text-neutral-500 uppercase tracking-widest font-mono">Instagram Link</label>
                      <input
                        type="url"
                        className="w-full bg-transparent focus:outline-none text-xs text-white placeholder:text-neutral-650 mt-0.5"
                        placeholder="https://instagram.com/..."
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-neutral-900/40 p-1.5 rounded-xl border border-neutral-800/60 focus-within:border-red-950">
                    <div className="p-2 rounded-lg bg-indigo-900/20 text-indigo-400">
                      <Gamepad2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[9px] text-neutral-500 uppercase tracking-widest font-mono">Discord Link</label>
                      <input
                        type="url"
                        className="w-full bg-transparent focus:outline-none text-xs text-white placeholder:text-neutral-650 mt-0.5"
                        placeholder="https://discord.gg/..."
                        value={discord}
                        onChange={(e) => setDiscord(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-neutral-900/40 p-1.5 rounded-xl border border-neutral-800/60 focus-within:border-red-950">
                    <div className="p-2 rounded-lg bg-emerald-900/20 text-emerald-450">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[9px] text-neutral-500 uppercase tracking-widest font-mono">WhatsApp Link</label>
                      <input
                        type="url"
                        className="w-full bg-transparent focus:outline-none text-xs text-white placeholder:text-neutral-650 mt-0.5"
                        placeholder="https://whatsapp.com/..."
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-neutral-900/40 p-1.5 rounded-xl border border-neutral-800/60 focus-within:border-red-950">
                    <div className="p-2 rounded-lg bg-red-900/20 text-red-500">
                      <Youtube className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[9px] text-neutral-500 uppercase tracking-widest font-mono">YouTube Link</label>
                      <input
                        type="url"
                        className="w-full bg-transparent focus:outline-none text-xs text-white placeholder:text-neutral-650 mt-0.5"
                        placeholder="https://youtube.com/..."
                        value={youtube}
                        onChange={(e) => setYoutube(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-neutral-900/40 p-1.5 rounded-xl border border-neutral-800/60 focus-within:border-red-950">
                    <div className="p-2 rounded-lg bg-amber-900/20 text-amber-500">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[9px] text-neutral-500 uppercase tracking-widest font-mono">Donation Link (PayPal, Ko-Fi, etc.)</label>
                      <input
                        type="url"
                        className="w-full bg-transparent focus:outline-none text-xs text-white placeholder:text-neutral-650 mt-0.5"
                        placeholder="https://ko-fi.com/..."
                        value={donation}
                        onChange={(e) => setDonation(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions footer buttons */}
            <div className="border-t border-red-950 pb-1 pt-4 flex gap-3 mt-auto">
              <button
                type="button"
                onClick={handleResetClick}
                className="px-3.5 py-2.5 rounded-xl border border-neutral-800 hover:border-red-950 text-neutral-400 hover:text-red-400 bg-neutral-950 text-xs font-mono tracking-wider flex items-center justify-center gap-1.5"
                id="reset-editor-btn"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Revert Presets
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-650 hover:bg-red-600 text-white text-xs font-semibold tracking-wide shadow-md shadow-red-950 hover:scale-103 active:scale-97 transition-all duration-200"
                id="save-editor-btn"
              >
                Apply Customizations
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
