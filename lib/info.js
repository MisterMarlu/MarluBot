const fs = require('fs'),
  info = require(`${__dirname}/../package.json`),
  {Helper} = require(`${__dirname}/helper`),
  forbidden = [
    'dependencies',
    'main',
  ];

function getBotInfo(bot, debug = false) {
  let response = "\r\nInformation about this bot:\r\n";
  console.log('Variable "forbidden" =>', forbidden);

  for (let key in info) {
    if (!info.hasOwnProperty(key)) continue;
    console.log('Variable "info[key]" =>', info[key]);
    if (typeof key === 'object') continue;
    if (forbidden.includes(key)) continue;

    response += `${Helper.toUpperFirst(key)}: ${info[key]}` + "\r\n";
  }

  let pkgInfo = fs.statSync(`${__dirname}/../package.json`),
    date = new Date(pkgInfo.mtime);
  console.log('Variable "pkgInfo" =>', pkgInfo);

  response += `Last update: ${date.toDateString()}` + "\r\n";

  return response;
}

exports.getBotInfo = getBotInfo;