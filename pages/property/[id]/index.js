import Image from "next/image"
import { useRouter } from "next/router"
import { Card, Modal, Input, Typography } from "@web3uikit/core";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "../../../constants/networkMapping.json"
import TransferProperty from "../../../constants/TransferProperty.json"
import {useState } from "react";
import BasicNft from "../../../constants/BasicNft.json"
import { useNotification } from "@web3uikit/core";
import { Bell } from '@web3uikit/icons';
import NavBar from "../../../components/NavBar";

function Index() {
    const router = useRouter()
    const data = router.query //Data gotten from the previous page
 
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const transferPropertyAddress = networkMapping[chainString].TransferProperty[1]
    const basifNftAddress = networkMapping[chainString].TransferProperty[0] //Get basifNftAddress contract address

    const [showModal, setShowModal] = useState(false)
    const [buyerAddress, setBuyerAddress] = useState("")
    const dispatch = useNotification() //For notification

     /**
      * Contract TransferItem function to tranfer item to another address
      * Check the solidity contract for more details
      */
     const { runContractFunction: transferItem, data: dataReturned,
      error,
      onSuccess,
      isLoading,
      isFetching, } = useWeb3Contract({
      abi: TransferProperty,
      contractAddress: transferPropertyAddress, 
      functionName: "transferItem",
      params: {
        propertyAddress: data.propertyAddress, 
        tokenId: data.tokenId,
        ownerAddress: buyerAddress // New Buyer is the ownerAddress
      },
    })

    const { runContractFunction: approve, data: dataReturnedForApproval,
      error: approveError,
      onSuccess: approveSuccess} = useWeb3Contract({
      abi: BasicNft,
      contractAddress: basifNftAddress,
      functionName: "approve",
      params: {to: transferPropertyAddress,
      tokenId: data.tokenId},
    })

    /**
     * Get approval to transfer property
     */
    const handleApprove = async ()=>{
      if(isWeb3Enabled){
      const contractInteraction = await approve({
        onSuccess: handlePleaseWait,
        onError: handleApproveError
       })

       // If the contractInteraction has a result
       if(contractInteraction){
         await contractInteraction.wait(); //Wait to see the emitted events
         handleApproveSuccess()
       }

      } else{
        // Show notification if wallet is not connected
        connectWalletNotification()
      }
    }

    /**
     * To perform the actual transfer
     */
    const performTransfer = async ()=>{
      setShowModal(false)
      // Check if wallet is connected
      if(isWeb3Enabled){
         // Store property on the blockchain and Emit an event
       const contractInteraction = await transferItem({
        onSuccess: handlePleaseWait,
        onError: (e)=>{handleTransferError(e)}
       })

       // If there is a result from the contract interaction
       if(contractInteraction){
         await contractInteraction.wait()
         handleTransferSuccess()
       }
      }else{
        // Show notification if wallet is not connected
        connectWalletNotification()
      }
    }
    /**
     * Show a popup
     */
    const handleTransferClick = async ()=>{
      setShowModal(true)
    }

     //====== For notifications ==========

    /**
     * When transfer is successful
     * @param {transaction} tx 
     */
    const handleTransferSuccess = async(tx)=>{
      try{
        //Clear the form data
        handleTransferNotification()
      } catch(e){
        console.log(e);
      }
    }

     /**
     * Show success notifiaction
     */
    const handleTransferNotification =()=>{
      dispatch({
        type: "success",
        message: "Property succesfully transferred",
        title: "Transaction Notification",
        position: "topR",
        icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
      })
    }

     /**
     * Show error notification
     */
    const handleTransferError =(e)=>{
      dispatch({
        type: "error",
        message: `Error trasferring property ${e.message}`,
        title: "Transaction Notification",
        position: "topR",
        icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
      })
    }

        /**
     * Function is called when property has been approved
     */
        const handleApproveSuccess = async()=>{
          try{
            handleApproveNotification()
          } catch(e){
            console.log(e);
          }
          
        }
        
        /**
         * Notification if property is succesfully approved
         */
        const handleApproveNotification =()=>{
          dispatch({
            type: "success",
            message: "Approval gotten",
            title: "Transaction Notification",
            position: "topR",
            icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
          })
        }

        /**
     * Notification if property approval fails
     */
    const handleApproveError =(e)=>{
      dispatch({
        type: "error",
        message: `Please check if you are the actual owner of this Property`,
        title: "Failed to get approval",
        position: "topR",
        icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
      })
    }

    
      /**
     * Notification to ask the user to wait
     */
      const handlePleaseWait =()=>{
        dispatch({
          type: "info",
          message: `Wait for confirmation`,
          title: "Please wait",
          position: "topR",
          icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
        })
      }

     /**
     * Notification when Wallet is not connected
     */
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
    <div className={"mt-10 mb-2 flex justify-center text-2xl"}>
    <h1> Get an approval before tranferring a property</h1>
    </div>
    <div className={"mb-12 flex justify-center text-2xl"}>
    <h2> You can only get approvals for properties you own</h2>
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

     <button onClick={handleApprove} className="px-16 mb-12 py-2 mt-4 ml-12 text-white rounded-full bg-brightRed hover:bg-brightRedLight focus:outline-none ">
       Get approval
       </button>
    <div className={"flex justify-center align-center"}>
       <button onClick={handleTransferClick} className="px-8 mb-12 py-2 ml-12 text-white rounded-lg bg-brightRed focus:outline-none">
       Tranfer Property
       </button>

    </div>

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