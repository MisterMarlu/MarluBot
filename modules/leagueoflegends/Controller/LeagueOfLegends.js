const Request = require('../../../lib/Request'),

  Version = require('../model/Version'),
  Champion = require('../model/Champion'),

  config = require('../config/config'),
  token = require('../config/tokens'),
  _apiKey = {
    key: 'api_key',
    value: token.token,
  };

let _location = '',
  baseUrl = 'https://{location}.api.riotgames.com/lol';

class LeagueOfLegends {

  constructor(location = 'euw') {
    this.location = location;
  }

  /**
   *
   * @returns {string[]}
   */
  get allLocations() {
    return config.locations;
  }

  /**
   *
   * @returns {string[]}
   */
  get noNumbers() {
    return config.noNumbers;
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


  async getVersion() {
    let args = {
        replace: this.buildReplacements(),
        queryParameters: LeagueOfLegends.buildQuery(),
      },
      url = `${baseUrl}/static-data/v3/versions`,
      response = await Request.get(url, args);

    return response.data[0];
  }

  async checkVersion() {
    let dbVersion = await Version.first(),
      versions = {
        current: await this.getVersion().split('.'),
        db: dbVersion.version.split('.'),
      },
      isLatest = true;

    for (let i = 0; i < versions.current.length; i += 1) {
      if (!versions.current.hasOwnProperty(i)) continue;
      if (!versions.db.hasOwnProperty(i)) continue;
      if (versions.current[i] > versions.db[i]) isLatest = false;
    }

    return isLatest;
  }

  async updateData(version) {
    await this.updateVersion(version);
    await this.updateChampions(version);
  }

  async updateVersion(version) {
    let currentVersion = Version.first();

    if (currentVersion.length === 0) currentVersion = new Version({version});

    currentVersion.version = version;
    await currentVersion.save();
  }

  async updateChampions(version) {
    let parameters = [
        {
          key: 'locale',
          value: 'en_US',
        },
        {
          key: 'version',
          value: version,
        },
        {
          key: 'dataById',
          value: 'false',
        },
      ],
      args = {
        replace: this.buildReplacements(),
        queryParameters: LeagueOfLegends.buildQuery(parameters),
      },
      url = `${baseUrl}/static-data/v3/champions`,
      response = await Request.get(url, args);

    for (let key in response.data) {
      if (!response.data.hasOwnProperty(key)) continue;

      let champData = response.data[key],
        champ = await Champion.where('championId', champData.id);

      champData.championId = champData.id;

      if (champ.length <= 0) champ = new Champion(champData);

      for (let champKey in champData) {
        if (!champData.hasOwnProperty(champKey)) continue;
        if (champKey === 'id') continue;

        champ[champKey] = champData[champKey];
      }

      await champ.save();
    }
  }

  /**
   * Build the base url with the correct server location. Default is "euw".
   *
   * @param {string} [location=euw] The server location, such as euw, na, etc.
   * @returns {string}
   */
  rightLocation(location = '') {
    location = location || this.location;
    if (this.noNumbers.includes(location)) return location;

    return `${location}1`;
  }
}


module.exports = LeagueOfLegends;