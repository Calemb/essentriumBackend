const travelDomain = require('../domain/travel')

const response = require('./_response-structure')

const campStore = require('../store/camp')
const travelStore = require('../store/travel')


const travelController = {
  GetTravelData: async function (req) {
    return new Promise(resolve => {
      const travelCoords = await travelStore.find(req.body._id);

      let err = travelCoords.err
      let travelResult = travelCoords.result

      if (err) {
        resolve(response(err, undefined))
      }
      else {
        const campData = await campStore.find({ owner: req.body._id });

        let err = campData.err
        let campResult = campData.result

        if (err) {
          resolve(response(err, undefined))
        }
        else {
          resolve(response(undefined, {
            coords: travelResult ? travelResult.coords : {},
            coordsInner: travelResult ? travelResult.coordsInner : {},
            camp: campResult
          }))
        }
      }
    })
  },
  PostTravelData: async function (req) {
    return new Promise(resolve => {

      const requestedChange = req.body.direction
      if (requestedChange) {
        const results = await changeDirection(req, requestedChange);
        resolve(response(results))
      }
    })
  },
  SetupCamp: function (req) {
    return new Promise(resolve => {

      const id = req.body._id
      let travelCoords = await travelStore.find(id)
      let err = travelCoords.err
      let result = travelCoords.result

      if (err) { resolve({ err, undefined }) }
      else {
        const coords = result.coords
        travelCoords = await travelStore.find(coords)

        err = travelCoords.err
        result = travelCoords.result

        if (err) { resolve({ err, undefined }) }
        else if (!result) {
          //insert new if possible
          travelCoords = await campStore.insert(id, coords)
          let err = travelCoords.err
          let result = travelCoords.result

          resolve(response(err, result))
        }
      }
    })
  }
}

changeDirection = async (req, requestedChange) => {
  return new Promise(resolve => {

    const inner = travelDomain.GetInnerConstraints()

    const foundTravel = await travelStore.find(req.body._id)

    let err = foundTravel.err
    let travelCoords = foundTravel.result

    const result = travelCoords || travelDomain.GetZeroCoords()

    travelDomain.Init(result.coords, result.coordsInner)
    var updateObject = {};

    if (req.body.inner) {
      travelDomain.MoveInner(requestedChange)
      updateObject.coordsInner = travelDomain.coordsInner
    } else {
      updateObject.coords = travelDomain.coords;
      updateObject.coordsInner = travelDomain.inner;
    }

    console.table(updateObject)

    const upsert = await travelStore.upsert(
      { '_id': req.body._id },
      updateObject
    )
    resolve(response(undefined, updateObject))
  })

}


module.exports = travelController 