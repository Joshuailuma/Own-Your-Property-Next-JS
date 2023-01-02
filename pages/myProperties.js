import networkMapping from "../constants/networkMapping.json"
// import {GET_PROPERTIES} from "../constants/subgrapQueries"
import { useWeb3Contract, useMoralis } from 'react-moralis'
import PropertyBox from "../component/PropertyBox";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import { Button } from "@web3uikit/core";
import { List } from "@web3uikit/icons";

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

function myProperties() {
  const {isWeb3Enabled, chainId, account} = useMoralis()
const chainString = chainId ? parseInt(chainId).toString() : "31337"
const marketplaceAddress = networkMapping[chainString].TransferProperty[0]
const deadAddress = "0x0000000000000000000000000000000000000000"
const {loading, error, data: listedProperties} = useQuery(GET_PROPERTIES, {
  variables: {account, deadAddress},
})
if(error){
  console.log(error);
}

let propertiesOwned = new Array()
const jiji = ()=>{
console.log(propertiesOwned);
}

// console.log(listedProperties);
// console.log(error);
  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl justify-center"> Your properties</h1>
      
      <Link hidden={!isWeb3Enabled} href="/addProperty" 
              class="p-3 px-6 pt-2 text-white bg-brightRed rounded-full baseline hover:bg-brightRedLight"
              >Add a property</Link>

              <Button onClick={jiji}> uiuiui</Button>
              
     <h1 className="py-4 px-4 font-bold text-2xl"> Properties created</h1>

      <div className="flex flex-wrap mt-14 gap-4">

      {isWeb3Enabled ? ( 
                    loading || !listedProperties ? (
                        <div className={"pt-48"}>Loading...</div>
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
                                                      
                            <PropertyBox className={"mt-28"}
                            ownerAddress={ownerAddress} 
                            propertyAddress={propertyAddress}
                            tokenId={tokenId}
                            available={false}
                            key={tokenId}
                            />
                            </>
                            )
                        }
                        )
                )
                ) : (
                    <div className={"pt-52"}>Web3 Currently Not Enabled</div>
                )
                }

                </div>

                {/* Properties bought */}
          <h1 className="py-4 px-4 font-bold text-2xl"> Properties bought</h1>
          <div className="flex flex-wrap mt-14 gap-4">

          {isWeb3Enabled ? (
                    loading || !listedProperties ? (
                        <div className={"pt-48"}>Loading...</div>
                    ) : (

                      listedProperties.itemSolds.map((property) => {

                        const { ownerAddress, propertyAddress, tokenId, blockNumber} = property

                         // Adding propertied bought to propertiesOwned array 
                         if(ownerAddress){                   
                          propertiesOwned.forEach((element)=>{
                               //Check if object in array and this object is same
                               if(JSON.stringify(element) === JSON.stringify({
                                "ownerAddress": ownerAddress,
                                "propertyAddress": propertyAddress,
                                "tokenId": tokenId,
                                "blockNumber": blockNumber
                              })){
                                console.log("Same property found");
                                //If this blockNumber is higher than the one we created
                                if(blockNumber > element.blockNumber){
                                  //Remove the element in the last position in the array, 1 element, and add this obj
                                  propertiesOwned.splice(-1, 1, {
                                    "ownerAddress": ownerAddress,
                                    "propertyAddress": propertyAddress,
                                    "tokenId": tokenId,
                                    "blockNumber": blockNumber
                                  })
                                }
                              } else{
                                //If the object is not in the array at all, add it
                                propertiesOwned.push({
                                  "ownerAddress": ownerAddress,
                                  "propertyAddress": propertyAddress,
                                  "tokenId": tokenId,
                                  "blockNumber": blockNumber
                                })
                              }                   
                          })
                        }
  
                        

                            return(
                              <>                                                   
                            <PropertyBox className={"mt-28"}
                            ownerAddress={ownerAddress} 
                            propertyAddress={propertyAddress}
                            tokenId={tokenId}
                            available={false}
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
      
      {/* Properties sold */}
       <h1 className="py-4 px-4 font-bold text-2xl"> Properties sold</h1>
          <div className="flex flex-wrap mt-14 gap-4">

          {isWeb3Enabled ? (
                    loading || !listedProperties ? (
                        <div className={"pt-48"}>Loading...</div>
                    ) : (
                      listedProperties.transfers.map((property) => {
                        // Current property address will always be constant. Its actually not in the result gotten below
                        const propertyAddress = "0xF74EBb7bB8883E22a8Be30F8C2EDaF7f4B58f360"

                        const { owner: ownerAddress, tokenId, blockNumber } = property
                        // Adding propertied bought to propertiesOwned array 
                        if(ownerAddress){                   
                        propertiesOwned.forEach((element)=>{
                             //Check if object in array and this object is same
                             if(JSON.stringify(element) === JSON.stringify({
                              "ownerAddress": ownerAddress,
                              "propertyAddress": propertyAddress,
                              "tokenId": tokenId,
                              "blockNumber": blockNumber
                            })){
                              console.log("Same property found");
                              //If this blockNumber is higher than the one we created
                              if(blockNumber > element.blockNumber){
                                //Remove the element in the last position in the array, 1 element, and add this obj
                                propertiesOwned.splice(-1, 1, {
                                  "ownerAddress": ownerAddress,
                                  "propertyAddress": propertyAddress,
                                  "tokenId": tokenId,
                                  "blockNumber": blockNumber
                                })
                              }
                            } else{
                              //If the object is not in the array at all, add it
                              propertiesOwned.push({
                                "ownerAddress": ownerAddress,
                                "propertyAddress": propertyAddress,
                                "tokenId": tokenId,
                                "blockNumber": blockNumber
                              })
                            }                   
                        })
                      }

                            return(
                              <>                                                   
                            <PropertyBox className={"mt-28"}
                            owner={ownerAddress} 
                            propertyAddress={propertyAddress}
                            tokenId={tokenId} 
                            available={false}
                            key={tokenId}
                            />
                            </>
                    
                            )
                        }
                        )
                        )
                        )
                 : (
                    <div className={"pt-52"}>Web3 Currently Not Enabled</div>
                )
                }        

      </div>


      {/* Properties currently owned */}
      <h1 className="py-4 px-4 font-bold text-2xl"> Properties currently owned</h1>
          <div className="flex flex-wrap mt-14 gap-4">

          {isWeb3Enabled ? (
                    loading || !listedProperties ? (
                        <div className={"pt-48"}>Loading...</div>
                    ) : (
                      

                      propertiesOwned.map((property) => {
                        // console.log(property);

                        const { ownerAddress, propertyAddress, tokenId } = property

                            return(
                              <>                                                   
                            <PropertyBox className={"mt-28"}
                            ownerAddress={ownerAddress} 
                            propertyAddress={propertyAddress}
                            tokenId={tokenId}
                            available={false}
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