const BaseModel = require('../../../lib/BaseModel');

let _table = 'lol_league',
  _fillable = [
    'summonerId',
    'queueType',
    'wins',
    'losses',
    'rank',
    'tier',
    'leaguePoints',
  ];

class League extends BaseModel {
  static get table() {
    return _table
  }

  static get fillable() {
    return _fillable
  }
}

module.exports = League;