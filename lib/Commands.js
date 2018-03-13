'use strict';

const {Helper} = require('./Helper'),
  {CommandList} = require('./CommandList'),
  {LolApi} = require('./LolApi'),
  {Info} = require('./Info'),
  doNotDisplay = [
    'do',
    'getDoNotDisplay',
    'addDoNotDisplay',
  ];

/**
 * In this class are all commands defined.
 */
class Commands {

  /**
   * Get all methods that should not be displayed.
   *
   * @returns {string[]} Returns an array of method names.
   */
  static getDoNotDisplay() {
    return doNotDisplay;
  }

  /**
   * Add a method to the not listed methods.
   *
   * @param value The name of a method.
   */
  static addDoNotDisplay(value) {
    if (doNotDisplay.includes(value)) return;
    if (typeof Commands[value] !== 'function') return;

    doNotDisplay.push(value);
  }

  /**
   *
   * @param message
   * @param command
   * @param args
   * @param bot
   */
  static do(message, command, args, bot = null) {
    let method = Helper.dashToCamel(command);

    if (method === 'debug') {
      if (NO_DEBUG) return;

      command = args.shift();
      Commands[method](message, command, args, bot);
      return;
    }

    if (typeof Commands[method] !== 'function' || typeof CommandList[method] !== 'function') {
      let response = __('noCommand', command);
      message.reply(response);
      return;
    }

    Commands[method](message, args, bot);
  }

  /**
   *
   * @param message
   * @param args
   * @param bot
   */
  static test(message, args, bot) {
    message.channel.send(__('commandTest'));
  }

  /**
   *
   * @param message
   * @param args
   * @param bot
   */
  static getCommands(message, args, bot) {
    message.channel.send(Info.commandList(Commands));
  }

  /**
   *
   * @param message
   * @param args
   * @param bot
   */
  static lolElo(message, args, bot) {
    bot = null;

    let location = 'euw',
      lolLocations = LolApi.getLolLocations();

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

      response += "\r\n\r\n" + `${queue.show}: `;

      if (index === -1) {
        response += __('unranked');
        message.channel.send(response);

        return;
      }

      let apiQueue = ranked[index];

      response += `${Helper.toUpperFirst(apiQueue.tier.toLowerCase())} ${apiQueue.rank}` + "\r\n";
      response += __('eloStat', apiQueue.wins, apiQueue.losses, apiQueue.leaguePoints);
      message.channel.send(response);
    }).catch(error => {
      message.reply(__('eloError'));
    });
  }

  static lolMatch(message, args, bot) {
    bot = null;

    let location = 'euw',
      lolLocations = LolApi.getLolLocations();

    if (lolLocations.includes(args[args.length - 1])) location = args.pop();
    let name = args.join(' ');

    Helper.debugging('Variable "location" =>', location);
    Helper.debugging('Variable "name" =>', name);

    LolApi.getCurrentMatchup(name, location).then((info) => {
      // let summoner = info.summoner,
      //   ranked = info.ranked,
      //   response = __('eloStart', summoner.name, summoner.summonerLevel),
      //   queue = {
      //     api: 'RANKED_SOLO_5x5',
      //     show: 'Solo 5v5',
      //   };
      //
      // Helper.debugging('Variable "summoner" =>', summoner);
      // Helper.debugging('Variable "ranked" =>', ranked);
      //
      // let index = ranked.findIndex(apiQueue => {
      //   return apiQueue.queueType === queue.api;
      // });
      //
      // response += "\r\n\r\n" + `${queue.show}: `;
      //
      // if (index === -1) {
      //   response += __('unranked');
      //   message.channel.send(response);
      //
      //   return;
      // }
      //
      // let apiQueue = ranked[index];
      //
      // response += `${Helper.toUpperFirst(apiQueue.tier.toLowerCase())} ${apiQueue.rank}` + "\r\n";
      // response += __('eloStat', apiQueue.wins, apiQueue.losses, apiQueue.leaguePoints);
      // message.channel.send(response);
    }).catch(error => {
      message.reply(__('matchError'));
    });
  }

  /**
   *
   * @param message
   * @param args
   * @param bot
   */
  static info(message, args, bot = false) {
    message.channel.send(Info.bot(bot));
  }

  /**
   *
   * @param message
   * @param command
   * @param args
   * @param bot
   */
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

exports.Commands = Commands;

Helper.booted(__filename);