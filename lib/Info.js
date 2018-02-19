'use strict';

const fs = require('fs'),
  info = require('../package'),
  {Helper} = require('./Helper'),
  {CommandList} = require('./CommandList');

let forbidden = [
  'dependencies',
  'main',
  'scripts',
];

/**
 *
 */
class Info {

  /**
   *
   * @param client
   * @returns {string}
   */
  static bot(client) {
    let response = "\r\n" + __('botInfo') + "\r\n";
    Helper.debugging('Variable "forbidden" =>', forbidden);
    Helper.debugging('bot', client);

    for (let key in info) {
      if (!info.hasOwnProperty(key)) continue;
      Helper.debugging('Variable "info[key]" =>', info[key]);
      if (typeof key === 'object') continue;
      if (forbidden.includes(key)) continue;

      response += `${__(Helper.toUpperFirst(key))}: ${info[key]}` + "\r\n";
    }

    let pkgInfo = fs.statSync(`${__dirname}/../package.json`),
      date = new Date(pkgInfo.mtime);
    Helper.debugging('Variable "pkgInfo" =>', pkgInfo);

    response += __('update', date.toDateString()) + "\r\n";

    return response;
  }

  /**
   *
   * @returns {string}
   */
  static commandList(Commands) {
    let props = Object.getOwnPropertyNames(Commands),
      doNotDisplay = Commands.getDoNotDisplay(),
      response = __('getCommands') + "\r\n";

    if (NO_DEBUG && !doNotDisplay.includes('debug')) Commands.addDoNotDisplay('debug');

    Helper.debugging('Variable "props" =>', props);

    for (let i = 0; i < props.length; i += 1) {
      let method = props[i];
      Helper.debugging('Variable "method" =>', method);
      if (typeof Commands[method] === 'function' && !doNotDisplay.includes(method)) {
        response += `?${Helper.camelToDash(method)} -> ${CommandList[method]()}` + "\r\n";
      }
    }

    return response;
  }
}

exports.Info = Info;

Helper.booted(__filename);