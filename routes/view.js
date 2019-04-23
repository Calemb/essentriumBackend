const express = require('express');
const router = express.Router();
const store = require('../local_modules/store')

router.get('/:_id', function (req, res, next) {
    const viewId = req.params._id
    store.db.collection('players')
        .findOne(store.ObjectId(viewId),
            (err, result) => {
                res.json(result)
            });
});

module.exports = router;

