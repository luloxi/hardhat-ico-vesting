const { latestTime } = require("./latestTime")

async function increaseTime(duration) {
  await network.provider.send("evm_increaseTime", [duration])
  // Then, tell the blockchain to mine another block
  await network.provider.send("evm_mine", [])
}

/**
 * @param target time in seconds
 */
async function increaseTimeTo(target) {
  const now = await latestTime()

  if (target < now)
    throw Error(`Cannot increase current time(${now}) to a moment in the past(${target})`)
  const diff = target - now
  return increaseTime(diff)
}

const duration = {
  seconds: function (val) {
    return val
  },
  minutes: function (val) {
    return val * this.seconds(60)
  },
  hours: function (val) {
    return val * this.minutes(60)
  },
  days: function (val) {
    return val * this.hours(24)
  },
  weeks: function (val) {
    return val * this.days(7)
  },
  years: function (val) {
    return val * this.days(365)
  },
}

module.exports = {
  increaseTime,
  increaseTimeTo,
  duration,
}
