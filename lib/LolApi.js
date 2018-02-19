'use strict';

const axios = require('axios'),
  tokens = require('../tokens'),
  {Helper} = require('./Helper'),
  baseUrl = [
    'https://',
    '.api.riotgames.com',
  ],
  key = `?api_key=${tokens.lolToken}`,
  lolLocations = [
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
  noNumbers = [
    'ru',
    'kr',
    'la1',
    'la2',
  ];

/**
 * This class handles all requests to the league of legends api.
 */
class LolApi {

  /**
   * Get all available locations for League of Legends.
   *
   * @returns {string[]} Returns an array of strings.
   */
  static getLolLocations() {
    return lolLocations;
  }

  /**
   * Get the summoner object via summoner name.
   *
   * @param {string} name The summoner name.
   * @param {string} location The server location, such as euw, na, etc.
   * @returns {Promise}
   */
  static getSummonerByName(name, location) {
    let url = `${LolApi.buildUrl(location)}/lol/summoner/v3/summoners/by-name/${name}${key}`;
    Helper.debugging('Variable "url" =>', url);

    return new Promise((resolve, reject) => {
      axios.get(url).then(response => {
        Helper.debugging('Variable "response.data" =>', response.data);
        resolve(response.data);
      }).catch(error => {
        reject('Error on summoner name');
        console.log(error);
      });
    });
  }

  /**
   * Get the ranked information about a summoner by it's summoner name.
   *
   * @param {string} name The summoner name.
   * @param {string} location The server location, such as euw, na, etc.
   * @returns {Promise}
   */
  static getElo(name, location) {
    return new Promise((resolve, reject) => {
      LolApi.getSummonerByName(name, location).then(summoner => {
        let url = `${LolApi.buildUrl(location)}/lol/league/v3/positions/by-summoner/${summoner.id}${key}`;
        Helper.debugging('Variable "url" =>', url);
        axios.get(url).then(response => {
          let ranked = response.data;

          resolve({summoner, ranked});
        }).catch(error => {
          reject('Error on getting ranked stats');
          console.log(error);
        });
      });
    });
  }

  /**
   * Build the base url with the correct server location. Default is "euw".
   *
   * @param {string} [location=euw] The server location, such as euw, na, etc.
   * @returns {string}
   */
  static buildUrl(location = 'euw') {
    if (noNumbers.includes(location)) return baseUrl.join(`${location}`);

    return baseUrl.join(`${location}1`);
  }
}

exports.LolApi = LolApi;

Helper.booted(__filename);