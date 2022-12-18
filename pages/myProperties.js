import { useQuery } from "@apollo/client"
import networkMapping from "../constants/networkMapping.json"
import GET_PROPERTIES from "../constants/subgrapQueries"
import { useWeb3Contract, useMoralis } from 'react-moralis'
import PropertyBox from "../component/PropertyBox";

function myProperties() {
  const {isWeb3Enabled, chainId} = useMoralis()
const chainString = chainId ? parseInt(chainId).toString() : "31337"
const marketplaceAddress = networkMapping[chainString].OwnYourProperty[0]
const {loading, error, data: listedProperties} = useQuery(GET_PROPERTIES)
if(error){
  console.log(error);
}

// console.log(listedProperties);
// console.log(error);
  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl"> Your properties</h1>
      <div className="flex flex-wrap">

      {isWeb3Enabled ? (
                    loading || !listedProperties ? (
                        <div>Loading...</div>
                    ) : (
                      listedProperties.propertyMinteds.map((property) => {


                        const { ownerAddress, propertyAddress, tokenId, s_TokenUri } = property

                        // console.log(s_TokenUri.toString());

                            return(
                              <>
                            <div> ownerAddress is {ownerAddress}</div>
                            <div> propertyAddress is {propertyAddress}</div>

                            <div> tokenId is {tokenId}</div>
                            <div> TokenUri is {s_TokenUri}</div>

                            <PropertyBox 
                            ownerAddress={ownerAddress} 
                            propertyAddress={propertyAddress}
                             tokenId={tokenId} />
                            key={`${ownerAddress}${tokenId}`}
                            </>

                    
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}

      </div>
      


    </div>
  )
}

export default myProperties