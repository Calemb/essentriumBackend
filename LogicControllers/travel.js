const travelDomain = require('../domain/travel')
const campStore = require('../store/camp')
const travelStore = require('../store/travel')


const travelController = {
  GetTravelData: function (req) {
    return new Promise(resolve => {
      travelStore.find(req.body._id).then(results => {

        let err = results.err
        let travelResult = results.result

        if (err) {
          resolve(err)
        }
        else {
          campStore.find({ owner: req.body._id }).then(result => {
            let err = result.err
            let campResult = result.result

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
      })

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
  const inner = travelDomain.GetInnerConstraints()

  travelStore.find(req.body._id).then(foundTravel => {

    let err = foundTravel.err
    let results = foundTravel.result

    const result = results || travelDomain.GetZeroCoords()

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

    travelStore.upsert(
      { '_id': req.body._id },
      updateObject).then(results => {
        res.json(updateObject)
      })
  })
}


setupCamp = (id, res) => {
  travelStore.find(id).then(results => {//=> find my coords
    let err = results.err
    let result = results.result

    if (err) { res.json(err) }
    else {
      const coords = result.coords
      travelStore.find(coords).then(results => {//find camp at my current coords
        err = results.err
        result = results.result

        if (err) { res.json(err) }
        else if (!result) {
          //insert new if possible
          campStore.insert(id, coords).then(results => {
            let err = results.err
            let result = results.result

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


module.exports = travelController 