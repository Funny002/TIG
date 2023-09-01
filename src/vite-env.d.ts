/// <reference types="vite/client" />

interface GameConfig {
  home: string;
  name: string;
  icon?: string;
  mkdir: string;
  version: string;
  author?: string;
  description?: string;
  file: Partial<{ update: string; description: string; }>;
}
