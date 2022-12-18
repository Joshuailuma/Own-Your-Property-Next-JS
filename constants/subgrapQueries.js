import { gql } from "@apollo/client";

//Query the database according the connected web3 account

const GET_PROPERTIES = gql `
{
    propertyMinteds(first: 5) {
    id
    tokenId
    ownerAddress
    propertyAddress
    s_TokenUri
  }
}
`
export default GET_PROPERTIES