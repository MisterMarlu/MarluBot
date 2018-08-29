const DB = require('./DB');

let _table = 'Test',
  _fillable = ['test'];

class BaseModel {

  /**
   * Get the table name.
   *
   * @returns {string}
   */
  static get table() {
    return _table
  }

  /**
   * Get all fillable columns.
   *
   * @returns {string[]}
   */
  static get fillable() {
    return _fillable
  }

  /**
   * Create an instance of the Database.
   *
   * @param {string[]} attributes
   * @returns {BaseModel}
   */
  constructor(attributes) {
    for (let name in attributes) {
      if (!attributes.hasOwnProperty(name)) continue;
      if (!this.constructor.fillable.includes(name)) continue;

      this[name] = attributes[name];
    }

    return this;
  }

  /**
   * Save the model.
   *
   * @returns {BaseModel}
   */
  async save() {
    let values = {},
      filter = {};

    for (let i = 0; i < this.constructor.fillable.length; i += 1) {
      let key = this.constructor.fillable[i];

      values[key] = this[key] || null;
      if (this[key] === 0) values[key] = 0;
    }

    if (this.id) filter.id = this.id;

    return await DB.save(filter, values, this.constructor.table);
  };

  /**
   * Get model by id.
   *
   * @param {number} id
   * @returns {BaseModel}
   */
  static async find(id) {
    let result = await DB.find({id}, this.table);

    if (result.length === 1) return result[0];

    return result;
  };

  /**
   * Get the first instance of the BaseModel.
   *
   * @returns {BaseModel}
   */
  static async first() {
    let result = await DB.findOne({}, this.table);

    if (result.length === 1) return result[0];

    return result;
  };

  /**
   * Get any BaseModels which matches the where condition.
   *
   * @param {string} key
   * @param value
   * @param {string} [operator='=']
   * @returns {BaseModel[]|BaseModel}
   */
  static async where(key, value, operator = '=') {
    let result = await DB.find({[key]: value}, this.table, {}, operator);

    if (result.length === 1) return result[0];

    return result;
  };

  /**
   * Create a new instance of the BaseModel.
   *
   * @param {string[]} attributes
   * @returns {BaseModel}
   */
  static create(attributes) {
    return new this(attributes);
  }
}

module.exports = BaseModel;