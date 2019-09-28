const campStore = require('../store/camp')

// wywal store z tego miejsca -> DONE
// dodaj promisy do storowych zapytan
// rozdziel API pointy travel od camps
// moze tutaj uda sie wydobyc obiekty dziedziny? + clean up na kodzie z travela

const campController = {
  GetTravelData: function (req) {
    return new Promise(resolve => {
      travelStore.find(req.body._id, (err, travelResult) => {
        if (err) {
          resolve(err)
        }
        else {
          campStore.find(
            { owner: req.body._id },
            (err, campResult) => {
              if (err) {
                resolve(err)
              }
              else {
                resolve({
                  coords: travelResult ? travelResult.coords : {},
                  coordsInner: travelResult ? travelResult.coordsInner : {},
                  camp: campResult
                })
              }
            })
        }
      });

    })
  },
  PostTravelData: function (req) {
    const requestedChange = req.body.direction
    const camp = req.body.camp
    if (requestedChange) {

      changeDirection(req, res, requestedChange);
    }

    if (camp) {

      setupCamp(req.body._id, res);
    }
  }
}

changeDirection = (req, res, requestedChange) => {
  const inner = { minX: 0, maxX: 9, minY: 0, maxY: 9 }

  travelStore.find(req.body._id, (err, results) => {
    const result = results || {
      coords: { x: 0, y: 0, z: 0 },
      coordsInner: { x: 0, y: 0, z: 0 }
    }
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

    travelStore.upsert(
      { '_id': req.body._id },
      updateObject,
      (err, result) => {
        // console.log(err, result)
        res.json(updateObject)
      })
  })
}


setupCamp = (id, res) => {
  travelStore.find(id, (err, result) => {//=> find my coords

    if (err) { res.json(err); }
    else {
      const coords = result.coords
      travelStore.find(coords, (err, result) => {//find camp at my current coords
        if (err) { res.json(err) }
        else if (!result) {
          //insert new if possible
          campStore.insert(
            id,
            coords,
            (err, result) => {
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


module.exports = campController 