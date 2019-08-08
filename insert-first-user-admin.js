const store = require('./local_modules/store.js')
const bcrypt = require('bcrypt')
var argv = require('yargs')
    .usage('Usage: $0 -u [mail] -p [password] -n [name]')
    .demandOption(['u', 'p', 'n'])
    .argv;

// take mail & input password
//WORKING - make this script first entry to db with admin user! run it with parameter to not store password in git!
//https://www.npmjs.com/package/yargs

//FEATURE translate to other langs: https://github.com/projectfluent/fluent.js
const email = argv.u

const name = argv.n
let hashPass = ''
bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(argv.p, salt, function (err, hash) {
        // Store hash in your password DB.
        hashPass = hash
    })
})

const accountData = {
    email: email,
    password: hashPass
}
const playerData = (id) => {
    const obj = {
        name: name,
        hp: 10,
        strength: 1.0,
        toughness: 1.0,
        willpower: 1.0
    }

    if (id != '') { obj._id = id }
    return obj
}
// const travelData = (id) => {
//     const obj = {
//         coords: { x: 0, y: 0, z: 0 },
//         innerCoords: { x: 0, y: 0, z: 0 }
//     }

//     if (id != '') { obj._id = id }
//     return obj
// }
const insertFakePlayer = (db) => {
    db.collection('accounts')
        .insert(accountData,
            (err, response) => {
                if (err) { console.log(err) }
                console.log(response.ops[0])
                db.collection('players').insert(playerData(response.ops[0]._id))
                // db.collection('travels').insert(travelData(response.ops[0]._id))
            })
}

// const upsertAllPlayers = (db) => {
//     // db.collection('accounts').update({}, accountData)
//     // db.collection('accounts').updateOne({}, { email: 'calemb@gmail.com' , password: '1234'})
//     db.collection('players').updateMany({},
//         { $set: playerData('') },
//         (err, result) => {
//             console.log(result.result)
//         })
//     db.collection('travels').updateMany({},
//         { $set: travelData('') },
//         (err, result) => {
//             console.log(result.result)
//         })
// }
store.connect(insertFakePlayer)
// store.connect(upsertAllPlayers)

