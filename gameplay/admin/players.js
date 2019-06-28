const store = require('../../local_modules/store')
const players = store.db.collection('players')
const accounts = store.db.collection('accounts')
//TODO make preview priviliges

const gameplay = {
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

    let newAccount = newPlayer.accountData[0];
    newAccount._id = store.ObjectId(newAccount._id)

    delete newPlayer.accountData;

    console.log(newAccount)
    console.log(newAccount._id)
    
    //WORKING DELETE 
    let updatingAccount =  gameplay.UpdateCollection(accounts, newAccount);
    let updatingPlayer = gameplay.UpdateCollection(players, newPlayer);
    let syncUpdate = await Promise.all([updatingAccount, updatingPlayer])

    res.json(syncUpdate);

  },
  UpdateCollection: (collection, newData) => {
    return new Promise(resolve => {
      collection.updateOne(
        { _id: newData._id },
        { $set: newData },
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