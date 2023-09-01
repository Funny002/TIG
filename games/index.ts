// TODO: 配置处理
function handlerGameConfig(config: GameConfig) {
  for (const key of ['home', 'name', 'mkdir']) {
    if (!(key in config)) {
      console.error('缺少参数 <%o> %s', config, key);
      return undefined;
    }
  }
  return config;
}

// TODO: 游戏模块
export const gameModules = (function () {
  const modules = import.meta.glob('./*/config.json', { eager: true }) as { [key: string]: GameConfig & { default: GameConfig } };

  // TODO: 验证配置
  return Object.keys(modules).map(keys => {
    const config = { ...(modules[keys].default || modules[keys]) };
    return handlerGameConfig(Object.assign({}, config, { mkdir: (keys.match(/\.\/(\w+)\/config.json/) || [])[1] }));
  }).filter(Boolean) as GameConfig[];
})();

// TODO: 菜单
export const GameMenu = gameModules.map(({ name, icon, file, author, version, mkdir }) => ({ name, author, version, isDocs: Boolean(file?.description), logo: icon && new URL(`./${ mkdir }/${ icon }?url`, import.meta.url).href }));
