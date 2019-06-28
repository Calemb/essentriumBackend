const store = require('../../local_modules/store')
const news = store.db.collection('news')

const gameplay = {
  delete: (req, res, next) => {
    console.log('news id: ' + req.params.id)
    news.remove({ _id: store.ObjectId(req.params.id) }, (err, result) => {
      if (err) {
        res.json(err)
      }
      else {
        res.json(result)
      }
    })
  },
  get: (req, res, next) => {
    news.find({})
      .toArray((err, results) => {
        console.log('news sending...');

        if (err) {
          res.json(err)
        }
        else {
          res.json(results)
        }
      })
  },
  post: (req, res, next) => {

    const entry = {
      _id: store.ObjectId(req.body._id),
      title: req.body.title,
      content: req.body.content
    }

    news.updateOne(
      { _id: entry._id },
      { $set: entry },
      { upsert: true },
      (err, result) => {
        if (err) {
          res.json(err)
        }
        else {
          res.json({ result });
        }
      })
  }
}

module.exports = gameplay