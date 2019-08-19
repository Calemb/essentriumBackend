const store = require('../local_modules/store.js')
const bcrypt = require('bcrypt')
const yargs = require('yargs')

let deletePlayer = function (argv) {
  const email = argv.email
  let search = {}
  if (typeof email != 'undefined') {
    search.email = email
  }
  console.log(search);

  store.connect((db) => deletePlayerDb(search, db))

}


// //https://www.npmjs.com/package/yargs


const deletePlayerDb = (search, db) => {
  db.collection('accounts').findOne(search, (err, foundAccount) => {
    if (err) {
      console.log(err);
    } else if (foundAccount) {

      db.collection('accounts').remove({ _id: foundAccount._id })
      db.collection('players').remove({ _id: foundAccount._id })
    }
    else {
      console.log("There is no account!");
    }
  })
  //   .insert(accountData,
  //     (err, response) => {
  //       if (err) { console.log(err) }
  //       console.log(response.ops[0])
  //       db.collection('players').insert(playerData(response.ops[0]._id, name))
  //       // db.collection('travels').insert(travelData(response.ops[0]._id))
  //     })
}

yargs.command({
  command: 'delete',
  usage: 'Usage: $0 <command> [options]',
  builder: {
    email: {
      describe: 'Account email',
      demandOption: false,
      type: String
    }
  },
  handler: deletePlayer
})

yargs.parse()