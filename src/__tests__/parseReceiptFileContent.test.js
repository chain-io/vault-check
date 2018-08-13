const parseReceiptFileContent = require('../parseReceiptFileContent')
const fs = require('fs')

describe('parseReceiptFileContent', () => {
  let content
  let expected

  beforeEach(() => {
    content = fs.readFileSync('src/__fixtures__/receipt.json')
    expected = {
      file_name: 'sample.txt',
      upload_complete_date: '2018-08-09T19:50:37.000Z',
      attachment_uuid: 'aa392b96-a40d-414e-83d6-51a8fdef2d2b',
      fingerprint_uuid: 'aa08c72d-9fa9-4a15-9eb4-5671f8dd7f92',
      fingerprint: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      fingerprint_version: '1.0',
      contract_id: '0x9927fc223930988377a75d7897f36760a783d70f',
      contract_version: '1.0',
      transaction_hash: '0x99e2bb698a13f86c172b1445ba2e6e047e27f41b30f199f15474fcd2266762a0',
      contract_sent: '2018-08-09T19:50:52.000Z',
      contract_confirmed: '2018-08-09T19:55:21.000Z'
    }
  })

  it('should parse content', () => {
    expect(parseReceiptFileContent(content)).toEqual(expected)
  })

  it('should fail on bad json', () => {
    const badContent = 'this is not json'
    expect(() => { parseReceiptFileContent(badContent) }).toThrow(/JSON/)
  })

  it('should fail on no fingerprint', () => {
    const badData = Object.assign({}, expected)
    delete badData.fingerprint
    const badContent = JSON.stringify(badData)

    expect(() => { parseReceiptFileContent(badContent) }).toThrow(/fingerprint/)
  })
})