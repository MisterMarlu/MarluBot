const {Helper} = require('./helper'),
  {CommandList} = require('./commandList'),
  {LolApi, lolLocations} = require('./lolApi'),
  {getBotInfo} = require('./info'),
  doBreak = "\r\n",
  dontDisplay = [
    'do',
  ];

class Commands extends CommandList {
  static do(message, command, args, bot = null) {
    let method = Helper.dashToCamel(command);

    if (method === 'debug') {
      if (NO_DEBUG) return;

      command = args.shift();
      Commands[method](message, command, args, bot);
      return;
    }

    if (typeof Commands[method] !== 'function') {
      let response = __('noCommand', command);
      message.reply(response);
      return;
    }

    Commands[method](message, args, bot);
  }

  static test(message, args, bot) {
    message.channel.send(__('commandTest'));
  }

  static getCommands(message, args, bot) {
    message.channel.send(getCommandList());
  }

  static lolElo(message, args, bot) {
    bot = null;

    let location = 'euw';
    if (lolLocations.includes(args[args.length - 1])) location = args.pop();
    let name = args.join(' ');

    Helper.debugging('Variable "location" =>', location);
    Helper.debugging('Variable "name" =>', name);

    LolApi.getElo(name, location).then((info) => {
      let summoner = info.summoner,
        ranked = info.ranked,
        response = __('eloStart', summoner.name, summoner.summonerLevel),
        queue = {
          api: 'RANKED_SOLO_5x5',
          show: 'Solo 5v5',
        };

      Helper.debugging('Variable "summoner" =>', summoner);
      Helper.debugging('Variable "ranked" =>', ranked);

      let index = ranked.findIndex(apiQueue => {
        return apiQueue.queueType === queue.api;
      });

      response += `${doBreak}${doBreak}${queue.show}: `;

      if (index === -1) {
        response += __('unranked');
        message.channel.send(response);

        return;
      }

      let apiQueue = ranked[index];

      response += `${Helper.toUpperFirst(apiQueue.tier.toLowerCase())} ${apiQueue.rank}${doBreak}`;
      response += __('eloStat', apiQueue.wins, apiQueue.losses, apiQueue.leaguePoints);
      message.channel.send(response);
    }).catch(error => {
      message.reply(__('eloError'));
    });
  }

  static info(message, args, bot = false) {
    message.channel.send(getBotInfo(bot));
  }

  static debug(message, command, args, bot) {
    if (message.author.username !== 'MisterMarlu') return;

    let method = Helper.dashToCamel(command);
    if (typeof Commands[method] === 'function') {
      Commands[method](message, args, bot, true);
      return;
    }

    message.reply(__('debugNoCommand', command));
  }
}

function getCommandList() {
  let props = Object.getOwnPropertyNames(Commands),
    response = __('getCommands') + doBreak;

  if (NO_DEBUG && !dontDisplay.includes('debug')) dontDisplay.push('debug');

  Helper.debugging('Variable "props" =>', props);

  for (let i = 0; i < props.length; i += 1) {
    let method = props[i];
    Helper.debugging('Variable "method" =>', method);
    if (typeof Commands[method] === 'function' && !dontDisplay.includes(method)) {
      response += `?${Helper.camelToDash(method)} -> ${CommandList[method]()}${doBreak}`;
    }
  }

  return response;
}

exports.Commands = Commands;