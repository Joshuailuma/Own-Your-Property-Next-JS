import networkMapping from "../constants/networkMapping.json"
import {useMoralis } from 'react-moralis'
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import NavBar from '../components/NavBar';
import PropertyBox from "../components/PropertyBox";

//Query the database according the connected web3 account
// We are passing in a query paramenter below this function GET_PROPERTIES, {
 // variables: {account},
const GET_PROPERTIES = gql ` 
query GetPropertyMinted($account: ID!) {
  propertyMinteds(where: { ownerAddress: $account }) {
     id
    tokenId
    ownerAddress
    propertyAddress
    blockNumber
  }

  itemSolds(where: { ownerAddress: $account }) {
     id
    tokenId
    ownerAddress
    propertyAddress
    blockNumber
  }

  transfers(where: {
      from: $account}) {
    id
    from
    to
    tokenId
    blockNumber
  }
}
`;

/**
 * A component
 * @returns an HTML 
 */
function MyProperties() {
  const {isWeb3Enabled, chainId, account} = useMoralis()
const chainString = chainId ? parseInt(chainId).toString() : "31337"
const marketplaceAddress = networkMapping[chainString].TransferProperty[0]
const deadAddress = "0x0000000000000000000000000000000000000000" // Default address where an entity starts from
const {loading, error, data: listedProperties} = useQuery(GET_PROPERTIES, {
  variables: {account, deadAddress},
})

// List of owned properties
let propertiesOwned = new Array()

  return (
    <div className={"div mx-auto mb-10"}>
      <NavBar/>
      <div className={"flex justify-center align-center underline"}>
      <h1 className="py-4 px-4 font-bold text-3xl justify-center"> Your Properties</h1>
      </div>

      <div className={"flex justify-center align-center"}>
      <Link hidden={!isWeb3Enabled} href="/addProperty" 
              className="p-3 px-6 pt-2 text-white bg-brightRed rounded-full baseline hover:bg-brightRedLight"
              >Add a property</Link>
      </div>

      <div className={"flex justify-center align-center"}>           
     <h1 className="py-4 px-4 font-bold text-2xl"> Properties created</h1>
      </div>

      <div className="flex flex-wrap gap-4 justify-center align-center">

      {isWeb3Enabled ? ( 
                    loading || !listedProperties || (Object.keys(listedProperties.propertyMinteds).length === 0) ? (
                        <div className={"pt-16"}>No Property here...</div>
                    ) : (
                      listedProperties.propertyMinteds.map((property) => {
                        
                        
                        const { ownerAddress, propertyAddress, tokenId, blockNumber } = property
                        // Add this object to the array
                        propertiesOwned.push({
                          "ownerAddress": ownerAddress,
                          "propertyAddress": propertyAddress,
                          "tokenId": tokenId,
                          "blockNumber": blockNumber
                        })

                            return(
                              <>                                                       
                            <PropertyBox
                            ownerAddress={ownerAddress} 
                            propertyAddress={propertyAddress}
                            tokenId={tokenId}
                            key={tokenId}
                            />
                            </>
                            )
                        }
                        )
                )
                ) : (
                    <div className={"pt-52"}>Wallet not connected</div>
                )
                }
                </div>

                {/* Properties bought */}
                <div className={"flex justify-center align-center"}>
          <h1 className="py-4 px-4 font-bold text-2xl mt-14"> Properties bought</h1>
                </div>

          <div className="flex flex-wrap gap-4 justify-center align-center">
          {isWeb3Enabled ? (
                    loading || !listedProperties || (Object.keys(listedProperties.itemSolds).length === 0) ? (
                        <div className={"pt-16"}>No Property here...</div>
                    ) : (
                      listedProperties.itemSolds.map((property) => {

                        const { ownerAddress, propertyAddress, tokenId, blockNumber} = property

                        // Adding properties bought to propertiesOwned array 
                         if(ownerAddress){
                          // I need this loop to run
                          for(let i=0; i < propertiesOwned.length; i++){
                            // each loop checks both the if and else statement and executes 1
                            let elementInArray = propertiesOwned[i] // Each element/object in the array
                            //Check if tokenId in the object in the array and one gotten from TheGraph is same
                            if(tokenId === elementInArray.tokenId){
                              //If this blockNumber from TheGraph is higher than the one in the object loop
                                // It means it was recently bought
                                if(blockNumber > elementInArray.blockNumber){                           
                                  // Replace the object in the array with the new one gotten from TheGraph
                                  //Remove the element in the last position in the array, 1 element, 
                                  propertiesOwned.splice(i, 1)
                                 // and add this obj
                                  propertiesOwned.push( {
                                    "ownerAddress": ownerAddress,
                                    "propertyAddress": propertyAddress,
                                    "tokenId": tokenId,
                                    "blockNumber": blockNumber
                                  })
                                  break;
                                }

                              } else{
                                // If we have gotten to the end of the loop
                                if(i == propertiesOwned.length-1){
                                // If the object from TheGraph is not in the array, add it to the array
                                propertiesOwned.push({
                                  "ownerAddress": ownerAddress,
                                  "propertyAddress": propertyAddress,
                                  "tokenId": tokenId,
                                  "blockNumber": blockNumber
                                })
                              }

                              

                                // Leave the loop early. We dont want the element in else
                                // statement to be added twice to the array
                              }   
                
                          }
                        } 


                            return(
                              <>                                                   
                            <PropertyBox
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
                    <div className={"pt-52"}>Wallet not connected</div>
                )
                }        
      </div>
      
      {/* Properties sold */}
      <div className={"flex justify-center align-center"}>
       <h1 className="py-4 px-4 font-bold text-2xl mt-14"> Properties sold</h1>
       </div>
          <div className="flex flex-wrap gap-4 justify-center align-center">
          {isWeb3Enabled ? (
                    loading || !listedProperties || (Object.keys(listedProperties.transfers).length === 0) ? (
                        <div className={"pt-16"}>No Property here...</div>
                    ) : (
                      listedProperties.transfers.map((property) => {
                        // Current property address will always be constant. Its actually not in the result gotten from TheGraph below
                        const propertyAddress = "0xF74EBb7bB8883E22a8Be30F8C2EDaF7f4B58f360"
                        
                        const { to: ownerAddress, tokenId, blockNumber } = property
                        
                        // Adding properties bought to propertiesOwned array 
                        if(ownerAddress){
                          //Looping through the arrayyy 
                          for(let i=0; i < propertiesOwned.length; i++){
                            let element = propertiesOwned[i]
                             //Check if tokenId from object in array and that from TheGraph is same
                             if((element.tokenId) == tokenId){
                              //If they are thesame check if blockNumber from TheGraph is higher than the one in object array
                              if(blockNumber > element.blockNumber){
                                //If its higher It means the current state of the item is that it was recently sold
                                //Remove the element from the array of my properties since it has been sold
                                // At position i, remove 1 element
                                propertiesOwned.splice(i, 1)
                              }
                            } 
                            // If the sold items are not in the array, we dont need to put them in the array..
                            // the map property will simply display the sold items in the screen, we dont want sold items..
                            // in the properties we own, that is why there is *no else statement*
                        }
                      }

                            return(
                              <>                                                   
                            <PropertyBox
                            owner={ownerAddress} 
                            propertyAddress={propertyAddress}
                            tokenId={tokenId} 
                            key={tokenId}
                            />
                            </>
                    
                            )
                        }
                        )
                        )
                        )
                 : (
                    <div className={"pt-52"}>Wallet not connected</div>
                )
                }        
      </div>

      {/* Properties currently owned */}
      <div className={"flex justify-center align-center"}>
      <h1 className="py-4 px-4 font-bold text-2xl mt-14"> Properties currently owned</h1>
      </div>
          <div className="flex flex-wrap gap-4 justify-center align-center">
          {isWeb3Enabled ? (
                    loading || !listedProperties || (Object.keys(propertiesOwned).length === 0) ? (
                        <div className={"pt-16"}>No Property here...</div>
                    ) : (
                      propertiesOwned.map((property) => {
                        const { ownerAddress, propertyAddress, tokenId } = property

                            return(
                              <>                                                   
                            <PropertyBox
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
                    <div className={"pt-52"}>Wallet not connected</div>
                )
                }        
      </div>
    </div>
  )
}

export default MyProperties