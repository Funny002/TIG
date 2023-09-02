/// <reference types="vite/client" />

export default {};

declare global {
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

  interface Window {
    __CONFIG__: {
      title: string;
      version: string;
    };
  }
}
