const store = require('../local_modules/store')

const guilds = store.db.collection('guilds')

const guild = {
  findJoinRequests: function (guildId, playerId) {
    const entry = {
      guildId: store.ObjectId(guildId),
      playerId: store.ObjectId(playerId)
    }

    return new Promise(resolve => {
      guilds.find(entry).count((err, total) => {
        resolve(err, total)
      })
    })
  },
  addJoinRequest: function (guildId, playerId) {
    return new Promise(resolve => {
      const entry = {
        guildId: store.ObjectId(guildId),
        playerId: store.ObjectId(playerId)
      }

      guilds.insertOne(entry, (err, results) => {
        resolve({ err, results })
      });
    })
  },
  removeDecision: function (decisionId) {
    return new Promise(resolve => {
      guilds.remove({ _id: store.ObjectId(decisionId) }, (err, result) => {
        resolve({ err, result })
      })
    })
  },
  addPlayerWithRole: function (guildId, playerId, role) {
    return new Promise(resolve => {
      guilds.updateOne({ _id: guildId }, {
        $push: {
          "members": { _id: playerId, role: role }
        }
      }, (err, results) => {
        // console.log('modified' + results.modifiedCount, 'matched: ' + matchedCount)
        resolve(results)
      })
    })
  },
  giveRoleForPlayer: function (memberId, newRole) {
    return new Promise(resolve => {
      guilds.updateOne({
        members: { $elemMatch: { _id: store.ObjectId(memberId) } }
      }, {
        $set: { 'members.$.role': newRole }
      }, (err, findedUser) => {
        resolve({ err, findedUser })
      })
    })
  },
  findGuildOfPlayer: function (playerId) {
    return new Promise(resolve => {
      const playerIdObject = store.ObjectId(playerId)

      guilds.findOne(
        {
          members:
          {
            $elemMatch: { _id: playerIdObject }
          }
        }, (err, result) => {
          resolve({ err, result })
        }
      )
    })
  },
  findOneGuild: function (guildId) {
    return new Promise(resolve => {
      const guildIdObject = store.ObjectId(guildId)
      guilds.findOne({ _id: guildIdObject }, (err, foundGuild) => {
        resolve(foundGuild)
      })
    })
  },
  removePlayerFromMembers: function (guildId, playerId) {
    const playerObjectId = store.ObjectId(playerId)

    guilds.updateOne({ _id: guildId }, {
      $pull: {
        members: { _id: playerObjectId }
      }
    })
  },
  giveNewRoleToAnyRandomWithOtherRole: function (newRole, oldRole) {
    guilds.updateOne({
      "members.role": newRole
    },
      {
        $set: { "members.$.role": oldRole }
      }, (err, result) => {
        console.log("try to set admin to random person", result)
      })
  },
  removeGuild: function (guildId) {
    return new Promise(resolve => {
      const guildId = store.ObjectId(guildId)
      
      guilds.remove({ _id: guildId }, (err, removeResults) => {
        resolve({ err, removeResults })
      })
    })
  }
}

module.exports = guild