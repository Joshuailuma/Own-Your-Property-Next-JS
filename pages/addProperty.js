import React, { useState, useEffect, ChangeEvent, MouseEvent, useRef} from 'react'
import Footer from '../components/Footer'
import Image from 'next/image'
import axios from "axios";
import SimpleProgressBar from '../components/SimpleProgressBar'
import { useWeb3Contract, useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import BasicNft from "../constants/BasicNft.json"
import { useNotification } from '@web3uikit/core';
import { Bell } from '@web3uikit/icons';
import NavBar from '../components/NavBar';
import { Accordion } from '@web3uikit/core'    //icons

function Products() {

  const [name, setName] = useState("")
  const [serialNumber, setSerialNumber] = useState('')
  const [description, setDescription] = useState('')
  const [progress, setProgress] = useState(0);
  const [remaining, setRemaining] = useState(0);

const [isUploaded, setIsUploaded] = useState(false) //Change state based on the new
const [isUploading, setIsUploading] = useState(false) //Change state based on the new
const dispatch = useNotification()

const [isMetadataUploaded, setIsMetadataUploaded] = useState(false) //Change state based on the new
const [isBlockUploaded, setIsBlockUploaded] = useState(false) //Change state based on the new


const [file, setFile] = useState(null);
const [previewUrl, setPreviewUrl] = useState("");
const [ipfsImageHash, setIpfsImageHash] = useState("")
const [ipfsMetadataHash, setIpfsMetadataHash] = useState("")
const ipfsMetadataHashRef = useRef(ipfsMetadataHash)
const [tokenId, setTokenId] = useState("")

const { isWeb3Enabled, account, chainId } = useMoralis()
const chainString = chainId ? parseInt(chainId).toString() : "31337"


let metadataTemplate = {
  name: name,
  description: description,
  serialNumber : serialNumber,
  image: ipfsImageHash,
}//If upload is succesful



const onSubmit = (e)=> {
  e.preventDefault()
  onUploadMetaData()
}

const preventDefault = (e)=> {
  e.preventDefault()
  }
  /*
    Function to choose image
  */
// defining the chooseImage handler
  const onChooseImage = (e) => {
    if(isWeb3Enabled){
      const fileInput = e.target; //File we chose

    if (!fileInput.files) {
      handleNoChosenFile()
      return;
    }

    //If no file is chosen
    if (!fileInput.files || fileInput.files.length === 0) {
      handleEmptyFile()
      return;
    }

    const file = fileInput.files[0];

    /** File validation/or not and image */
    if (!file.type.startsWith("image")) {
      handleInvalidImage()
      return;
    }

    /** Setting file state */
    setFile(file); // we will use the file state, to send it later to the server
    setPreviewUrl(URL.createObjectURL(file)); // we will use this to show the preview of the image

    // console.log(URL.createObjectURL(file));
    /** Reset file input */
    e.currentTarget.type = "text";
    e.currentTarget.type = "file";

    }else{
      connectWalletNotification()
    }
    
  } //Done with choose image

  /*
    Function to Cancel Image upload
  */
  const onCancelFile = (e) => {
    e.preventDefault();
    if (!previewUrl && !file) {
      return;
    }
    setFile(null);
    setPreviewUrl(null);
  };

  /*
    Function to upload Image
  */

  const onUploadImage = async (e) => {
    e.preventDefault();
  
    if (!file) {
      return;
    }
    if(isWeb3Enabled){
      try {
        setIsUploading(true)

        let startAt = Date.now(); // To keep track of the upload start time
        let formData = new FormData();
        formData.append("media", file);
  
    // Add the onUploadProgress option
  const options = {
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
  
      const percentage = (progressEvent.loaded * 100) / progressEvent.total;
      setProgress(+percentage.toFixed(2));
      // Calculate the progress duration
      const timeElapsed = Date.now() - startAt;
      const uploadSpeed = loaded / timeElapsed;
      const duration = (total - loaded) / uploadSpeed;
      setRemaining(duration);
    }
  }       
        
  const {data} = await axios.post("/api/uploadImage", formData, options);
        
        photoUploadedSuccesfully() //Show Notification
        let ipfsHashImage = data.data.response.IpfsHash
        // CHange submit button text, if the upload was successful and have gotten an ipfs hash
        if(ipfsHashImage != "undefined"){
          setIsUploaded(true)
          setIsUploading(false) //Done uploading
          setIpfsImageHash(`ipfs://${ipfsHashImage}`)
          // console.log(data);
        }
        setIsUploading(false) //Done uploading
             
    //Gotten the ipfs hash
        // console.log("File was uploaded successfully:", data.data.response.IpfsHash);
      } catch (e) {
        //Error in uploading file
        console.error(e);
        const error =
          e.response && e.response.data
            ? e.response.data.error
            : "Sorry! something went wrong.";
        handleSomethingWentWrong(error)
      }

    } else{
      connectWalletNotification()
    }
  }; // DOne with upload Image file


  /*
    Function to upload Metadata
  */
  const onUploadMetaData = async (e) => {
    // console.log("Uploading metadata");

    if(isWeb3Enabled){
      try { 
        const {data} = await axios.post('/api/uploadMetadata', metadataTemplate);
       const metadataHash = data.data.IpfsHash
    
       ipfsMetadataHashRef.current = `ipfs://${metadataHash}`
         setIpfsMetadataHash(ipfsMetadataHashRef.current)
          
         detailsUploaded() //Notification
        // console.log(`ipfsMetadataHash is ${ipfsMetadataHash}`);
        setIsMetadataUploaded(true)
    
      //Gotten the ipfs hash
          // console.log("Details was uploaded successfully:", ipfsHashImage);
        } catch (e) {
          //Error in uploading details
          console.error(e);
         const error = "Sorry! something went wrong.";
         handleSomethingWentWrong(error)
        }
    } else{
      connectWalletNotification()
    }    
  }

  /* Function that does all the property storage in blochain
  */
  const basifNftAddress = networkMapping[chainString].TransferProperty[0]
  const transferPropertyAddress = networkMapping[chainString].TransferProperty[1]

    const contractAbi = BasicNft

    const { runContractFunction: mintNft, data: dataReturned,
      error,
      isLoading,
      isFetching, } = useWeb3Contract({
      abi: contractAbi,
      contractAddress: basifNftAddress, // specify the networkId
      functionName: "mintNft",
      params: {tokenUri: ipfsMetadataHash},
    })

    const { runContractFunction: approve, data: dataReturnedForApproval,
      error: approvalError,
      isLoading: approvalIsLoading,
      isFetching: approvalIsFetching } = useWeb3Contract({
      abi: contractAbi,
      contractAddress: basifNftAddress, // specify the networkId
      functionName: "approve",
      params: {to: transferPropertyAddress,
      tokenId: tokenId},
    })

    const uploadToBlockchain =async (e)=>{
      e.preventDefault()
      if(isWeb3Enabled){

        // Store property on the blockchain and Emit an event
      const blockhainStoreResult = await mintNft()
      const mintTxReceipt = await blockhainStoreResult.wait();
      const tokenIdGottenBigNumber = mintTxReceipt.events[0].args.tokenId;
      const tokenIdGotten = tokenIdGottenBigNumber.toNumber()
        setTokenId(tokenIdGotten)
        setIsBlockUploaded(true)

      if(tokenIdGotten){
        handleSuccessNotification()
     } 
     if(error){
      handleErrorUploadNotification(error)
     }
      } else{
        connectWalletNotification()
      }
    }

    const approveProperty =async() =>{
      if(isWeb3Enabled){
      const approvedProperty = await approve({
        onSuccess: handleApproveSuccess,
        onError: (error)=>{handleApproveError(error)}
      })

      } else{
        connectWalletNotification()
      }
    }

    /**
     * For notifications
     */    
    const handleSuccessNotification =()=>{
      dispatch({
        type: "success",
        message: "Stored succesfully in blockchain. PLEASE WAIT for confirmation. This might take more than 2 minutes",
        title: "Transaction Notification 3/4",
        position: "topR",
        icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
      })
    }

    const handleErrorUploadNotification =(e)=>{
      dispatch({
        type: "error",
        message: `Failed to store ${e.message}`,
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

    const handleApproveSuccess = async(tx)=>{
      try{
        tx.wait(1)
        handleApproveNotification(tx)
      } catch(e){
        console.log(e);
      }
      
    }
    
    const handleApproveNotification =()=>{
      dispatch({
        type: "success",
        message: "Approval gotten",
        title: "Transaction Notification 4/4✅",
        position: "topR",
        icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
      })
    }

    const handleApproveError =(e)=>{
      dispatch({
        type: "error",
        message: `Error getting approval ${e.message}`,
        title: "Transaction Notification",
        position: "topR",
        icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
      })
    }

    const handleNoChosenFile =(e)=>{
      dispatch({
        type: "error",
        message: `No file was chosen ${e.message}`,
        title: "Notification",
        position: "topR",
        icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
      })
    }

    const handleEmptyFile =()=>{
      dispatch({
        type: "error",
        message: `File list is empty`,
        title: "Notification",
        position: "topR",
        icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
      })
    }

    const handleInvalidImage =()=>{
      dispatch({
        type: "error",
        message: `Please select a valid image`,
        title: "Notification",
        position: "topR",
        icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
      })
    }

    const handleSomethingWentWrong =(e)=>{
      dispatch({
        type: "error",
        message: e,
        title: "Notification",
        position: "topR",
        icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
      })
    }

    const photoUploadedSuccesfully =()=>{
      dispatch({
        type: "success",
        message: "Photo uploaded successfuly",
        title: "Notification 1/4",
        position: "topR",
        icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
      })
    }

    const detailsUploaded =()=>{
      dispatch({
        type: "success",
        message: "Details uploaded",
        title: "Notification 2/4",
        position: "topR",
        icon: <Bell fontSize="50px" color="#000000" title="Bell Icon" />
      })
    }


return (
    <div>
     <NavBar/>
       <section className="flex flex-col md:flex-row mx-20">
        <div className={"flex flex-col mt-12 "}>
        <h1 className="text-4xl font-bold md:text-5xl"> Store a Property</h1>
        <p className="text-2xl my-6 text-darkGrayishBlue">
         Type in the details✍🏼
            </p>     
            <form action="" className={"mt-6, max-w-lg"} onSubmit={onSubmit}>
              <div className=" flex flex-col space-y-6">             
             {/* Name */}

              <label htmlFor="" className="text-left">Name</label>
              <input
                type='text'
                required maxLength={"50"}
                className="px-6 py-3 align-middle rounded-lg border-solid outline-double	w-80"
                placeholder="E.g IPhone 14 pro" value={name} 
                onChange={(e)=> setName(e.target.value)} onSubmit={preventDefault}
              />


            {/* Serial no */}

          <label htmlFor="" className="text-left">Serial number</label>
              <input
                type='text'
                required maxLength={"50"}
                className="px-6 py-3 rounded-lg border-solid outline-double	w-80"
                placeholder="Enter the serial No" value={serialNumber} 
                onChange={(e)=> setSerialNumber(e.target.value)}
              />

              {/* Description */}

          <label htmlFor="" className="text-left">Description</label>
              <input
                type='text'
                required maxLength={"500"}
                className="px-6 py-3 rounded-lg border-solid outline-double	w-80"
                placeholder="Give us more details"
                value={description} 
                onChange={(e)=> setDescription(e.target.value)}
              />
              </div>

              {/* Upload image. If a file has been selected, convert and view it in a preview URL*/}
              <div className="flex flex-col gap-4 py-4 mt-4">
              <div className="flex-grow">
                {previewUrl ? (
                  <div className="mx-auto w-80">
                    <Image
                      alt="file uploader preview"
                      objectFit="cover"
                      src={previewUrl}
                      width={320}
                      height={218}
                      layout="fixed"
                    />
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-full py-3 transition-colors duration-150 cursor-pointer hover:text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-14 h-14"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      />
                    </svg>
                    <strong className="text-sm font-medium">
                      Select an image
                    </strong>
                    <input
                      className="block w-0 h-0"
                      name="file"
                      type="file"
                      onChange={onChooseImage}
                    />
                  </label>
                )}
              </div>
              <div className="flex mt-4 md:mt-0 flex-col justify-center gap-1.5 rounded-md">
              <button
                  disabled={!previewUrl}
                  onClick={onUploadImage}
                  className="w-1/2 mx-32 py-3 text-sm font-medium text-white transition-colors duration-300 rounded-lg bg-blue-800 md:w-auto md:text-base disabled:bg-brightRed"
                >
                  Upload image
                </button>

                <button
                  disabled={!previewUrl}
                  onClick={onCancelFile}
                  className="w-1/2 mx-32 py-3 text-sm font-medium text-white transition-colors duration-300 rounded-lg bg-blue-800 md:w-auto md:text-base disabled:bg-brightRed"
                >
                  Cancel image
                </button>
                
              </div>
            </div>

            <div className='mt-7'>
            <SimpleProgressBar progress={progress} remaining={remaining}/>
            </div>


        {/* <FileUpload className={'justify-center  mt-6'} name="demo" url="./api/upload" maxFileSize="3000000" onError={uploadSuccess} accept="image/*" onUpload={uploadFailed}></FileUpload> */}
              <input type="submit" disabled={!isUploaded} value={"Upload details"} className={isUploading ? "animate-spin spinner-border h-8 w-8 border-b-2 rounded-full" :"px-16 mb-12 py-2 mt-4 ml-12 text-white rounded-lg bg-blue-800 disabled:bg-brightRed focus:outline-none"} />

            </form>
            <div className={"max-w-lg"} >
            <button onClick={uploadToBlockchain} disabled={!isMetadataUploaded}  className={isLoading || isFetching ? "animate-spin spinner-border h-8 w-8 border-b-2 rounded-full" :"px-10 mb-12 py-2 mt-4 ml-12 text-white rounded-lg bg-blue-800 disabled:bg-brightRed focus:outline-none"}>
            {"Upload to blockchain"}
               </button>

               <div className={isMetadataUploaded && !isBlockUploaded ? "font-bold" : "hidden"}>Please wait...</div>

               <button onClick={approveProperty} disabled={!isBlockUploaded}  className={approvalIsLoading || approvalIsFetching ? "animate-spin spinner-border h-8 w-8 border-b-2 rounded-full" : "px-7 mb-12 py-2 mt-4 ml-12 text-white rounded-lg bg-blue-800 disabled:bg-brightRed focus:outline-none"}>
            {"Approve stored property"}
               </button>
            </div>
            </div>

            {/* @2nd flex */}
           <div>
        <Accordion
          id="accordion"
          hasLockIcon
          isExpanded
        title="How to store a Property"
        className="ml-10 my-12">

        
<dl className="max-w-md text-gray-900 divide-y divide-black-200 dark:text-black dark:divide-gray-700 mx-14">
    <div className="flex flex-col pb-3">
        <dt className="mb-1 md:text-lg font-semibold text-blue-800">1. Select an image</dt>
        <dd className="text-lg ">Click on the icon that looks like a cloud</dd>
    </div>
    <div className="flex flex-col py-3">
        <dt className="mb-1 md:text-lg font-semibold text-blue-800">2. Upload an image</dt>
        <dd className="text-lg ">Click on the Upload image button</dd>
    </div>
    <div className="flex flex-col pt-3">
        <dt className="mb-1 text-blue-800 md:text-lg font-semibold">3. Upload details</dt>
        <dd className="text-lg">Click on the Upload details button</dd>
    </div>
    <div className="flex flex-col pt-3">
        <dt className="mb-1 text-blue-800 md:text-lg font-semibold">4. Upload to blockchain</dt>
        <dd className="text-lg">Click on the Upload to blockchain button and wait until the &apos;Please wait...&apos; message disappears.
        This may take more than 2 minutes depending on the state of the blockchain</dd>
    </div>
    <div className="flex flex-col pt-3 mb-4">
        <dt className="mb-1 text-blue-800 md:text-lg font-semibold">5. Approve stored property</dt>
        <dd className="text-lg ">Click on the Approve stored property button to enable you transfer it in future.</dd>
    </div>
</dl>


</Accordion>
           </div>
        </section>

        <Footer/>
    </div>
    
  )
}

export default Products
