import networkMapping from "../constants/networkMapping.json"
// import {GET_PROPERTIES} from "../constants/subgrapQueries"
import { useWeb3Contract, useMoralis } from 'react-moralis'
import PropertyBox from "../components/PropertyBox";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import NavBar from '../components/NavBar';

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

function MyProperties() {
  const {isWeb3Enabled, chainId, account} = useMoralis()
const chainString = chainId ? parseInt(chainId).toString() : "31337"
const marketplaceAddress = networkMapping[chainString].TransferProperty[0]
const deadAddress = "0x0000000000000000000000000000000000000000"
const {loading, error, data: listedProperties} = useQuery(GET_PROPERTIES, {
  variables: {account, deadAddress},
})

// List of owned properties
let propertiesOwned = new Array()

// console.log(listedProperties);
// console.log(error);
  return (
    <div className="container mx-auto">
      <NavBar/>
      <div className={"flex justify-center align-center"}>
      <h1 className="py-4 px-4 font-bold text-2xl justify-center"> Your properties</h1>
      </div>

      <div className={"flex justify-center align-center"}>
      <Link hidden={!isWeb3Enabled} href="/addProperty" 
              className="p-3 px-6 pt-2 text-white bg-brightRed rounded-full baseline hover:bg-brightRedLight"
              >Add a property</Link>
      </div>

              
     <h1 className="py-4 px-4 font-bold text-2xl"> Properties created</h1>

      <div className="flex flex-wrap gap-4">

      {isWeb3Enabled ? ( 
                    loading || !listedProperties ? (
                        <div className={"pt-48"}>No Property here...</div>
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
                            <PropertyBox className={""}
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
          <h1 className="py-4 px-4 font-bold text-2xl mt-14"> Properties bought</h1>
          <div className="flex flex-wrap gap-4">

          {isWeb3Enabled ? (
                    loading || !listedProperties ? (
                        <div className={"pt-48"}>No Property here...</div>
                    ) : (
                      listedProperties.itemSolds.map((property) => {

                        const { ownerAddress, propertyAddress, tokenId, blockNumber} = property

                         // Adding propertied bought to propertiesOwned array 
                         if(ownerAddress){                   
                          propertiesOwned.forEach((element)=>{
                               //Check if object in array and this object is same
                               if((element.tokenId) == tokenId){
                                console.log("Same property found bought");
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
                                console.log("Not Same property found bought");

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
                            <PropertyBox
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
       <h1 className="py-4 px-4 font-bold text-2xl mt-14"> Properties sold</h1>
          <div className="flex flex-wrap gap-4">

          {isWeb3Enabled ? (
                    loading || !listedProperties ? (
                        <div className={"pt-48"}>No Property here...</div>
                    ) : (
                      listedProperties.transfers.map((property) => {
                        // Current property address will always be constant. Its actually not in the result gotten below
                        const propertyAddress = "0xF74EBb7bB8883E22a8Be30F8C2EDaF7f4B58f360"
                        
                        const { to: ownerAddress, tokenId, blockNumber } = property
                        // console.log(ownerAddress);
                        console.log(tokenId);
                        // Adding propertied bought to propertiesOwned array 
                        if(ownerAddress){
                          //Looping through the array
                          for(let i=0; i < propertiesOwned.length; i++){
                            let element = propertiesOwned[i]
                             //Check if object in array and this object is same
                             if((element.tokenId) == tokenId){
                              // console.log("Same property found SOld");
                              //If this blockNumber is higher than the one we created
                              if(blockNumber > element.blockNumber){
                                //It means the current state of the item is that its recently sold
                                //Remove the element from the array of my properties since it has been sold
                                propertiesOwned.splice(i, 1)
                              }
                            } 
                            //We dont wwant sold items in there, so we aint adding anything                   
                        }
                          
                      }

                            return(
                              <>                                                   
                            <PropertyBox
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
      <h1 className="py-4 px-4 font-bold text-2xl mt-14"> Properties currently owned</h1>
          <div className="flex flex-wrap gap-4">

          {isWeb3Enabled ? (
                    loading || !listedProperties ? (
                        <div className={"pt-48"}>No Property here...</div>
                    ) : (
                      

                      propertiesOwned.map((property) => {

                        const { ownerAddress, propertyAddress, tokenId } = property

                            return(
                              <>                                                   
                            <PropertyBox
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

export default MyProperties