const BaseModel = require('../../../lib/BaseModel');

let _table = 'lol_version',
  _fillable = [
    'version',
  ];

class Version extends BaseModel {
  static get table() {
    return _table
  }

  static get fillable() {
    return _fillable
  }
}

module.exports = Version;