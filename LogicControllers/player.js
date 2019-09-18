const stats = require('../store/player')

//WORKING app layers
// 4 sekcje:
// 1. Routing (wystawiony endpoint w zależności od potrzeby) (ONLY RECALL CONTROLLER FUNCTION)
// 2. Logic/Controller (obsługa routingu) - obsługa endpointa, zeby w routingu nie trzymać logiki (ALLOWED FRAMEWORK, NOT ALLOWED DOMAIN OR DB LOGIC)
// 3. Domain/ Gameplay - obsługa faktycznej logiki gry (NOT ANLLOWED ANY APP/FRAMEWORK LOGIC)
// 4. Store - gadanie z bazą (NOT ALLOWED ANY LOGIC)

// czy query gada prosto do store (tak, tak działa AD. 2)
//   a tylko commandy przez domain ida (tak, commandy obowiązkowo przez AD. 3)?
// czy w pewnych wypadkach store nie bedzie musiał ogarniać wszystkich możliwch rodzajow zapytań per feature ? find, find one etc ?(będzie musiał)

const playerController = {
  GetLoggedPlayerStats: function (req, res, next) {
    stats.find(req.body._id, (err, result) => {
      res.json(result)
    });
  },
  idToName: function (playerId, callback) {
    stats.find(playerId, callback)
  }
}


module.exports = playerController 