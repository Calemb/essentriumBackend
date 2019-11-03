const expect = require('chai').expect;
const store = require('../local_modules/store')

describe('guild', () => {

  before(async () => {
    await store.connect()
  });

  after(async () => {
    await store.db.close()
  });


  it('checks all guilds', async () => {
    const guild = require('../LogicControllers/guild')
    const result = await guild.allGuilds()
    // const result = { err: null, results: true }

    expect(result.err).to.be.null;
    expect(result.results).to.not.be.undefined;
  })
})
