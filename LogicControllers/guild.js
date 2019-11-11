const playerUtil = require('./player')
const chatMgr = require('../io-chat')
const response = require('./_response-structure')
const guildDomain = require('../domain/guild')

const guildStore = require('../store/guild')

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

const gameplay = {
  setRole: async function (memberId, newRole, playerId) {
    return new Promise(async resolve => {

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
  requestDecision: async function (decisionId, decision) {
    return new Promise(async resolve => {
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
    return new Promise(async resolve => {
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
    return new Promise(async resolve => {

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
    return new Promise(async resolve => {
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
          // console.log(result.result.result);

          chatMgr.AddNamespaceSocket(guildName)
          resolve(response(null, result.result.result))
        }
      } else {
        resolve(response({ msg: 'guild with that name already exists!' }, undefined))
      }
    })
  },
  myGuild: function (playerId) {
    return new Promise(async resolve => {

      //search only for playerguild
      let playerGuild = await guildStore.findGuildOfPlayer(playerId);
      if (playerGuild.err) { resolve(response(playerGuild.err, undefined)) }
      if (playerGuild.result) {
        playerGuild = playerGuild.result

        const selfMember = findMemberWithId(playerGuild.members, playerId)
        if (selfMember.role === guildDomain.roles.ADMIN || selfMember.role === guildDomain.roles.SUB_ADMIN) {
          const entries = await guildStore.findGuildEntries(playerGuild._id)
          let errRequests = entries.errRequests

          if (entries.err || errRequests) {
            resolve(response({ err, errRequests }, undefined))
          } else {
            //wait until all id will be turned into names
            const result = await Promise.all(
              playerGuild.members.map(
                member => playerUtil.IdToName(member._id)
              )
            )

            playerGuild.members.forEach(member => {
              member.name = result.filter(r => r._id == member._id).name
            })

            resolve(response(undefined, { guild: result, requests: entries }))
          }
        }
        else {
          //JUST send my guild data
          if (err) {
            resolve(response(err, undefined))
          } else {
            const result = await Promise.all(
              result.members.map(
                member => playerUtil.IdToName(member._id)
              )
            )

            forEach(member => {
              member.name = result.filter(r => r._id == member._id).name
            })

            resolve(response(undefined, { guild: result }))
          }
        }
      }
      else {
        //there is no guild
        resolve(response({ msg: 'No guild Data' }, undefined))
      }
    })
  },
  allGuilds: async function () {
    return new Promise(async resolve => {
      // console.log("*** ALL ***");
      const { err, result } = await guildStore.findExistingGuilds()
      // console.log(result)
      resolve(response(err, result))
    })
  },
}

module.exports = gameplay
//FEATURE [far] porwania innych graczy ale tlyko z guildi żeby miał ich kto odbijać! Musi być fun dla obu stron! zostawianie śladów, info że się przemieszczsacie dla porwanego