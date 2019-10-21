const store = require('../local_modules/store')
const playerUtil = require('./player')
const guild = store.db.collection('guilds')
const chatMgr = require('../io-chat')
const response = require('./_response-structure')
//
// INNER FUNCTIONS
//
const findMemberWithId = function (members, searchedId) {
  return members.find(member => JSON.stringify(member._id) === JSON.stringify(searchedId))
}
const pullPlayerOutOfGuild = function (playerId, guildId) {
  guild.findOne({ _id: guildId }, (err, foundGuild) => {
    if (foundGuild) {
      const playerObjectId = store.ObjectId(playerId)
      //ASSUME [DB] -> fields that are ObjectId has name: '_id'
      if (foundGuild.members.count > 1) {
        //remove from members
        guild.updateOne({ _id: foundGuild._id }, {
          $pull: {
            members: { _id: playerObjectId }
          }
        })
        //ASSUME [GAMEPLAY] wont loose guild if founder leave
        const { role } = findMemberWithId(foundGuild.members, playerId)
        if (role === gameplay.ADMIN) {

          //give admin to any random SUBADMIN
          guild.updateOne({
            "members.role": gameplay.SUB_ADMIN
          },
            {
              $set: { "members.$.role": gameplay.ADMIN }
            }, (err, result) => {

              console.log("try to set admin to random person", result)
            })
        }
      } else {
        //remove whole guild! this is the only member
        guild.remove({ _id: foundGuild._id }, (err, removeResults) => {
          console.log("remove guild!", err, removeResults)
          chatMgr.RemoveNamespaceSocket(foundGuild.name)
        })
      }
    }
    else {
      console.log('playe has no guild so far!');
    }
  })
}
const findMyGuild = function (id, resultCallback) {
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
  setRole: function (memberId, newRole, playerId) {
    return new Promise(resolve => {

      //verify if req user is admin
      //verify if new role is admin/subadmin/member
      //set memberIu new role
      findMyGuild(playerId, (err, result) => {
        console.log(result);

        const selfMember = findMemberWithId(result.members, playerId)
        if (selfMember.role === gameplay.ADMIN && (
          newRole === gameplay.ADMIN || newRole === gameplay.SUB_ADMIN || newRole === gameplay.MEMBER
        )) {
          guild.updateOne({
            members: { $elemMatch: { _id: store.ObjectId(memberId) } }
          }, {
            $set: { 'members.$.role': newRole }
          }, (err, findedUser) => {
            resolve(response(err, findedUser))
          })
        }
      })
    })
  },
  requestDecision: function (decisionId, decision) {
    return new Promise(resolve => {

      console.log('my decision: ' + decision)
      console.log('id: ' + decisionId)
      //find request!
      const requestIdObject = store.ObjectId(decisionId)

      if (decision === 'accept') {
        guild.findOne({ _id: requestIdObject }, (err, request) => {

          //find player current guild
          guild.findOne({
            members:
            {
              $elemMatch: { _id: store.ObjectId(request.playerId) }
            }
          }, (err, result) => {
            if (result) {
              pullPlayerOutOfGuild(request.playerId, result._id)
            }
            guild.updateOne({ _id: request.guildId }, {
              $push: {
                "members": { _id: request.playerId, role: gameplay.MEMBER }
              }
            }, (err, results) => {
              console.log('modified' + results.modifiedCount, 'matched: ' + matchedCount)
            })
          })
        })
      }
      else if (decision === 'deny') {
        //for now - do nth, just remove request from db in both cases

      }

      guild.remove({ _id: store.ObjectId(decisionId) }, (err, result) => {
        resolve({ err, result })
      })
    })
  },
  ask: function (guildId, playerId, res) {
    //ASSUME [GAMEPLAY] cannot try join to same guild!
    return new Promise(resolve => {
      console.log('*** ask id ***')
      console.log('guild id: ' + guildId)
      //new entry with ask (can ask any nums of guild same time!)
      const entry = {
        guildId: store.ObjectId(guildId),
        playerId: store.ObjectId(playerId)
      }
      guild.find(entry).count((err, total) => {
        if (total < 1) {
          guild.insertOne(entry, (err, results) => {
            resolve(err, results)
          });
        } else {
          resolve(response({ msg: 'Already sign up!' }, undefined))
        }
      })
      console.log('*** ask id END ***')
    })
  },
  deleteGuild: function (guildId, playerId) {
    return new Promise(resolve => {

      console.log("*** DELETE ***")
      console.log('guild id: ' + guildId)
      console.log('player id ' + store.ObjectId(playerId))

      //only delete this guild, where player has admin priviliges!
      guild.findOne({
        _id: store.ObjectId(guildId)
      }, (err, findResult) => {
        chatMgr.RemoveNamespaceSocket(findResult.name)
      })
      guild.remove({
        _id: store.ObjectId(guildId),
        members: { _id: store.ObjectId(playerId), role: 'admin' }
      },
        (err, result) => {
          resolve(response(err, result))
        })
      console.log("*** DELETE END ***")
    })
  },
  createGuild: function (playerId, guildName) {
    return new Promise(resolve => {
      console.log('CREATE NEW GUILD')

      guild
        .find({ name: guildName })
        .count((err, total) => {
          if (total < 1) {
            findMyGuild(playerId, (err, myGuild) => {
              //player already has a guild!
              if (myGuild) {
                pullPlayerOutOfGuild(playerId, myGuild._id)
              }
              guild.insertOne(
                {
                  name: guildName,
                  members: [{
                    _id: playerId,
                    role: 'admin'
                  }]
                },
                (err, result) => {
                  if (err) { resolve(response(err, undefined)) }
                  else {
                    chatMgr.AddNamespaceSocket(guildName)
                    resolve(response(undefined, result))
                  }
                })
            })
          } else {
            resolve(response({ msg: 'guild with that name already exists!' }, undefined))
          }
        })
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

  //guild roles
  ADMIN: 'admin',
  SUB_ADMIN: 'subadmin',
  MEMBER: 'member'

}
module.exports = gameplay