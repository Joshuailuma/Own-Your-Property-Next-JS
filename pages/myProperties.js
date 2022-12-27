import networkMapping from "../constants/networkMapping.json"
// import {GET_PROPERTIES} from "../constants/subgrapQueries"
import { useWeb3Contract, useMoralis } from 'react-moralis'
import PropertyBox from "../component/PropertyBox";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";

//Query the database according the connected web3 account
// We are passing in a query paramenter below this function GET_PROPERTIES, {
 // variables: {account},
const GET_PROPERTIES = gql ` 
query GetPropertyMinted($account: ID!) {
  propertyMinteds(first: 5, where: { ownerAddress: $account }) {
     id
    tokenId
    ownerAddress
    propertyAddress
  }
}
`;


function myProperties() {
  const {isWeb3Enabled, chainId, account} = useMoralis()
const chainString = chainId ? parseInt(chainId).toString() : "31337"
const marketplaceAddress = networkMapping[chainString].TransferProperty[0]
const {loading, error, data: listedProperties} = useQuery(GET_PROPERTIES, {
  variables: {account},
})
if(error){
  console.log(error);
}

console.log(listedProperties, "hahahah");
// console.log(error);
  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl"> Your properties</h1>
      
      <Link hidden={!isWeb3Enabled} href="/addProperty" 
              class="p-3 px-6 pt-2 text-white bg-brightRed rounded-full baseline hover:bg-brightRedLight"
              >Add a property</Link>

      <div className="flex flex-wrap mt-14 gap-4">

      {isWeb3Enabled ? (
                    loading || !listedProperties ? (
                        <div className={"pt-48"}>Loading...</div>
                    ) : (
                      listedProperties.propertyMinteds.map((property) => {


                        const { ownerAddress, propertyAddress, tokenId } = property

                        console.log(`tokenId is ${tokenId}`);

                            return(
                              <> 
                                                      
                            <PropertyBox className={"mt-28"}
                            ownerAddress={ownerAddress} 
                            propertyAddress={propertyAddress}
                            tokenId={tokenId} 
                            key={tokenId}
                            />
                            </>
                    
                            )
                        })
                    )
                ) : (
                    <div className={"pt-52"}>Web3 Currently Not Enabled</div>
                )
                }

      </div>
      


    </div>
  )
}

export default myProperties