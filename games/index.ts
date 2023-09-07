import { App } from 'vue';

// TODO: 配置
const configModules = import.meta.glob('./*/config.{json,ts,js}', { eager: true, import: 'default' }) as { [key: string]: Partial<GameConfig> };

// TODO: 模块
const vueModules = import.meta.glob('./**/*.vue', { eager: true, import: 'default' }) as { [path: string]: App<Element> };

// TODO: 文档
const markdownModules = import.meta.glob('./**/*.md', { eager: true, as: 'raw' }) as { [path: string]: string };

// TODO: 默认配置
const defaultConfig = {
  main: './index.vue', // 文件入口
  markdown: {
    mkdir: './public', // markdown 文件
    main: './index.md', // markdown 入口
  },
};

// TODO: 路径处理
function handlerPath(path: string) {
  return path.split('/').filter(v => !['.'].includes(v)).join('/');
}

// TODO: 模块处理
export const GameModules = Object.keys(configModules).reduce(function (value: { [key: string]: GameModule }, path: string) {
  const mkdir = (path.match(/\.\/(\w+)\/config\.(ts|js|json)/) || [])[1];
  const config = Object.assign({}, defaultConfig, configModules[path]) as GameConfig;
  const mkdirReg = new RegExp(`^./${mkdir}/${handlerPath(config.markdown.mkdir)}`);

  // TODO: markDown 文件整理
  const markdown = Object.entries(markdownModules).reduce(function (value, [path, content]) {
    if (!path.startsWith(`./${ mkdir }/`)) return value;
    return Object.assign(value, { [path.replace(mkdirReg, '.')]: content });
  }, {});

  // TODO: Vue 入口文件
  const modules = vueModules[`./${ mkdir }/${ handlerPath(config.main) }`];

  // TODO: LOGO 处理
  const logo = config.logo && new URL(`./${ mkdir }/${ handlerPath(config.logo) }?url`, import.meta.url).href;

  // TODO: 配置处理
  const { name, version, author, description, markdown: { main } } = config;
  value[name] = { config: { name, version, author, description, markdown: main, logo }, modules, markdown };
  return value;
}, {});

// TODO: 菜单
export const GameMenu = Object.keys(GameModules).map(v => GameModules[v].config);
