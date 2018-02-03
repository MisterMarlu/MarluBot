const axios = require('axios'),
  tokens = require('../tokens'),
  baseUrl = 'https://euw1.api.riotgames.com',
  key = `?api_key=${tokens.lolToken}`;

class LolApi {
  static getSummonerByName(name) {
    let url = `${baseUrl}/lol/summoner/v3/summoners/by-name/${name}${key}`;

    return new Promise((resolve, reject) => {
      axios.get(url).then(response => {
        resolve(response.data);
      }).catch(error => {
        reject('Error on summoner name');
        console.log(error);
      });
    });
  }

  static getElo(name) {
    return new Promise((resolve, reject) => {
      LolApi.getSummonerByName(name).then(summoner => {
        let url = `${baseUrl}/lol/league/v3/positions/by-summoner/${summoner.id}${key}`;
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
}

exports.LolApi = LolApi;