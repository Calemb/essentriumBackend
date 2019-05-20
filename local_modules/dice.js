const dice = {
  k20: () => {
    return dice.random(20)
  },
  k8: () => {
    return dice.random(8)
  },
  random: (max) => {
    return Math.floor(Math.random() * Math.floor(max))
  }
}

module.exports = dice