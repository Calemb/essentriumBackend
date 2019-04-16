var store = require('./local_modules/store.js')
store.connect((db) => {
    db
        .collection('accounts').insert({
            email: 'fake@gmail.com',
            password: '1234'
        }, (err, response) => {
            if (err) { console.log(err) }
            console.log(response.ops[0])

            db.collection('players').insert({
                _id: response.ops[0]._id,
                name: 'fake Name'
            })
            db.collection('travels').insert({
                _id: response.ops[0]._id,
                coords: { x: 0, y: 0, z: 0 },
                innerCoords: { x: 0, y: 0, z: 0 }
            })
        })

})

