const fs = require('fs'),
  info = require('./../package.json'),
  {Helper} = require('./helper'),
  forbidden = [
    'dependencies',
    'main',
  ];

function getBotInfo(bot, debug = false) {
  let response = "\r\nInformation about this bot:\r\n";
  Helper.debugging('Variable "forbidden" =>', forbidden, debug);

  for (let key in info) {
    if (!info.hasOwnProperty(key)) continue;
    Helper.debugging('Variable "info[key]" =>', info[key], debug);
    if (typeof key === 'object') continue;
    if (forbidden.includes(key)) continue;

    response += `${Helper.toUpperFirst(key)}: ${info[key]}` + "\r\n";
  }

  let pkgInfo = fs.statSync(`${__dirname}/../package.json`),
    date = new Date(pkgInfo.mtime);
  Helper.debugging('Variable "pkgInfo" =>', pkgInfo, debug);

  response += `Last update: ${date.toDateString()}` + "\r\n";

  return response;
}

exports.getBotInfo = getBotInfo;