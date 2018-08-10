const checkContract2 = require('../checkContract2')
const fs = require('fs')

jest.mock('../web3Utils')
const web3Utils = require('../web3Utils')

describe('checkContract2', () => {
  let receipt
  let web3
  beforeEach(() => {
    receipt = JSON.parse(fs.readFileSync('src/__fixtures__/receipt2.json'))
    web3 = 'fake'
    web3Utils.getTransactionReceipt.mockImplementation(() => Promise.resolve({
      blockNumber: 123,
      to: receipt.contract_id
    }))
    web3Utils.getBlock.mockImplementation(() => Promise.resolve({ timestamp: 10 }))
    web3Utils.getContract2Hash.mockImplementation(() => Promise.resolve(receipt.fingerprint))
    web3Utils.getContract2Inputs.mockImplementation(() => Promise.resolve({
      attachment_uuid: receipt.attachment_uuid,
      fingerprint: receipt.fingerprint
    }))
  })

  it('should pass if everything matches', () => {
    const expectedResult = {
      pass: true,
      transactionDate: new Date(10000)
    }
    return checkContract2(web3, receipt)
    .then((result) => {
      expect(result).toEqual(expectedResult)
      expect(web3Utils.getTransactionReceipt).toHaveBeenCalledWith(
        web3,
        receipt.transaction_hash
      )
      expect(web3Utils.getContract2Hash).toHaveBeenCalledWith(
        web3,
        receipt.contract_id,
        receipt.attachment_uuid
      )
      expect(web3Utils.getBlock).toHaveBeenCalledWith(web3, 123)
    })
  })
  it('should fail if transaction data does not match the fingerprint', () => {
    web3Utils.getContract2Inputs.mockImplementation(() => Promise.resolve({
      attachment_uuid: receipt.attachment_uuid,
      fingerprint: 'other'
    }))
    return checkContract2(web3, receipt)
    .then((result) => {
      expect(result.pass).toEqual(false)
      expect(result.messages).toEqual(['Transaction does not match receipt fingerprint'])
    })
  })
  it('should fail if transaction does not match contract', () => {
    web3Utils.getContract2Hash.mockImplementation(() => Promise.resolve('other'))
    return checkContract2(web3, receipt)
    .then((result) => {
      expect(result.pass).toEqual(false)
      expect(result.messages).toEqual(['Smart contract does not match receipt fingerprint'])
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
    return checkContract2(web3, receipt)
    .then((result) => {
      expect(result).toEqual(expectedResult)
    })
  })
})
