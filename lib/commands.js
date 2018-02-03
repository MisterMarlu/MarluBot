const {Helper} = require('./helper'),
  {CommandList} = require('./commandList'),
  {LolApi} = require('./lolApi'),
  doBreak = "\r\n",
  dontDisplay = [
    'do',
  ];

class Commands extends CommandList {
  static do(message, command, args) {
    command = Helper.dashToCamel(command);
    if (typeof Commands[command] !== 'function') {
      message.reply(`There is no command called "${command}". Type "?get-commands" to get a list of commands with it's description.`);
      return;
    }

    Commands[command](message, args);
  }

  static test(message, args) {
    let response = 'Tested! Command: "test".';

    for (let i = 0; i < args.length; i += 1) {
      if (i === 0) response += ' Arguments:';
      response += ` ${i + 1}. "${args[i]}"`;
    }

    message.channel.send(response);
  }

  static getCommands(message, args) {
    message.channel.send(getCommandList());
  }

  static lolElo(message, args) {
    let queues = [
      {api: 'RANKED_SOLO_5x5', show: 'Solo 5v5'},
      {api: 'RANKED_FLEX_5x5', show: 'Flex 5v5'},
      {api: 'RANKED_FLEX_3x3', show: 'Flex 3v3'},
    ];

    LolApi.getElo(args[0]).then((info) => {
      let summoner = info.summoner,
        ranked = info.ranked,
        response = `Ranked stats of ${summoner.name} (lvl ${summoner.summonerLevel})`;

      for (let i = 0; i < queues.length; i += 1) {
        let index = ranked.findIndex(queue => {
          return queue.queueType === queues[i].api;
        });

        response += `${doBreak}${doBreak}${queues[i].show}: `;
        if (index === -1) {
          response += `Unranked`;
          continue;
        }
        let queue = ranked[index];

        response += `${Helper.toUpperFirst(queue.tier.toLowerCase())} ${queue.rank}${doBreak}`;
        response += `${queue.wins} wins, ${queue.losses} losses, ${queue.leaguePoints} LP`;
      }

      message.channel.send(response);
    }).catch(error => {
      message.reply('There is an issue, maybe a spelling in the summoner name :(');
    });
  }
}

function getCommandList() {
  let props = Object.getOwnPropertyNames(Commands),
    response = `List of available commands:${doBreak}`;

  for (let i = 0; i < props.length; i += 1) {
    let method = props[i];
    if (typeof Commands[method] === 'function' && !dontDisplay.includes(method)) {
      response += `?${Helper.camelToDash(method)} -> ${CommandList[method]()}${doBreak}`;
    }
  }

  return response;
}

exports.Commands = Commands;