const playerStore = require('../store/player')

//WORKING app layers
// 4 sekcje:
// 1. Routing (wystawiony endpoint w zależności od potrzeby) (ONLY RECALL CONTROLLER FUNCTION)
// 2. Logic/Controller (obsługa routingu) - obsługa endpointa, zeby w routingu nie trzymać logiki, tutaj obrabiamy dane (ALLOWED FRAMEWORK, NOT ALLOWED DOMAIN OR DB LOGIC)
//      new Promise
// 3. Domain/ Gameplay - obsługa faktycznej logiki gry, tutaj obrabiamy zależności między zdarzeniami (NOT ANLLOWED ANY APP/FRAMEWORK LOGIC)
// 4. Store - gadanie z bazą (NOT ALLOWED ANY LOGIC)

// czy query gada prosto do store (tak, tak działa AD. 2)
//   a tylko commandy przez domain ida (tak, commandy obowiązkowo przez AD. 3)?
// czy w pewnych wypadkach store nie bedzie musiał ogarniać wszystkich możliwch rodzajow zapytań per feature ? find, find one etc ?(będzie musiał)

const playerController = {
  GetPlayersList: function () {
    return new Promise(resolve => {
      playerStore.GetPlayersList().then(resolve);
    })
  },
  GetLoggedPlayerStats: function (req) {
    return new Promise(resolve => {
      playerStore.find(req.body._id, (err, result) => {
        resolve({ err, result })
      });
    })
  }
}


module.exports = playerController 