const express = require('express')
const router = express.Router()
const store = require('../local_modules/store.js')
const travel = store.db.collection('travels')

router.get('/', (req, res, next) => {
    // console.table(req.body)
    travel.findOne(req.body._id, (err, result) => {
        res.json({
            coords: result.coords,
            coordsInner: result.coordsInner
        })
    });
});

router.post('/', (req, res, next) => {
    const requestedChange = req.body.direction
    const inner = { minX: 0, maxX: 9, minY: 0, maxY: 9 }

    travel.findOne(req.body._id, (err, result) => {
        const directionToCoords = {
            'N': {
                delta: { x: 0, y: 1 },
                inner: { x: result.coordsInner.x, y: inner.maxY }
            },
            'S': {
                delta: { x: 0, y: -1 },
                inner: { x: result.coordsInner.x, y: inner.minY }
            },
            'E': {
                delta: { x: 1, y: 0 },
                inner: { x: inner.minX, y: result.coordsInner.y }
            },
            'W': {
                delta: { x: -1, y: 0 },
                inner: { x: inner.maxX, y: result.coordsInner.y }
            },
        }
        const translate = directionToCoords[requestedChange].delta;
        var updateObject = {};
        // var newCoords;

        if (req.body.inner) {
            console.table(result.coordsInner)
            result.coordsInner.x += translate.x;
            console.table(result.coordsInner)
            result.coordsInner.x = Math.max(Math.min(result.coordsInner.x, inner.maxX), inner.minX);

            result.coordsInner.y += translate.y;
            result.coordsInner.y = Math.max(Math.min(result.coordsInner.y, inner.maxY), inner.minY);

            updateObject.coordsInner = result.coordsInner;
        } else {
            result.coords.x += translate.x;
            result.coords.y += translate.y;

            updateObject.coords = result.coords;
            updateObject.coordsInner = directionToCoords[requestedChange].inner;
            // newCoords = result.coords;
        }
        // if (typeof newCoords === 'undefined') {
        //     newCoords = { x: 0, y: 0 };
        // }

        // var updateObject = {};
        // newCoords.x += translate.x;
        // newCoords.y += translate.y;

        // if (req.body.inner) {
        //     newCoords.x = Math.max(Math.min(newCoords.x, 9), 0);
        //     newCoords.y = Math.max(Math.min(newCoords.y, 9), 0);

        //     updateObject.coordsInner = newCoords;
        // }
        // else {
        //     updateObject.coords = newCoords;
        //     updateObject.coordsInner = 
        // }
        console.table(updateObject)

        travel.updateOne(
            { '_id': req.body._id },
            { $set: updateObject },
            { upsert: true },
            (err, result) => {
                // console.log(err, result)
                res.json(updateObject)
            })
    })

})

module.exports = router;
