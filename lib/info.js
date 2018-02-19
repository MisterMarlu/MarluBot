const fs = require('fs'),
  info = require('./../package.json'),
  {Helper} = require('./helper'),
  forbidden = [
    'dependencies',
    'main',
  ];

/**
 * Get any information about this bot from the package.json file.
 *
 * @param {Client} bot
 * @returns {string}
 */
function getBotInfo(bot) {
  let response = "\r\n" + t('botInfo') + "\r\n";
  Helper.debugging('Variable "forbidden" =>', forbidden);

  for (let key in info) {
    if (!info.hasOwnProperty(key)) continue;
    Helper.debugging('Variable "info[key]" =>', info[key]);
    if (typeof key === 'object') continue;
    if (forbidden.includes(key)) continue;

    response += `${Helper.toUpperFirst(key)}: ${info[key]}` + "\r\n";
  }

  let pkgInfo = fs.statSync(`${__dirname}/../package.json`),
    date = new Date(pkgInfo.mtime);
  Helper.debugging('Variable "pkgInfo" =>', pkgInfo);

  response += t('update', [date.toDateString()]) + "\r\n";

  return response;
}

exports.getBotInfo = getBotInfo;