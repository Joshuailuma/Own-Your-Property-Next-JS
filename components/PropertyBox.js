 import { useState, useEffect } from "react";
 import { useWeb3Contract, useMoralis } from "react-moralis"
 import nftAbi from "../constants/BasicNft.json"
import Image from "next/image";
import { Card } from "@web3uikit/core";
 import Link from "next/link";

export default function PropertyBox({ownerAddress, propertyAddress, tokenId}) {
    const [imageUri, setImageURI] = useState("")
    const { isWeb3Enabled, account } = useMoralis()
    const [propertyNameFromJson, setPropertyNameFromJson] = useState("")
    const [propertyDescriptionFromJson, setPropertyDescriptionFromJson] = useState("")
    const [propertySNFromJson, setPropertySNFromJson] = useState("")

    /**
     * Contract function to get token URI
     */
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: propertyAddress,
        functionName: "getTokenUri",
        params: {
            tokenId: tokenId, //We pass in tokenID as parameter to the function
        }
    })
    
async function updateUI() {
    const tokenURI = await getTokenURI()

    // If token URI has been gotten from the contract
    if(tokenURI){
        // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
        //..basicly adding http to the ipfs url
        const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
        
        // Go to that site and fetch the json. Fetch is a javascript http request function
        const tokenURIResponse = await (await fetch(requestURL)).json()

        // Get the image field from the json
        const imageURI = tokenURIResponse.image
        //Make ipfs address of the image gotten to be viewable as normal address
        const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")

        // Save the image uri in a variable
        setImageURI(imageURIURL)
        // We are still getting these details from ipfs json and storing it in the variables
        setPropertyNameFromJson(tokenURIResponse.name)
        setPropertyDescriptionFromJson(tokenURIResponse.description)
        setPropertySNFromJson(tokenURIResponse.serialNumber)
    } else{
        console.log("No token uri present");
    }
}

useEffect(() => {
    if (isWeb3Enabled) {
        updateUI()
    }
}, [isWeb3Enabled])

// We want to pass this details to the next screen. So we are saving it as an object
const property = {
    name: propertyNameFromJson,
    description: propertyDescriptionFromJson,
    SN: propertySNFromJson,
    imageUri: imageUri,
    propertyAddress: propertyAddress,
    tokenId: tokenId,
    ownerAddress: ownerAddress,
}

return (
    <>
    <div>{imageUri ? (
    // Wrap card in a link
    <Link href={{
    pathname: `/property/${tokenId}`,
    query: property}}>

    <Card
        title={propertyNameFromJson}>
            <div>#SN {propertySNFromJson}</div>
             <Image loader={() => imageUri}
            src={imageUri} alt="image" height="200" width="200"/> 
     </Card> 
     </Link>) : (
     <div>Loading </div>
     )
    }
     </div>
     </>
)
}
