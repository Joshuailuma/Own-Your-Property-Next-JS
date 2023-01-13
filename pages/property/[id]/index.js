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

function Index({property}) {
    const router = useRouter()
    const data = router.query //Data gotten from the previoud page
 
    const { isWeb3Enabled, account, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const transferPropertyAddress = networkMapping[chainString].TransferProperty[1]
    const basifNftAddress = networkMapping[chainString].TransferProperty[0]
    const contractAbi = BasicNft

    const [showModal, setShowModal] = useState(false)
    const [buyerAddress, setBuyerAddress] = useState("")
    const [propertyState, setPropertyState] = useState("")
    const dispatch = useNotification()

  useEffect(()=>{
    setPropertyState(data.available)
  },[data.available])
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
    
    //Check owner
    const { runContractFunction: ownerOf, data: dataCheckOwner,
      error: errorCheckOwner,
      onSuccess: onSuccessCheckOwner,
      isLoading: isLoadingCheckOwner,
      isFetching: isFetchingCheckOwner, } = useWeb3Contract({
      abi: BasicNft,
      contractAddress: basifNftAddress, // specify the networkId
      functionName: "ownerOf",
      params: {
        tokenId: data.tokenId
      },
    })

    const { runContractFunction: getApproved, data: dataSetApprovalForAll,
      error: errorSetApprovalForAll,
      onSuccess: onSuccessSetApprovalForAll,
      isLoading: isLoadingSetApprovalForAll,
      isFetching: isFetchingSetApprovalForAll, } = useWeb3Contract({
      abi: BasicNft,
      contractAddress: basifNftAddress, // specify the networkId
      functionName: "getApproved",
      params: {
        tokenId: data.tokenId
      },
    })

    const { runContractFunction: approve, data: dataReturnedForApproval,
      error: approvalError,
      isLoading: approvalIsLoading,
      isFetching: approvalIsFetching } = useWeb3Contract({
      abi: contractAbi,
      contractAddress: basifNftAddress, // specify the networkId
      functionName: "approve",
      params: {to: transferPropertyAddress,
      tokenId: data.tokenId},
    })

    const performTransfer = async ()=>{
      showModal(false)
      if(isWeb3Enabled){
         // Store property on the blockchain and Emit an event
       const itemTransferred = await transferItem({
        onSuccess: handleTransferSuccess,
        onError: (error)=>{handleTransferError(error)}
       })
      // console.log(`Contract address is ${contractAddress}`);
      // console.log(` Owner address is ${data.ownerAddress}`);
      // console.log(`Property address ${data.propertyAddress}`);
      // console.log(`Token id is ${data.tokenId}`);
      // console.log(`Current account is ${account}`);
      // ``0xD8CA73D2d43fcE92A3A61913D7C31d5a0cbFe0b2``

      // console.log(`Property address is ${data.propertyAddress}`); // 0xf74ebb7bb8883e22a8be30f8c2edaf7f4b58f360
      // console.log(`Property iD is ${data.tokenId}`); // 11
      // console.log(`Property new buyer address is ${buyerAddress}`); // 0xD8CA73D2d43fcE92A3A61913D7C31d5a0cbFe0b2

      }else{
        connectWalletNotification()
      }

    }

    const handleGetApproval = async ()=>{
      const gottenApproval = await approve({
        onSuccess: handleApproveSuccess,
        onError: (error)=>{handleApproveError(error)}
      })     
    }

    const handleTransferClick = async ()=>{
      setShowModal(true)
    }
   
    /**
     * For notifications
     */

    const handleApproveSuccess = async(tx)=>{
      try{
        tx.wait(1)
        handleApproveNotification(tx)
      } catch(e){
        console.log(e, "Nonono");
      }
      
    }

    const handleApproveNotification =()=>{
      dispatch({
        type: "success",
        message: "Approval gotten, you can now transfer🙂",
        title: "Transaction Notification",
        position: "topR",
        icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
      })
    }

    const handleApproveError =(e)=>{
      dispatch({
        type: "error",
        message: `Error getting approval failed ${e.message}`,
        title: "Transaction Notification",
        position: "topR",
        icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
      })
    }

    const handleTransferSuccess = async(tx)=>{
      try{
        tx.wait(1)
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
    <div className={"flex justify-center align-center"}>

    <div className={"max-w-md justify-center"}>

    <Card className={"max-w-md justify-center"} onClick={handleTransferClick}
        title={data.name}
         description={data.description}>
            <div>#SN {data.SN}</div>
             <Image loader={() => data.imageUri}
            src={data.imageUri} alt="image" height="200" width="200"/> 
     </Card>

     <button onClick={handleGetApproval} className={approvalIsLoading || approvalIsFetching ? "animate-spin spinner-border h-8 w-8 border-b-2 rounded-full" :"px-16 mb-12 py-2 mt-4 ml-12 text-white rounded-full bg-brightRed hover:bg-brightRedLight focus:outline-none "}>
       First Get approval
       </button>
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