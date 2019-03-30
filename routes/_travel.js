const express = require('express')
const router = express.Router()
const store = require('../local_modules/store.js')
const travel = store.db.collection('travels')
const camps = store.db.collection('camps')

router.get('/', (req, res, next) => {
  // console.table(req.body)
  travel.findOne(req.body._id, (err, travelResult) => {
    camps.findOne({ owner: req.body._id }, (err, campResult) => {

      res.json({
        coords: travelResult.coords,
        coordsInner: travelResult.coordsInner,
        camp: campResult
      })
    })
  });
});

router.post('/', (req, res, next) => {
  const requestedChange = req.body.direction
  const camp = req.body.camp
  if (requestedChange) {

    changeDirection();
  }

  if (camp) {

    setupCamp(req.body._id, res);
  }

})

changeDirection = () => {
  const inner = { minX: 0, maxX: 9, minY: 0, maxY: 9 }

  travel.findOne(req.body._id, (err, result) => {
    const directionToCoords = {
      'N': {
        delta: { x: 0, y: 1, z: 0 },
        inner: { x: result.coordsInner.x, y: inner.maxY }
      },
      'S': {
        delta: { x: 0, y: -1, z: 0 },
        inner: { x: result.coordsInner.x, y: inner.minY }
      },
      'E': {
        delta: { x: 1, y: 0, z: 0 },
        inner: { x: inner.minX, y: result.coordsInner.y }
      },
      'W': {
        delta: { x: -1, y: 0, z: 0 },
        inner: { x: inner.maxX, y: result.coordsInner.y }
      },
      'UP': {
        delta: { x: 0, y: 0, z: -1 },
        inner: result.coordsInner
      },
      'DOWN': {
        delta: { x: 0, y: 0, z: 1 },
        inner: result.coordsInner
      }
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
      result.coords.z += translate.z;
      console.log(result.coords.z)
      if (isNaN(result.coords.z))
        result.coords.z = 0;

      updateObject.coords = result.coords;
      updateObject.coordsInner = directionToCoords[requestedChange].inner;
    }

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
}

setupCamp = (id, res) => {
  travel.findOne(id, (err, result) => {//=> find my coords

    if (err) { res.json(err); }
    else {
      const coords = result.coords
      travel.findOne(coords, (err, result) => {//find camp at my current coords
        if (err) { res.json(err) }
        else if (!result) {
          //insert new if possible
          camps.
            insertOne({
              owner: id,
              coords,
            }, (err, result) => {
              if (err) { res.json(err) }
              else {
                res.json(result)
              }
            })
        }
      });
    }
  });
}

module.exports = router;
