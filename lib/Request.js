const axios = require('axios'),
  Helper = require('./Helper');

class Request {
  get(url, args = {}) {
    if (args.replace) url = Request.replace(url, args.replace);
    if (args.queryParameters) url = Request.addQueryParameters(url, args.queryParameters);

    return new Promise((resolve, reject) => {
      axios.get(url).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error);
      });
    });
  }

  static replace(url, replace) {
    for (let i = 0; i < replace.length; i += 1) {
      url = url.split(replace[i].pattern).join(replace[i].replacement);
    }

    return url;
  }

  static addQueryParameters(url, params) {
    let paramString = '';

    for (let i = 0; i < params.length; i += 1) {
      let string = i > 0 ? '&' : '?';
      string += params[i].key;

      if (params[i].value) string += `=${params[i].value}`;

      paramString += string;
    }

    return url + paramString;
  }
}

module.exports = new Request();

Helper.booted(__filename);