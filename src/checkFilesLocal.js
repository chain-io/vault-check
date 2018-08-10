const parseReceiptFileContent = require('./parseReceiptFileContent')
const sha256 = require('js-sha256').sha256
const fs = require('fs')

module.exports = (localFilePath, localReceiptPath) => {
  const localReceipt = parseReceiptFileContent(fs.readFileSync(localReceiptPath))
  const localFileHash = sha256(fs.readFileSync(localFilePath))
  if (localReceipt.fingerprint === localFileHash) {
    return { pass: true, messages: [] }
  } else {
    return { pass: false, messages: ['Local receipt did not match file fingerprint.'] }
  }
}
