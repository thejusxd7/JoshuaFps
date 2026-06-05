export interface LinkItem {
  id: string;
  label: string;
  icon: string; // lucide icon name
  url: string;
  colorClass: string;
  clicks: number;
  isActive: boolean;
}

export type ThemeStyle = "glowing-crimson" | "dark-velvet" | "shiny-cherry" | "liquid-ruby";

export interface ModelProfile {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  theme: ThemeStyle;
  soundEnabled: boolean;
  ambientSoundEnabled: boolean;
  instagram: string;
  discord: string;
  whatsapp: string;
  youtube: string;
  donation: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}
