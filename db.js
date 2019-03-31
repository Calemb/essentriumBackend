var store = require('./local_modules/store.js')
store.connect((db) => {
    db
        .collection('accounts').insert({
            email: 'calemb@gmail.com',
            password: '1234'
        }, (err, response) => {
            if (err) { console.log(err) }
            console.log(response.ops[0])

            db.collection('players').insert({
                _id: response.ops[0]._id,
                name: 'sculpt0r'
            })
        })

})

// store.db.collection('travels')
