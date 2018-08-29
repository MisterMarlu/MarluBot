const cp = require("child_process"),

  Helper = require('./Helper');

let _intervalId = 0,
  _instance = null,
  _bot = null;

class BotManager {
  constructor() {
    if (_instance !== null) return _instance;

    this._timeout = 300;
    this._upTime = new Date().getTime();

    for (let name in arguments) {
      if (!arguments.hasOwnProperty(name)) continue;

      this[name] = arguments[name];
    }

    this._timeout *= 1000;

    _instance = this;

    return _instance;
  }

  get timeout() {
    return this._timeout;
  }

  set timeout(timeout) {
    this._timeout = timeout;
  }

  get upTime() {
    let currentTime = new Date().getTime(),
      botTime = this._upTime,
      diffTime = parseInt((currentTime - botTime) / 1000), // Get seconds.
      time = {
        days: 0,
        hours: '00',
        minutes: '00',
        seconds: '00',
      };

    time.seconds = Helper.twoDigits(parseInt(diffTime % 60));
    diffTime = parseInt(diffTime / 60);

    time.minutes = Helper.twoDigits(parseInt(diffTime % 60));
    diffTime = parseInt(diffTime / 60);

    time.hours = Helper.twoDigits(parseInt(diffTime % 60));
    diffTime = parseInt(diffTime / 60);

    time.days = parseInt(diffTime % 24);

    return time;
  }

  set upTime(upTime) {
    this._upTime = upTime;
  }

  keepAlive(bot) {
    _bot = bot;
    _intervalId = setInterval(BotManager.sendCommand, this.timeout);
  }

  static sendCommand() {
    let command = 'ping https://www.google.com/';

    cp.exec(command, () => {
      console.log('Pinged google.')
    });
  }

  static stop() {
    if (_intervalId === 0) return;

    clearInterval(_intervalId);
  }
}

module.exports = new BotManager();

Helper.booted(__filename);