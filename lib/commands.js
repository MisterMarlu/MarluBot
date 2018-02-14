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
      command = args.shift();
      Commands[method](message, command, args, bot);
      return;
    }

    if (typeof Commands[method] !== 'function') {
      let response = `There is no command called "${command}". Type "?get-commands" to get a list of commands with it's description.`;
      message.reply(response);
      return;
    }

    Commands[method](message, args, bot);
  }

  static test(message, args, bot, debug = false) {
    message.channel.send("I woke up and I'm alive.");
  }

  static getCommands(message, args, bot, debug = false) {
    message.channel.send(getCommandList(debug));
  }

  static lolElo(message, args, bot, debug = false) {
    bot = null;
    let queues = [
        {api: 'RANKED_SOLO_5x5', show: 'Solo 5v5'},
        {api: 'RANKED_FLEX_5x5', show: 'Flex 5v5'},
        {api: 'RANKED_FLEX_3x3', show: 'Flex 3v3'},
      ],
      location = 'euw';

    if (lolLocations.includes(args[args.length - 1])) {
      location = args.pop();
    }

    let name = args.join(' ');

    console.log('Variable "location" =>', location);
    console.log('Variable "name" =>', name);

    LolApi.getElo(name, location).then((info) => {
      let summoner = info.summoner,
        ranked = info.ranked,
        response = `Ranked stats of ${summoner.name} (lvl ${summoner.summonerLevel})`;

      console.log('Variable "summoner" =>', summoner);
      console.log('Variable "ranked" =>', ranked);

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

  static info(message, args, bot, debug = false) {
    message.channel.send(getBotInfo(bot, debug));
  }

  static debug(message, command, args, bot) {
    let method = Helper.dashToCamel(command);
    if (typeof Commands[method] === 'function') {
      Commands[method](message, args, bot, true);
      return;
    }

    message.reply(`No command available called "${command}".`);
  }
}

function getCommandList(debug = false) {
  let props = Object.getOwnPropertyNames(Commands),
    response = `List of available commands:${doBreak}`;

  console.log('Variable "props" =>', props);

  for (let i = 0; i < props.length; i += 1) {
    let method = props[i];
    console.log('Variable "method" =>', method);
    if (typeof Commands[method] === 'function' && !dontDisplay.includes(method)) {
      response += `?${Helper.camelToDash(method)} -> ${CommandList[method]()}${doBreak}`;
    }
  }

  return response;
}

exports.Commands = Commands;