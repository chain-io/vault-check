const {
  getTransactionReceipt,
  getContract1Hash,
  getContract2Hash,
  getContract2Inputs,
  getBlock
} = require('../web3Utils')

jest.mock('ethereum-input-data-decoder')
const InputDataDecoder = require('ethereum-input-data-decoder')

describe('utils', () => {
  let web3
  let c1Inst
  let c2Inst

  beforeEach(() => {
    c1Inst = {
      getHash: jest.fn(callback => callback(null, 'fingerprint'))
    }
    c2Inst = {
      vault: jest.fn((uuid, callback) => callback(null, '0xfingerprint'))
    }
    web3 = {
      eth: {
        getTransactionReceipt: jest.fn((transactionId, callback) => callback(null, {
          blockNumber: 123,
          contractAddress: 'cAddress'
        })),
        contract: jest.fn(() => ({ at: () => c1Inst })),
        getBlock: jest.fn((blockNumber, callback) => callback(null, {
          timestamp: 10
        })),
        getTransaction: jest.fn((transactionId, callback) => callback(null, {
          input: 'fakeinput'
        }))
      }
    }
    InputDataDecoder.prototype.decodeData.mockImplementation(() => ({
      inputs: [
        '32c19b9a9ba94d53aa4af1b27f7b8fd800000000000000000000000000000000',
        'b273f8f3b9fa732c88129f5fd3a61e9df81ac26e93fe099d114478252c88b2fa'
      ]
    }))
  })
  describe('getTransactionReceipt', () => {
    it('should get receipt', () => {
      return getTransactionReceipt(web3, 'tID')
      .then((result) => {
        expect(result).toEqual({
          blockNumber: 123,
          contractAddress: 'cAddress'
        })
        expect(web3.eth.getTransactionReceipt).toHaveBeenCalledWith('tID', expect.any(Function))
      })
    })
    it('should reject on error', () => {
      web3.eth.getTransactionReceipt.mockImplementation(
        (tid, callback) => callback('some error', null)
      )
      return expect(getTransactionReceipt(web3, 'tID')).rejects.toEqual('some error')
    })
  })


  describe('getContract1Hash', () => {
    it('should get hash', () => {
      return getContract1Hash(web3, 'cID')
      .then((result) => {
        expect(result).toEqual('fingerprint')
        expect(web3.eth.contract).toHaveBeenCalledWith(expect.any(Array)) // this is the ABI
        expect(c1Inst.getHash).toHaveBeenCalledWith(expect.any(Function))
      })
    })
    it('should reject on error', () => {
      c1Inst.getHash.mockImplementation(callback => callback('some error', null))
      return expect(getContract1Hash(web3, 'cID')).rejects.toEqual('some error')
    })
  })

  describe('getContract2Hash', () => {
    beforeEach(() => {
      web3.eth.contract = jest.fn(() => ({ at: () => c2Inst }))
    })
    it('should get hash', () => {
      return getContract2Hash(web3, 'cID', 'uu-ID')
      .then((result) => {
        expect(result).toEqual('fingerprint')
        expect(web3.eth.contract).toHaveBeenCalledWith(expect.any(Array)) // this is the ABI
        expect(c2Inst.vault).toHaveBeenCalledWith('0xuuID', expect.any(Function))
      })
    })
    it('should reject on error', () => {
      c2Inst.vault.mockImplementation((uuid, callback) => callback('some error', null))
      return expect(getContract2Hash(web3, 'cID', 'uuID')).rejects.toEqual('some error')
    })
  })

  describe('getContract2Inputs', () => {
    it('should get inputs', () => {
      return getContract2Inputs(web3, 'tID')
      .then((result) => {
        expect(result).toEqual({
          attachment_uuid: '32c19b9a-9ba9-4d53-aa4a-f1b27f7b8fd8',
          fingerprint: 'b273f8f3b9fa732c88129f5fd3a61e9df81ac26e93fe099d114478252c88b2fa'
        })
      })
    })
  })


  describe('getBlock', () => {
    it('should get block', () => {
      return getBlock(web3, 123)
      .then((result) => {
        expect(result).toEqual({ timestamp: 10 })
        expect(web3.eth.getBlock).toHaveBeenCalledWith(123, expect.any(Function))
      })
    })
    it('should reject on error', () => {
      web3.eth.getBlock.mockImplementation((bn, callback) => callback('some error', null))
      return expect(getBlock(web3, 123)).rejects.toEqual('some error')
    })
  })
})
