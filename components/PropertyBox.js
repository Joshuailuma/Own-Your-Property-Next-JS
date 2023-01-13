 import { useState, useEffect } from "react";
 import { useWeb3Contract, useMoralis } from "react-moralis"
 import nftAbi from "../constants/BasicNft.json"
import Image from "next/image";
import { Card } from "@web3uikit/core";
 import Link from "next/link";

export default function PropertyBox({ownerAddress, propertyAddress, tokenId, available}) {
    const [imageUri, setImageURI] = useState("")
    const { isWeb3Enabled, account } = useMoralis()
    const [propertyNameFromJson, setPropertyNameFromJson] = useState("")
    const [propertyDescriptionFromJson, setPropertyDescriptionFromJson] = useState("")
    const [propertySNFromJson, setPropertySNFromJson] = useState("")

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: propertyAddress,
        functionName: "getTokenUri",
        params: {
            tokenId: tokenId,
        }
    })
    
async function updateUI() {
    const tokenURI = await getTokenURI()

    if(tokenURI){
        // IPFS Gateway: A server that will return IPFS files from a "normal" URL.
        const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
        //I stopped here
        // console.log(`Found token uri ${requestURL}`);

        const tokenURIResponse = await (await fetch(requestURL)).json()

        // Get the image field from the json
        const imageURI = tokenURIResponse.image
        //Make ipfs address to be viewable as normal address
        const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
        console.log(`Image uri is ${imageURIURL}`);
        setImageURI(imageURIURL)
        // We are still getting these details from ipfs json
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
        console.log("Hello");
    }
}, [isWeb3Enabled])

// We want to pass this to the next screen
const property = {
    name: propertyNameFromJson,
    description: propertyDescriptionFromJson,
    SN: propertySNFromJson,
    imageUri: imageUri,
    propertyAddress: propertyAddress,
    tokenId: tokenId,
    ownerAddress: ownerAddress,
    available: available
}

return (
    <>
    <div>{imageUri ? (

<Link href={{
    pathname: `/property/${tokenId}`,
      query: property}}>

    <Card
        title={propertyNameFromJson}
         description={propertyDescriptionFromJson}>
            <div>#SN {propertySNFromJson}</div>
             <Image loader={() => imageUri}
            src={imageUri} alt="image" height="200" width="200"/> 
     </Card> 
     </Link>) : (<div>Loading </div>
         

     )
    }
     </div>
     </>
)
}
