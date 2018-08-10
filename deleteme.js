const checkContract1 = require('./src/checkContract1')
const serviceProvider = 'https://mainnet.infura.io/M8sce4zkxUdYuct0jcPa'
const Web3 = require('web3')
const fs = require('fs')
const InputDataDecoder = require('ethereum-input-data-decoder')

const contract2ABI = [
  {
    constant: false,
    inputs: [
      {
        name: '_uuid',
        type: 'bytes32'
      },
      {
        name: '_hash',
        type: 'bytes32'
      }
    ],
    name: 'addFingerprint',
    outputs: [

    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'bytes32'
      }
    ],
    name: 'vault',
    outputs: [
      {
        name: 'hash',
        type: 'bytes32'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
]

const web3 = new Web3(new Web3.providers.HttpProvider(serviceProvider))
const receipt = JSON.parse(fs.readFileSync('../samplereceipt.json'))

// checkContract1(web3, receipt)
// .then((result) => {
//   console.log('result', result)
//   process.exit(0)
// })
// .catch((err) => {
//   console.error(err)
//   process.exit(-1)
// })

const tID = '0xfa1fcd6fc2935ddbdda9852711e535c8c36e78af6602e5bda290a149659b35f0'

const getContract2Inputs = (w3, transactionID) => {
  const formatUUID = (uuid) => {
    const pairs = [
      [0, 8],
      [8, 12],
      [12, 16],
      [16, 20],
      [20, 32]
    ]
    return pairs.map(p => uuid.slice(p[0], p[1])).join('-')
  }
  return new Promise((resolve, reject) => {
    const decoder = new InputDataDecoder(contract2ABI)
    w3.eth.getTransaction(transactionID, (error, tx) => {
      if (error) {
        reject(error)
      } else {
        const rawInputs = decoder.decodeData(tx.input).inputs.map(inp => inp.toString('hex'))
        const r = {
          fingerprint_uuid: formatUUID(rawInputs[0]),
          fingerprint: rawInputs[1]
        }
        console.log('returning', r)
        resolve(r)
      }
    })
  })
}

getContract2Inputs(web3, tID)
.then((result) => {
  console.log('result', result)
  process.exit(0)
})
