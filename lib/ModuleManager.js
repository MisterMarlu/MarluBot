const fs = require('fs'),
  Helper = require('./Helper'),
  Log = require('./Log'),

  moduleDirectory = Helper.clearPath(`${__dirname}/../modules`),
  localeDirectory = Helper.clearPath(`${__dirname}/../locales`);

let modules = {};

class ModuleManager {

  /**
   * Collects all installed modules.
   */
  static collectModules() {
    let directories = fs.readdirSync(moduleDirectory);

    for (let i = 0; i < directories.length; i += 1) {
      let moduleDir = `${moduleDirectory}/${directories[i]}`,
        moduleConfig = require(`${moduleDir}/module.json`),
        Commands = require(`${moduleDir}/Commands.js`),
        CommandList = require(`${moduleDir}/CommandList.js`);

      modules[moduleConfig.id] = {
        name: moduleConfig.name,
        id: moduleConfig.id,
        path: moduleDir,
        commands: Commands,
        commandList: CommandList,
      };
    }
  }

  /**
   * Merge all module locales with the core locale.
   */
  static mergeLocales() {
    let mainLocales = {
        de: {},
        en: {},
      },
      coreLocales = {
        de: require(`${localeDirectory}/core_de`),
        en: require(`${localeDirectory}/core_en`),
      };

    for (let id in modules) {
      if (!modules.hasOwnProperty(id)) continue;
      if (!fs.existsSync(`${modules[id].path}/locales`)) continue;

      let localeDE = require(`${modules[id].path}/locales/de.json`),
        localeEN = require(`${modules[id].path}/locales/en.json`);

      mainLocales.de = Object.assign(mainLocales.de, localeDE);
      mainLocales.en = Object.assign(mainLocales.en, localeEN);
    }

    mainLocales.de = Object.assign(mainLocales.de, coreLocales.de);
    mainLocales.en = Object.assign(mainLocales.en, coreLocales.en);

    if (fs.existsSync(`${localeDirectory}/de.json`)) {
      fs.unlinkSync(`${localeDirectory}/de.json`);
    }

    if (fs.existsSync(`${localeDirectory}/en.json`)) {
      fs.unlinkSync(`${localeDirectory}/en.json`);
    }

    return new Promise((resolve, reject) => {
      fs.writeFile(`${localeDirectory}/de.json`, JSON.stringify(mainLocales.de, null, 2), (error) => {
        fs.writeFile(`${localeDirectory}/en.json`, JSON.stringify(mainLocales.en, null, 2), (error) => {
          resolve();
        });
      });
    });
  }

  /**
   * Get a list of all available commands.
   *
   * @returns {string}
   */
  static commandList() {
    let CommandList = require('./CommandList'),
      response = __('core_getCommands') + "\r\n";

    response += ModuleManager.getCommandList(CommandList);

    for (let id in modules) {
      if (!modules.hasOwnProperty(id)) continue;

      response += "\r\n" + __('core_commandListModule', modules[id].name) + "\r\n";
      response += ModuleManager.getCommandList(modules[id].commandList);
    }

    return response;
  }

  /**
   * Get a list of all available commands of that module.
   *
   * @param {CommandList} list
   * @returns {string}
   */
  static getCommandList(list) {
    let props = Object.getOwnPropertyNames(list),
      response = '';

    for (let i = 0; i < props.length; i += 1) {
      let method = props[i];

      if (typeof list[method] === 'function' && !method.toLowerCase().includes('debug')) {
        response += `?${Helper.camelToDash(method)} -> ${list[method]()}` + "\r\n";
      }
    }

    return response;
  }

  /**
   * Check of command exists.
   *
   * @param method
   * @param secure
   * @returns {boolean}
   */
  static isCommand(method, secure) {
    for (let id in modules) {
      if (!modules.hasOwnProperty(id)) continue;
      if (typeof modules[id].commandList[method] === 'function' && typeof modules[id].commands[method] === 'function') return true;
      if (typeof modules[id].commands[method] === 'function' && !secure) return true;
    }

    return false;
  }

  /**
   * Executes the command of the module.
   *
   * @param method
   * @param message
   * @param args
   * @param secure
   */
  static do(method, message, args, secure = true) {
    for (let id in modules) {
      if (!modules.hasOwnProperty(id)) continue;
      if ((typeof modules[id].commandList[method] !== 'function' && secure) || typeof modules[id].commands[method] !== 'function') continue;

      try {
        modules[id].commands[method](message, args);
      } catch (e) {
        let log = `Unable to run command ?${Helper.camelToDash(method)} ${args.join(' ')}`;

        Log.write(`[Exception] ${log}`, true);
        Log.write(`[Info] Exception was thrown in module "${modules[id].name}"`, true);
        message.channel.send(`An error occurred. ${log}`);

        console.error(e);
      }
    }
  }
}

module.exports = ModuleManager;

Helper.booted(__filename);