const expect = require('chai').expect;
const store = require('../local_modules/store')

beforeEach(async function () {
  await store.connect()
});




describe('guild', () => {
  it('checks all guilds', async () => {
    const guild = require('../LogicControllers/guild')
    const guilds = await guild.allGuilds()

    expect(guilds).to.not.be.undefined;
  })
})
