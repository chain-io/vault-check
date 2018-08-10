
const InputDataDecoder = require('ethereum-input-data-decoder')

const contract1ABI = [
  {
    constant: true,
    inputs: [],
    name: 'getHash',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getUUID',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'getVersion',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
]

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

module.exports.getTransactionReceipt = (web3, transactionID) => {
  return new Promise((resolve, reject) => {
    web3.eth.getTransactionReceipt(transactionID, (error, receipt) => {
      if (error) {
        reject(error)
      } else {
        resolve(receipt)
      }
    })
  })
}

module.exports.getContract1Hash = (web3, contractID) => {
  return new Promise((resolve, reject) => {
    const contract = web3.eth.contract(contract1ABI)
    const cInst = contract.at(contractID)
    cInst.getHash((error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

module.exports.getContract2Hash = (web3, contractID, uuid) => {
  const getBytes = (str) => `0x${str.replace(/-/g, '')}`

  return new Promise((resolve, reject) => {
    const contract = web3.eth.contract(contract2ABI)
    const cInst = contract.at(contractID)
    cInst.vault(getBytes(uuid), (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result.slice(2)) // trim 0x
      }
    })
  })
}

module.exports.getContract2Inputs = (w3, transactionID) => {
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
        resolve({
          attachment_uuid: formatUUID(rawInputs[0]),
          fingerprint: rawInputs[1]
        })
      }
    })
  })
}

module.exports.getBlock = (web3, blockNumber) => {
  return new Promise((resolve, reject) => {
    web3.eth.getBlock(blockNumber, (error, block) => {
      if (error) {
        reject(error)
      } else {
        resolve(block)
      }
    })
  })
}
