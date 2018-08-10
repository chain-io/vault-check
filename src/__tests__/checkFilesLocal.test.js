const checkFilesLocal = require('../checkFilesLocal')

describe('checkFilesLocal', () => {
  const localFile = 'src/__fixtures__/sample.txt'
  const localReceipt = 'src/__fixtures__/receipt.json'

  it('should pass if fingerprint matches', () => {
    expect(checkFilesLocal(localFile, localReceipt).pass).toBeTruthy()
  })

  it('should not pass if fingerprint does not match', () => {
    const result = checkFilesLocal('src/__fixtures__/badsample.txt', localReceipt)
    expect(result.pass).toBe(false) // want to confirm it's really false, not falsy
    expect(result.messages).toEqual(['Local receipt did not match file fingerprint.'])
  })
})
