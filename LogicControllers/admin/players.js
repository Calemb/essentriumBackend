const store = require('../../local_modules/store')
const players = store.db.collection('players')
const accounts = store.db.collection('accounts')
const gameplay = {
  deletePlayer: async (req, res, next) => {
    //TODO delete all player data!!!! account, own things etc.....!!!
    let _id = req.params.id;
    console.log("id to del: " + _id);

    let deleteAccount = await gameplay.DeleteDocument(accounts, _id)
    let deletePlayer = await gameplay.DeleteDocument(players, _id)
    let deleteSync = await Promise.all([deleteAccount, deletePlayer])
    res.json(deleteSync);

  },
  getPlayers: (req, res, next) => {
    players.aggregate([
      {
        $lookup: {
          from: 'accounts',
          localField: '_id',
          foreignField: '_id',
          as: 'accountData'
        }
      }
    ])
      .toArray((err, result) => {
        if (err) { res.json(err) }
        else {
          res.json(result)
        }
      })
  },
  postPlayer: async (req, res, next) => {
    let newPlayer = req.body.updatedPlayer
    newPlayer._id = store.ObjectId(newPlayer._id)
    console.log('newPlayer._id' + newPlayer._id);


    let newAccount = newPlayer.accountData[0];
    console.log('account._id' + newAccount._id);
    if (typeof (newAccount._id) == 'undefined') {
      newAccount._id = newPlayer._id;
    } else {

      newAccount._id = store.ObjectId(newAccount._id)
    }

    console.log('account._id' + newAccount._id);

    delete newPlayer.accountData;
    updatingAccount = gameplay.UpdateCollection(accounts, newAccount);


    let updatingPlayer = gameplay.UpdateCollection(players, newPlayer);
    let syncUpdate = await Promise.all([updatingAccount, updatingPlayer])

    res.json(syncUpdate);

  },
  DeleteDocument: (collection, _id) => {
    return new Promise(resolve => {
      collection.remove({ _id: store.ObjectId(_id) }, (err, result) => {
        resolve({ err, result })
      })
    })
  },

  UpdateCollection: (collection, newData) => {
    console.log(newData)
    return new Promise(resolve => {
      collection.replaceOne(
        { _id: newData._id },
        newData,
        { upsert: true },
        (err, result) => {
          if (err) { resolve(err) }
          else {
            resolve(result)
          }
        }
      )
    })
  }
}

module.exports = gameplay