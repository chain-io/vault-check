const fs = require('fs')
const checkFiles = require('../checkFiles')

jest.mock('web3')
const Web3 = require('web3')

jest.mock('../checkContract1')
const checkContract1 = require('../checkContract1')

jest.mock('../checkContract2')
const checkContract2 = require('../checkContract2')

describe('checkFiles', () => {
  const localFile = 'src/__fixtures__/sample.txt'
  const localReceipt1 = 'src/__fixtures__/receipt.json'
  const localReceipt2 = 'src/__fixtures__/receipt2.json'
  const serviceProvider = 'https://fake/sp'

  beforeEach(() => {
    checkContract1.mockImplementation(() => Promise.resolve({ pass: true }))
    checkContract2.mockImplementation(() => Promise.resolve({ pass: true }))
  })

  it('should return false if local files do not match', () => {
    return checkFiles(serviceProvider, 'src/__fixtures__/badsample.txt', localReceipt1)
    .then((result) => {
      expect(result.pass).toBe(false)
      expect(result.messages).toEqual(['Local receipt did not match file fingerprint.'])
    })
  })

  it('should check contract 1', () => {
    return checkFiles(serviceProvider, localFile, localReceipt1)
    .then((result) => {
      expect(result.pass).toBe(true)
      expect(checkContract1).toHaveBeenCalledWith(
        expect.any(Web3),
        JSON.parse(fs.readFileSync(localReceipt1))
      )
    })
  })

  it('should return false if contract 1 returns false', () => {
    const expectedResult = {
      pass: false,
      messages: ['Remote smart contract did not match receipt.']
    }
    checkContract1.mockImplementation(() => Promise.resolve(expectedResult))
    return checkFiles(serviceProvider, localFile, localReceipt1)
    .then((result) => {
      expect(result).toEqual(expectedResult)
      expect(checkContract1).toHaveBeenCalledWith(
        expect.any(Web3),
        JSON.parse(fs.readFileSync(localReceipt1))
      )
    })
  })

  it('should check contract 2', () => {
    return checkFiles(serviceProvider, localFile, localReceipt2)
    .then((result) => {
      expect(result.pass).toBe(true)
      expect(checkContract2).toHaveBeenCalledWith(
        expect.any(Web3),
        JSON.parse(fs.readFileSync(localReceipt2))
      )
    })
  })

  it('should return false if contract 2 returns false', () => {
    const expectedResult = {
      pass: false,
      messages: ['Remote smart contract did not match receipt.']
    }
    checkContract2.mockImplementation(() => Promise.resolve(expectedResult))
    return checkFiles(serviceProvider, localFile, localReceipt2)
    .then((result) => {
      expect(result).toEqual(expectedResult)
      expect(checkContract2).toHaveBeenCalledWith(
        expect.any(Web3),
        JSON.parse(fs.readFileSync(localReceipt2))
      )
    })
  })
})
