const fs = require('fs'),
  Helper = require('./Helper'),

  moduleDirectory = Helper.clearPath(`${__dirname}/../modules`),
  localeDirectory = Helper.clearPath(`${__dirname}/../locales`);

let modules = {};

class ModuleManager {
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

  static isCommand(method, secure) {
    for (let id in modules) {
      if (!modules.hasOwnProperty(id)) continue;
      if (typeof modules[id].commandList[method] === 'function' && typeof modules[id].commands[method] === 'function') return true;
      if (typeof modules[id].commands[method] === 'function' && !secure) return true;
    }

    return false;
  }

  static do(method, message, args) {
    for (let id in modules) {
      if (!modules.hasOwnProperty(id)) continue;
      if (typeof modules[id].commandList[method] !== 'function' || typeof modules[id].commands[method] !== 'function') continue;

      modules[id].commands[method](message, args);
    }
  }
}

module.exports = ModuleManager;

Helper.booted(__filename);