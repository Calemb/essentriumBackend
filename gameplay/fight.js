const store = require('../local_modules/store')
const dice = require('../local_modules/dice')
const players = store.db.collection('players')

const gameplay = {
  fastFight: function (req, res, next) {
    try {
      gameplay.PrepareAndFight(req.body._id, req.body.enemyId, res)
        .then(result => {

          res.status(200).json(result)
        })
    } catch (e) {
      res.status(500).json({ msg: e })
    }
  },
  PrepareAndFight: async function (playerId, enemyId, res) {
    console.log(enemyId)
    const _enemyId = store.ObjectId(enemyId)
    const attacker = gameplay.GetPlayer(playerId);
    const defender = gameplay.GetPlayer(_enemyId);

    const fighters = await Promise.all([attacker, defender])
    const result = await gameplay.fastFightLogic(fighters[0], fighters[1])
    // await attacker
    // await defender

    // console.log(attacker)
    // console.log('should be synced!')
    // return { attacker: result[0], defender: result[0] }
    return result
  },
  GetPlayer: function (_id) {
    return new Promise(resolve => {
      players.findOne({ _id }, (err, result) => {
        if (err) {
          resolve(err)
        }
        else {
          // console.log(result);

          resolve(result)
        }
      });
    });
  },
  fastFightLogic: function (attacker, defender) {

    return new Promise(resolve => {

      const roundLimit = 20;
      let round = 0;
      let reverse = false;

      while (round < roundLimit) {
        if (reverse) {
          winner = gameplay.dealDamage(defender, attacker);
        } else {
          winner = gameplay.dealDamage(attacker, defender);
        }
        reverse = !reverse;

        if (typeof winner !== 'undefined') {
          console.log('We have a winner:' + winner)
          break;
        }

        round++
      }

      resolve({ winner, rounds: round })
    })
  },
  dealDamage: function (attacker, defender) {
    console.log(attacker.strength)
    console.log(defender.toughness)
    console.log('hp: ', attacker.hp, defender.hp)
    //WORKING throw a dice!

    let damage = attacker.strength * dice.k20() - defender.toughness;
    defender.hp -= damage;
    console.log('damage: ' + damage)
    if (defender.hp <= 0) {
      return attacker;
    } else {
      return undefined;
    }
  },
  fastFightEnded: function (req, res, next) {
    res.json({ _enemyId })
  }
}

module.exports = gameplay