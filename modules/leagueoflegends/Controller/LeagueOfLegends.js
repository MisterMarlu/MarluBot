const DB = require('../../../lib/DB'),
  Request = require('../../../lib/Request'),

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
      url = `${baseUrl}/static-data/v3/versions`;

    let response = await Request.get(url, args);

    return response.data[0];
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