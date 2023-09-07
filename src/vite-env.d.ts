/// <reference types="vite/client" />

export default {};

declare global {
  import { App } from 'vue';

  interface GameConfig {
    name: string;
    author: string;
    version: string;
    description: string;
    //
    main: string;
    logo: string;
    markdown: {
      main: string;
      mkdir: string;
    },
  }

  interface GameModule {
    config: {
      logo: string;
      name: string;
      author: string;
      version: string;
      markdown: string;
      description: string;
    };
    modules: App<Element>;
    markdown: { [path: string]: string };
  }

  interface Window {
    __CONFIG__: {
      title: string;
      version: string;
    };
  }
}
