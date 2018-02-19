if (typeof NO_DEBUG === 'undefined') {
  /**
   * Define DEBUG for debugging.
   */
  Object.defineProperty(global, 'NO_DEBUG', {
    get: function () {
      let noDebug = false;

      for (let i = 0; i < process.argv.length; i += 1) {
        if (process.argv[i] === 'noDebug') noDebug = true;
      }

      return noDebug;
    }
  });
}

require('./translation');