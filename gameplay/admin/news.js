const store = require('../../local_modules/store.js')
const news = store.db.collection('news')

const gameplay = {
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
      title: req.body.title,
      content: req.body.content
    }
    news.insertOne(entry, (err, result) => {
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