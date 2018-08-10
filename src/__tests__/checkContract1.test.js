const checkContract1 = require('../checkContract1')
const fs = require('fs')

jest.mock('../web3Utils')
const web3Utils = require('../web3Utils')

describe('checkContract1', () => {
  let receipt
  let web3

  beforeEach(() => {
    receipt = JSON.parse(fs.readFileSync('src/__fixtures__/receipt.json'))
    web3 = 'fake'
    web3Utils.getTransactionReceipt.mockImplementation(() => Promise.resolve({
      blockNumber: 123,
      contractAddress: receipt.contract_id
    }))
    web3Utils.getContract1Hash.mockImplementation(() => Promise.resolve(receipt.fingerprint))
    web3Utils.getBlock.mockImplementation(() => Promise.resolve({ timestamp: 10 }))
  })

  it('should verify contract', () => {
    const expectedResult = {
      pass: true,
      transactionDate: new Date(10000)
    }
    return checkContract1(web3, receipt)
    .then((result) => {
      expect(result).toEqual(expectedResult)
      expect(web3Utils.getTransactionReceipt).toHaveBeenCalledWith(
        web3,
        receipt.transaction_hash
      )
      expect(web3Utils.getContract1Hash).toHaveBeenCalledWith(web3, receipt.contract_id)
      expect(web3Utils.getBlock).toHaveBeenCalledWith(web3, 123)
    })
  })

  it('should return false if contract hash does not match fingerprint', () => {
    web3Utils.getContract1Hash.mockImplementation(() => Promise.resolve('other'))
    const expectedResult = {
      pass: false,
      messages: ['Smart contract does not match receipt fingerprint']
    }
    return checkContract1(web3, receipt)
    .then((result) => {
      expect(result).toEqual(expectedResult)
    })
  })

  it('should return false if transaction receipt contractAddress does not match contract', () => {
    web3Utils.getTransactionReceipt.mockImplementation(() => Promise.resolve({
      blockNumber: 123,
      contractAddress: 'other'
    }))
    const expectedResult = {
      pass: false,
      messages: ['Smart contract address does not match transaction']
    }
    return checkContract1(web3, receipt)
    .then((result) => {
      expect(result).toEqual(expectedResult)
    })
  })
})
