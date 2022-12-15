const Moralis = require("moralis/node")
require("dotenv").config()
//Want to import the contract address here
const contractAddresses = require("./constants/networkMapping.json")

let chainId = process.env.chainId || 31337

let moralisChainId = chainId == "31337" ? "1337" : chainId // If localhost use 1337

//Get the recently deployed basicNft at that chaid ID
const contractAddress = contractAddresses[chainId]["BasicNft"][0]

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
const appId = process.env.NEXT_PUBLIC_APP_ID
const masterKey = process.env.masterKey

async function main() {
    await Moralis.start({ serverUrl, appId, masterKey })
    console.log(`Working with contrat address ${contractAddress}`)

    let propertyMintedOptions = {
        // Moralis understands a local chain is 1337
        chainId: moralisChainId,
        sync_historical: true,
        topic: "PropertyMinted(uint256,address,address)",
        address: contractAddress,
        abi: {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "ownerAddress",
                "type": "address"
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "propertyAddress",
                "type": "address"
              }
            ],
            "name": "PropertyMinted",
            "type": "event"
          },
          tableName: "PropertyMinted",
        }


    const propertyResponse = await Moralis.Cloud.run("watchContractEvent", propertyMintedOptions, {
        useMasterKey: true,
    })
    // const boughtResponse = await Moralis.Cloud.run("watchContractEvent", itemBoughtOptions, {
    //     useMasterKey: true,
    // })
    // const canceledResponse = await Moralis.Cloud.run("watchContractEvent", itemCanceledOptions, {
    //     useMasterKey: true,
    // })
    if (propertyResponse.success) {
        console.log("Success! Database Updated with watching events")
    } else {
        console.log("Something went wrong...")
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
