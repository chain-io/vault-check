const web3Utils = require('./web3Utils')

module.exports = (web3, receipt) => {
  const contractID = receipt.contract_id
  const transactionID = receipt.transaction_hash

  return web3Utils.getTransactionReceipt(web3, transactionID)
  .then(trec => Promise.all([trec, web3Utils.getContract1Hash(web3, contractID)]))
  .then(([trec, cHash]) => Promise.all([trec, cHash, web3Utils.getBlock(web3, trec.blockNumber)]))
  .then(([trec, cHash, block]) => {
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
