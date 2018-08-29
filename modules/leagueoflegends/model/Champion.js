const BaseModel = require('../../../lib/BaseModel');

let _table = 'lol_champions',
  _fillable = [
    'championId',
    'name',
    'title',
  ];

class Champion extends BaseModel {
  static get table() {
    return _table
  }

  static get fillable() {
    return _fillable
  }
}

module.exports = Champion;