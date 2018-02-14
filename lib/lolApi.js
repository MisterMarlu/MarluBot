const axios = require('axios'),
  tokens = require('../tokens'),
  baseUrl = [
    'https://',
    '.api.riotgames.com',
  ],
  key = `?api_key=${tokens.lolToken}`,
  lolLocations = [
    'euw',
  ];

class LolApi {
  static getSummonerByName(name, location) {
    let url = `${LolApi.buildUrl(location)}/lol/summoner/v3/summoners/by-name/${name}${key}`;
    console.log('Variable "url" =>', url);
    return new Promise((resolve, reject) => {
      axios.get(url).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject('Error on summoner name');
        console.log(error);
      });
    });
  }

  static getElo(name, location) {
    return new Promise((resolve, reject) => {
      LolApi.getSummonerByName(name, location).then(summoner => {
        let url = `${LolApi.buildUrl(location)}/lol/league/v3/positions/by-summoner/${summoner.id}${key}`;
        console.log('Variable "url" =>', url);
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