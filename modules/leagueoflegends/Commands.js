const Helper = require('../../lib/Helper'),

  LeagueOfLegends = require('./Controller/LeagueOfLegends');

class Commands {
  static lolInfo(message, args) {
    return message.channel.send(__('lol_info'));
  }

  static async lolElo(message, args) {
    let lol = new LeagueOfLegends(),
      location = 'euw';

    if (lol.allLocations.includes(args[args.length - 1])) location = args.pop();
    lol.location = location;

    let name = args.join(' '),
      info = await lol.getElo(name),
      summoner = info.summoner,
      leagues = info.leagues,
      response = __('lol_eloStart', summoner.name, summoner.summonerLevel),
      queue = {
        api: 'RANKED_SOLO_5x5',
        show: 'Solo 5v5',
      };

    if (leagues.length < 1) {
      response += __('lol_eloNoRank');
      message.channel.send(response);

      return;
    }

    let index = leagues.findIndex(apiQueue => {
      return apiQueue.queueType === queue.api;
    });

    response += "\r\n\r\n" + `${queue.show}: `;

    let league = leagues[index];

    response += `${Helper.toUpperFirst(league.tier.toLowerCase())} ${league.rank}` + "\r\n";
    response += __('lol_eloStat', league.wins, league.losses, league.leaguePoints);

    message.channel.send(response);
  }

  static lolMatch(message, args) {
    return __('lol_descMatch');
  }

  static async lolVersion(message, args) {
    let lol = new LeagueOfLegends(),
      version = await lol.getVersion();

    message.channel.send(__('lol_version', version));
  }
}

module.exports = Commands;

Helper.booted(__filename);