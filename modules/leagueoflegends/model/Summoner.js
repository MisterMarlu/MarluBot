const BaseModel = require('../../lib/BaseModel');

let _table = 'lol_summoners',
  _fillable = [
    'accountId',
    'summonerId',
    'name',
    'summonerLevel',
  ];

class Summoner extends BaseModel {
  static get table() {
    return _table
  }

  static get fillable() {
    return _fillable
  }
}

module.exports = Summoner;