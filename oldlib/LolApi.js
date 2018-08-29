'use strict';

const {Helper} = require('./Helper'),
  {Request} = require('../lib/Request'),
  {Summoner} = require('../modules/leagueoflegends/model/Summoner'),
  {League} = require('../modules/leagueoflegends/model/League'),
  _tokens = require('../tokens'),
  _lolLocations = [
    'ru',
    'kr',
    'br',
    'oc',
    'jp',
    'na',
    'eun',
    'euw',
    'tr',
    'la1',
    'la2',
  ],
  _noNumbers = [
    'ru',
    'kr',
    'la1',
    'la2',
  ],
  _apiKey = {
    key: 'api_key',
    value: _tokens.lolToken,
  };

let _location = '';

/**
 * This class handles all requests to the league of legends api.
 */
class LolApi {
  constructor(location = 'euw') {
    _location = location;
  }

  /**
   *
   * @returns {string}
   */
  get location() {
    return _location;
  }

  /**
   *
   * @param {string} location
   */
  set location(location) {
    _location = location;
  }

  /**
   *
   * @param {object[]} parameters[]
   * @returns {Array}
   */
  static buildQuery(parameters = []) {
    parameters.push(_apiKey);

    return parameters;
  }

  /**
   *
   * @param replacements
   * @returns {Array}
   */
  buildReplacements(replacements = []) {
    let location = {
      pattern: '{location}',
      replacement: this.rightLocation(),
    };

    replacements.push(location);

    return replacements;
  }

  /**
   * Get the summoner object via summoner name.
   *
   * @param {string} name The summoner name.
   * @returns {Promise}
   */
  async getSummonerByName(name) {
    let summonerData = await Summoner.where('name', name);

    if (summonerData.length > 0) {
      return summonerData[0];
    }

    let replace = [
        {
          pattern: '{summonerName}',
          replacement: name,
        },
      ],
      queryParameters = LolApi.buildQuery();

    replace = this.buildReplacements(replace);

    let request = await Request.doRequest('lol', 'summoner', {replace, queryParameters});
    summonerData = request.data;
    summonerData.summonerId = summonerData.id;

    let summoner = await new Summoner(summonerData);
    summoner.save();

    return summoner;
  }

  /**
   * Get the ranked information about a summoner by it's summoner name.
   *
   * @param {string} name The summoner name.
   * @param {string} location The server location, such as euw, na, etc.
   * @returns {Promise}
   */
  static async getElo(name, location) {
    let summoner = await LolApi.getSummonerByName(name, location),
      leagueData = await League.where('summonerId', summoner.summonerId);

    if (leagueData.length > 0) {
      return leagueData[0];
    }

    let replace = [
        {
          pattern: '{location}',
          replacement: LolApi.rightLocation(location),
        },
        {
          pattern: '{summonerId}',
          replacement: summoner.summonerId,
        },
      ],
      getParameters = [
        {
          key: 'api_key',
          value: tokens.lolToken,
        },
      ];

    let request = await Request.doRequest('lol', 'rank', {replace, getParameters});
    leagueData = request.data;
    let leagues = [];

    for (let i = 0; i < leagueData.length; i += 1) {
      leagueData[i].summonerId = summoner.summonerId;
      let league = await new League(leagueData[i]);
      league.save();
      leagues.push(league);
    }

    return {
      summoner,
      leagues,
    };
  }

  /**
   * Build the base url with the correct server location. Default is "euw".
   *
   * @param {string} [location=euw] The server location, such as euw, na, etc.
   * @returns {string}
   */
  rightLocation(location = '') {
    location = location || this.location;
    if (_noNumbers.includes(location)) return location;

    return `${location}1`;
  }

  async updateAll() {}

  async checkForUpdate() {
    let replace = this.buildReplacements(),
      queryParameters = LolApi.buildQuery(),
      version = await Version.first(),
      remoteVersion = await Request.doRequest('lol', 'version', {replace, queryParameters});

    if (version.length < 1) return false;

    if (!this.isNewer(remoteVersion, version)) return false;

    version.version = removeVersion[0];
    version.save();

    return true;
  }
}

exports.LolApi = LolApi;

Helper.booted(__filename);