module.exports = (content) => {
  let r
  try {
    r = JSON.parse(content)
  } catch (err) {
    throw new Error('Receipt must be a JSON file.')
  }
  if (!r.fingerprint) {
    throw new Error('Receipt must contain a fingerprint')
  }
  return r
}
