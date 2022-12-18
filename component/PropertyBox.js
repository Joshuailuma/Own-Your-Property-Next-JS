 import { useState, useEffect } from "react";
 import { useWeb3Contract, useMoralis } from "react-moralis"
 import nftAbi from "../constants/BasicNft.json"

 

export default function PropertyBox({ownerAddress, propertyAddress, tokenId}){
    const [imageUri, setImageUri] = useState("")
    const { isWeb3Enabled, account } = useMoralis()

    
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: propertyAddress,
        functionName: "getTokenUri",
    })
    
async function updateUI() {
    const tokenURI = await getTokenURI()
    console.log(`The TokenURI is `)
    console.log(tokenURI)

}

useEffect(() => {
    if (isWeb3Enabled) {
        updateUI()
    }
}, [isWeb3Enabled])

 }