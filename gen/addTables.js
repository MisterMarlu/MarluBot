const {Generator} = require('./Generator'),
  generator = new Generator();

start().then();

async function start() {
  await generator.askForTables();
}