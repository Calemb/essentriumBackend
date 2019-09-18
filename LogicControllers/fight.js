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
    if (fighters[0].hp <= 0 || fighters[1].hp <= 0) {
      return { msg: 'Cannot fight. One of  you is death!' }
    } else {

      const result = await gameplay.fastFightLogic(fighters[0], fighters[1])
      // await attacker
      // await defender

      // console.log(attacker)
      // console.log('should be synced!')
      // return { attacker: result[0], defender: result[0] }
      if (typeof result === 'undefined') {
        console.log('DRAW!');

      }
      return result
    }
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
  fastFightLogic: async function (attacker, defender) {

    // return new Promise(resolve => {

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

    const updateFighters = await Promise.all([
      gameplay.updatePlayerHp(attacker._id, attacker.hp),
      gameplay.updatePlayerHp(defender._id, defender.hp)
    ]);

    return { winner, rounds: round }
    // })
  },
  updatePlayerHp: function (_id, newHp) {
    return new Promise(resolve => {
      players.updateOne({ _id }, {
        $set: {
          hp: Math.max(newHp, 0)
        }
      }, () => {
        resolve()
      })
    })
  },
  dealDamage: function (attacker, defender) {
    console.log(attacker.strength)
    console.log(defender.toughness)
    console.log('hp: ', attacker.hp, defender.hp)

    let hitChance = dice.k20() * attacker.strength
    let dodgeChance = dice.k20() * defender.toughness

    console.log('attack :: defense', hitChance, dodgeChance)

    if (hitChance >= dodgeChance) {
      let damage = (attacker.strength * dice.k8()) - defender.toughness;
      defender.hp -= damage;

      console.log('damage,  Attaker, defender', damage, attacker.hp, defender.hp)

      if (defender.hp <= 0) {
        return attacker;
      }
    }
    return undefined;
  },
  fastFightEnded: function (req, res, next) {
    res.json({ _enemyId })
  }
}

module.exports = gameplay