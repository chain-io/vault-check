const index = require('../index')

describe('index', () => {
  it('should expose checkFiles', () => {
    expect(index.checkFiles).toBeDefined()
  })
  it('should expose checkFilesLocal', () => {
    expect(index.checkFilesLocal).toBeDefined()
  })
})
