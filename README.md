# Vault Check

A validation library for Vault by Chain.io

## Usage

```javascript
const vaultCheck = '@chainio/vaultcheck'

# Verify a local file and receipt against the blockchain
const filePath = '/home/me/sourcefile.pdf'
const receiptPath '/home/me/sourcefile-receipt.json'
const ethereumServiceProvider = 'https://main.infura.io/your-infura-id'

vaultCheck.checkFiles(ethereumServiceProvider, filePath, receiptPath)
.then((result) => {
  if (result.pass) {
    console.log('it passed')
    console.log('transaction date', result.transactionDate)
  } else {
    console.log('it failed', result.messages)
  }
})

# Verify a local file and receipt against each other without the blockchain
if (vaultCheck.checkFilesLocal(filePath, receiptPath))
  console.log('it passed')
} else {
  console.log('it failed', result.messages)
}
```