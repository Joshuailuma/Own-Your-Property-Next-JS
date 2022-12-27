import Image from "next/image"
import { useRouter } from "next/router"
import { Card, Modal, Input, Typography } from "@web3uikit/core";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "../../../constants/networkMapping.json"
import TransferProperty from "../../../constants/TransferProperty.json"
import { useState } from "react";

function index({property}) {
    const router = useRouter()
    const data = router.query //Data gotten from the previoud page
 
    const { isWeb3Enabled, account, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const contractAddress = networkMapping[chainString].TransferProperty[1]
    const [showModal, setShowModal] = useState(false)
    const [buyerAddress, setBuyerAddress] = useState("")


    const performTransfer = async ()=>{
      if(isWeb3Enabled){
         // Store property on the blockchain and Emit an event
      let transferResult = await transferItem()
      console.log(`Contract address is ${contractAddress}`);
      console.log(` Owner address is ${data.ownerAddress}`);
      console.log(`Property address ${data.propertyAddress}`);
      console.log(`Token id is ${data.tokenId}`);
      console.log(`Current account is ${account}`);

      if(transferResult !== 'undefined'){
        console.log(error, dataReturned);
        // 0xBcd4042DE499D14e55001CcbB24a551F3b954096
       alert("Property succesfully transferred")
     } else{
        alert("Property transfer failed")
        console.log(error);
      }

      }else{
        alert("Please connect a wallet")
      }

    }

    const handleCardClick= ()=>{
      setShowModal(true)

    }

    // New Buyer is the ownerAddress
    const { runContractFunction: transferItem, data: dataReturned,
      error,
      isLoading,
      isFetching, } = useWeb3Contract({
      abi: TransferProperty,
      contractAddress: contractAddress, // specify the networkId
      functionName: "transferItem",
      params: {propertyAddress: data.propertyAddress, 
        tokenId: data.tokenId,
        ownerAddress: buyerAddress
      },
    })

  return (
    <>
    <div>

    <Card onClick={handleCardClick}
        title={data.name}
         description={data.description}>
            <div>#SN {data.SN}</div>
             <Image loader={() => data.imageUri}
            src={data.imageUri} height="200" width="200"/> 
     </Card>

     <button onClick={handleCardClick} className="px-16 mb-12 py-2 mt-4 ml-12 text-white rounded-full bg-brightRed hover:bg-brightRedLight focus:outline-none ">
       Transfer property
       </button>

       <Modal
      cancelText="Cancel"
      id="v-center"
      isCentered = {true}
      isVisible={showModal}
      okText="Finally transfer"
      onCancel={function noRefCheck(){
        setBuyerAddress("")
        setShowModal(false)
      }}
      onCloseButtonPressed={function noRefCheck(){
        setShowModal(false)
      }}
      onOk={performTransfer}
      title={<div style={{display: 'flex', gap: 10}}><Typography color="#68738D" variant="h3">Input Buyer's Address</Typography></div>}
    >
      <Input
      type="text"
      onChange={()=>{
        setBuyerAddress(event.target.value)
      }}
        label="Address of buyer"
        width="100%"
      />
    </Modal>

    </div>
    </>
  )
}

export default index