const Web3 = require('web3')
const fs = require('fs')
const checkFilesLocal = require('./checkFilesLocal')
const checkContract1 = require('./checkContract1')
const checkContract2 = require('./checkContract2')
const parseReceiptFileContent = require('./parseReceiptFileContent')

const checkRemote = (serviceProvider, localReceipt) => {
  const receipt = parseReceiptFileContent(fs.readFileSync(localReceipt))
  const web3 = new Web3(new Web3.providers.HttpProvider(serviceProvider))
  switch (receipt.contract_version) {
    case '2.0':
      return checkContract2(web3, receipt)
    default:
      return checkContract1(web3, receipt)
  }
}

module.exports = (serviceProvider, localFile, localReceipt) => {
  return new Promise((resolve) => {
    resolve(checkFilesLocal(localFile, localReceipt))
  })
  .then((localResult) => {
    if (!localResult.pass) return localResult

    return checkRemote(serviceProvider, localReceipt)
  })
}
