const web3Utils = require('./web3Utils')

module.exports = (web3, receipt) => {
  const contractID = receipt.contract_id
  const transactionID = receipt.transaction_hash

  return web3Utils.getTransactionReceipt(web3, transactionID)
  .then((trec) => Promise.all([
    trec,
    web3Utils.getContract2Hash(web3, contractID, receipt.attachment_uuid)
  ]))
  .then(([trec, cHash]) => Promise.all([trec, cHash, web3Utils.getBlock(web3, trec.blockNumber)]))
  .then(([trec, cHash, block]) => Promise.all([
    trec,
    cHash,
    block,
    web3Utils.getContract2Inputs(web3, transactionID)
  ]))
  .then(([trec, cHash, block, inputs]) => {
    if (inputs.fingerprint !== receipt.fingerprint) {
      return {
        pass: false,
        messages: ['Transaction does not match receipt fingerprint']
      }
    }

    if (cHash !== receipt.fingerprint) {
      return {
        pass: false,
        messages: ['Smart contract does not match receipt fingerprint']
      }
    }

    if (trec.contractAddress !== contractID) {
      return {
        pass: false,
        messages: ['Smart contract address does not match transaction']
      }
    }

    return {
      pass: true,
      transactionDate: new Date(block.timestamp * 1000)
    }
  })
}
