import ethers from 'ethers'

const provider = ethers.providers.JsonRpcProvider('https://eth-goerli.alchemyapi.io/v2/')
const signer = provider.getSigner()
console.log(signer);

export { provider, signer }
