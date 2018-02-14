const axios = require('axios'),
  tokens = require('../tokens'),
  {Helper} = require('./helper'),
  baseUrl = [
    'https://',
    '.api.riotgames.com',
  ],
  key = `?api_key=${tokens.lolToken}`,
  lolLocations = [
    'euw',
  ];

class LolApi {
  static getSummonerByName(name, location, debug = false) {
    let url = `${LolApi.buildUrl(location)}/lol/summoner/v3/summoners/by-name/${name}${key}`;
    Helper.debugging('Variable "url" =>', url, debug);
    return new Promise((resolve, reject) => {
      axios.get(url).then(response => {
        Helper.debugging('Variable "response.data" =>', response.data, debug);
        resolve(response.data);
      }).catch(error => {
        reject('Error on summoner name');
        console.log(error);
      });
    });
  }

  static getElo(name, location, debug = false) {
    return new Promise((resolve, reject) => {
      LolApi.getSummonerByName(name, location, debug).then(summoner => {
        let url = `${LolApi.buildUrl(location)}/lol/league/v3/positions/by-summoner/${summoner.id}${key}`;
        Helper.debugging('Variable "url" =>', url, debug);
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

  static buildUrl(location) {
    return baseUrl.join(`${location}1`);
  }
}

exports.LolApi = LolApi;
exports.lolLocations = lolLocations;