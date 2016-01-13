var util = {}

util.sleep = (ms) => {
  return new Promise((r) => {setTimeout(r, ms)})
}

export default utils
