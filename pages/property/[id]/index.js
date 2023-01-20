import Image from "next/image"
import { useRouter } from "next/router"
import { Card, Modal, Input, Typography } from "@web3uikit/core";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "../../../constants/networkMapping.json"
import TransferProperty from "../../../constants/TransferProperty.json"
import { useEffect, useState } from "react";
import BasicNft from "../../../constants/BasicNft.json"
import { useNotification } from "@web3uikit/core";
import { Bell } from '@web3uikit/icons';
import NavBar from "../../../components/NavBar";

function Index() {
    const router = useRouter()
    const data = router.query //Data gotten from the previoud page
 
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const transferPropertyAddress = networkMapping[chainString].TransferProperty[1]
 
    const [showModal, setShowModal] = useState(false)
    const [buyerAddress, setBuyerAddress] = useState("")
    const dispatch = useNotification()

     // New Buyer is the ownerAddress
     const { runContractFunction: transferItem, data: dataReturned,
      error,
      onSuccess,
      isLoading,
      isFetching, } = useWeb3Contract({
      abi: TransferProperty,
      contractAddress: transferPropertyAddress, // specify the networkId
      functionName: "transferItem",
      params: {
        propertyAddress: data.propertyAddress, 
        tokenId: data.tokenId,
        ownerAddress: buyerAddress
      },
    })

    const performTransfer = async ()=>{
      setShowModal(false)
      if(isWeb3Enabled){
         // Store property on the blockchain and Emit an event
       const itemTransferred = await transferItem({
        onSuccess: handleTransferSuccess,
        onError: (error)=>{handleTransferError(error)}
       })

      }else{
        connectWalletNotification()
      }

    }

    const handleTransferClick = async ()=>{
      setShowModal(true)
    }
   
    /**
     * For notifications
     */

    const handleTransferSuccess = async(tx)=>{
      try{
        tx.wait(1)
        setBuyerAddress("")

        handleTransferNotification(tx)
      } catch(e){
        console.log(e);
      }
      
    }

    const handleTransferNotification =()=>{
      dispatch({
        type: "success",
        message: "Property succesfully transferred",
        title: "Transaction Notification",
        position: "topR",
        icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
      })
    }

    const handleTransferError =(e)=>{
      dispatch({
        type: "error",
        message: `Error trasferring property ${e.message}`,
        title: "Transaction Notification",
        position: "topR",
        icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
      })
    }

    const connectWalletNotification =(e)=>{
      dispatch({
        type: "info",
        message: `Please connect your wallet`,
        title: "Transaction Notification",
        position: "topR",
        icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
      })
    }
   
  return (
    <>
    <NavBar/>
    <div className={"mt-10 mb-12 flex justify-center text-3xl tracking-wider font-bold no-underline hover:underline"}>
    <h1> Transfer Property to a buyer</h1>
    </div>
    <div className={"flex justify-center align-center"}>

    <div className={"max-w-md justify-center"}>

    <Card className={"max-w-md justify-center"}
        title={data.name}
         description={data.description}>
            <div>#SN {data.SN}</div>
             <Image loader={() => data.imageUri}
            src={data.imageUri} alt="image" height="200" width="200"/> 
     </Card>

     <button onClick={handleTransferClick} className="px-16 mb-12 py-2 mt-4 ml-12 text-white rounded-full bg-brightRed hover:bg-brightRedLight focus:outline-none ">
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
      title={<div style={{display: 'flex', gap: 10}}><Typography color="#68738D" variant="h3">Input Buyer&apos;s Address</Typography></div>}
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
    </div>
    </>
  )
}

export default Index