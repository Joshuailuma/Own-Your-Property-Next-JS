import ethers from 'ethers'

const provider = ethers.providers.JsonRpcProvider('https://eth-goerli.alchemyapi.io/v2/6mNAPvD9Gse0BojzyDSBrNb2S_1dOTCa')
const signer = provider.getSigner()
console.log(signer);

export { provider, signer }
