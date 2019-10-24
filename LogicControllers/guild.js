const playerUtil = require('./player')
const chatMgr = require('../io-chat')
const response = require('./_response-structure')
const guildDomain = require('../domain/guild')

const guildStore = require('../store/guild')

const store = require('../local_modules/store')
const guild = store.db.collection('guilds')
//
// INNER FUNCTIONS
//
//WORKING separate db requests from game logic!
const findMemberWithId = function (members, searchedId) {
  return members.find(member => JSON.stringify(member._id) === JSON.stringify(searchedId))
}
const pullPlayerOutOfGuild = async function (playerId, guildId) {
  const foundGuild = await guildStore.findOneGuild(guildId)

  if (foundGuild) {
    //ASSUME [DB] -> fields that are ObjectId has name: '_id'
    if (foundGuild.members.count > 1) {
      guildStore.removePlayerFromMembers(foundGuild._id, playerId)

      //ASSUME [GAMEPLAY] wont loose guild if founder leave
      const { role } = findMemberWithId(foundGuild.members, playerId)

      if (role === guildDomain.roles.ADMIN) {
        guildStore.giveNewRoleToAnyRandomWithOtherRole(guildDomain.roles.ADMIN, guildDomain.roles.SUB_ADMIN)
      }
    } else {
      //remove whole guild! this is the only member
      const removeResults = await guildStore.removeGuild(foundGuild._id)

      console.log("remove guild!", err, removeResults)
      chatMgr.RemoveNamespaceSocket(foundGuild.name)
    }
  }
  else {
    console.log('playe has no guild so far!');
  }
}
const findMyGuild = function (id, resultCallback) {
  //remove this for guildStore!
  const playerId = store.ObjectId(id)
  guild.findOne(
    {
      members:
      {
        $elemMatch: { _id: playerId }
      }
    },
    resultCallback
  )
}
const gameplay = {
  setRole: async function (memberId, newRole, playerId) {
    return new Promise(resolve => {

      //verify if req user is admin
      //verify if new role is admin/subadmin/member
      //set memberIu new role
      const { result } = await guildStore.findGuildOfPlayer(playerId)
      console.log(result);

      const selfMember = findMemberWithId(result.members, playerId)

      if (selfMember.role === guildDomain.roles.ADMIN && (
        newRole === guildDomain.roles.ADMIN || newRole === guildDomain.roles.SUB_ADMIN || newRole === guildDomain.roles.MEMBER
      )) {
        const result = await guildStore.giveRoleForPlayer(memberId, newRole)

        resolve(response(result.err, result.findedUser))
      }
    })
  },
  requestDecision: function (decisionId, decision) {
    return new Promise(resolve => {
      console.log('my decision: ' + decision)
      console.log('id: ' + decisionId)

      //find request!
      // const requestIdObject = store.ObjectId(decisionId)

      if (decision === 'accept') {
        const request = await guildStore.findOneGuild(decisionId)
        const result = await guildStore.findGuildOfPlayer(request.playerId)

        if (result) {
          pullPlayerOutOfGuild(request.playerId, result._id)
        }

        const result = await guildStore.addPlayerWithRole(request.guildId, request.playerId, guildDomain.roles.MEMBER)
      }
      else if (decision === 'deny') {
        //for now - do nth, just remove request from db in both cases

      }
      const results = await guildStore.removeDecision(decisionId)
      resolve(results)
    })
  },
  ask: function (guildId, playerId) {
    //ASSUME [GAMEPLAY] cannot try join to same guild!
    return new Promise(resolve => {
      console.log('*** ask id ***')
      console.log('guild id: ' + guildId)
      //new entry with ask (can ask any nums of guild same time!)

      const { total } = await guildStore.findJoinRequests(guildId, playerId)

      if (total < 1) {
        const newRequest = await guildStore.addJoinRequest(guildId, playerId)
        resolve(newRequest)
      } else {
        resolve(response({ msg: 'Already sign up!' }, undefined))
      }
      console.log('*** ask id END ***')
    })
  },
  deleteGuild: function (guildId) {
    return new Promise(resolve => {

      console.log("*** DELETE ***")
      console.log('guild id: ' + guildId)

      //only delete this guild, where player has admin priviliges!
      const findResult = await guildStore.findOneGuild(guildId)
      chatMgr.RemoveNamespaceSocket(findResult.name)

      const result = await guildStore.removeGuild(guildId)
      resolve(response(result.err, result.result))

      console.log("*** DELETE END ***")
    })
  },
  createGuild: function (playerId, guildName) {
    return new Promise(resolve => {
      console.log('CREATE NEW GUILD')
      const { total } = await guildStore.findGuildByName(guildName)

      if (total < 1) {
        const myGuild = await guildStore.findGuildOfPlayer(playerId)

        //player already has a guild!
        if (myGuild) {
          pullPlayerOutOfGuild(playerId, myGuild._id)
        }
        const result = await guildStore.insertNewGuild(guildName, playerId, guildDomain.roles.ADMIN)

        if (result.err) {
          resolve(response(result.err, undefined))
        }
        else {
          chatMgr.AddNamespaceSocket(guildName)
          resolve(response(undefined, result.result))
        }
      } else {
        resolve(response({ msg: 'guild with that name already exists!' }, undefined))
      }
    })
  },
  myGuild: function (playerId) {
    return new Promise(resolve => {

      console.log("*** MY ***");
      //search only for playerguild
      findMyGuild(playerId,
        (err, result) => {
          if (err) { resolve(response(err, undefined)) }
          if (result) {

            const selfMember = findMemberWithId(result.members, playerId)
            if (selfMember.role === 'admin' || selfMember.role === 'subadmin') {
              guild.find({
                guildId: result._id
              }).toArray((errRequests, requests) => {
                if (err || errRequests) {
                  resolve(response({ err, errRequests }, undefined))
                } else {
                  console.log(requests.data);
                  //TODO WTF wait COunter ? make it async await!
                  let waitCounter = 0
                  result.members.forEach(member => {
                    waitCounter += 1
                    playerUtil.idToName(member._id, (err, data) => {
                      waitCounter -= 1
                      member.name = data.name
                      console.log(data.name);
                      if (waitCounter == 0) {
                        resolve(response(undefined, { guild: result, requests: requests }))
                      }
                    })
                  })
                }
              })
            }
            else {
              //JUST send my guild data
              if (err) {
                resolve(response(err, undefined))
              } else {
                let waitCounter = 0
                //FEATURE [far] porwania innych graczy ale tlyko z guildi żeby miał ich kto odbijać! Musi być fun dla obu stron! zostawianie śladów, info że się przemieszczsacie dla porwanego
                result.members.forEach(member => {
                  waitCounter += 1
                  playerUtil.idToName(member._id, (err, data) => {
                    waitCounter -= 1
                    member.name = data.name
                    console.log(data.name);
                    if (waitCounter == 0) {
                      resolve(response(undefined, { guild: result }))
                    }
                  })
                })
              }
            }
          }
          else {
            //there is no guild
            resolve(response({ msg: 'No guild Data' }, undefined))
          }
        })
    })
  },
  allGuilds: function () {
    return new Promise(resolve => {
      console.log("*** ALL ***");

      guild.find({ name: { $exists: true } }).toArray((err, result) => {
        resolve(response(err, result))
      })
    })
  },
}

module.exports = gameplay