const expect = require('chai').expect;
const store = require('../local_modules/store')
const dbTestAdress = 'mongodb://127.0.0.1/essentriumTest'

clearDatabase = function () {
  return new Promise(resolve => {
    store.db.dropDatabase((err, result) => {
      resolve({ err, result })
    })
  })
}

describe('guilds', () => {

  before(async () => {
    await store.connect(dbTestAdress)
  })

  after(async () => {
    // await clearDatabase()
    await store.db.close()
  })
  
  afterEach(async () => {
    await clearDatabase()
  })



  it('checks all guilds response structure', async () => {
    const guild = require('../LogicControllers/guild')
    const allGuilds = await guild.allGuilds()

    expect(allGuilds.err).to.be.null

    expect(allGuilds.results).to.not.be.undefined
    expect(allGuilds.results).to.be.a("Array")
  })

  it('checks not existed my guild', async () => {
    const guild = require('../LogicControllers/guild')
    const myGuild = await guild.myGuild(
      store.CreateNeObjectId()
    );

    expect(myGuild.err).to.have.property('msg')
    expect(myGuild.err.msg).to.be.a('string')
    expect(myGuild.err.msg).to.not.be.empty

    expect(myGuild.results).to.be.undefined
  })

  
  it('checks existed my guild', async () => {
    const guild = require('../LogicControllers/guild')
    const guildTestName = 'Example Guild Name'

    const playerId = store.CreateNeObjectId();

    const creation = await guild.createGuild(playerId, guildTestName)
    const myGuild = await guild.myGuild(
      playerId
    );

    expect(myGuild.err).to.be.null
    
    expect(myGuild.results.guild).to.have.property('_id')
    

    // expect(myGuild.results).to.be.undefined
  })

  it('create uniq named guild', async () => {
    const guild = require('../LogicControllers/guild')
    const guildTestName = 'Example Guild Name'

    const creation = await guild.createGuild(store.ObjectId(), guildTestName)
    //guild creation and remove are so close depends on io sockets chat.....
    expect(creation.err).to.be.null;

    expect(creation.results).to.not.be.undefined;
  })

  it('remove existing guild', async () => {
    const guild = require('../LogicControllers/guild')
    const guildTestName = "Test name"
    const playerId = store.ObjectId()
    const testGuildCreation = await guild.createGuild(playerId, guildTestName)
    const createdGuild = await guild.myGuild(playerId)
    
    console.log(createdGuild)
    // const guildId 
    //     const removeResult = await guild.removeGuild(guildId)

    // expect(removeResult.err).to.be.null;

  })
})
