import React, { useState, useEffect, ChangeEvent, MouseEvent, useRef} from 'react'
import Footer from '../component/Footer'
import Image from 'next/image'
import axios from "axios";
import SimpleProgressBar from '../component/SimpleProgressBar'
import { useWeb3Contract, useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import BasicNft from "../constants/BasicNft.json"

function products() {

  const [name, setName] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [description, setDescription] = useState('')
  const [progress, setProgress] = useState(0);
  const [remaining, setRemaining] = useState(0);

const [isUploaded, setIsUploaded] = useState(false) //Change state based on the new
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
      alert("No file was chosen");
      return;
    }

    //If no file is chosen
    if (!fileInput.files || fileInput.files.length === 0) {
      alert("Files list is empty");
      return;
    }

    const file = fileInput.files[0];

    /** File validation/or not and image */
    if (!file.type.startsWith("image")) {
      alert("Please select a valide image");
      return;
    }

    /** Setting file state */
    setFile(file); // we will use the file state, to send it later to the server
    setPreviewUrl(URL.createObjectURL(file)); // we will use this to show the preview of the image

    console.log(URL.createObjectURL(file));
    /** Reset file input */
    e.currentTarget.type = "text";
    e.currentTarget.type = "file";

    }else{
      alert("Please first connect a wallet")
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
           
        alert("Photo was uploaded successfully", data)
        let ipfsHashImage = data.data.response.IpfsHash
        // CHange submit button text, if the upload was successful and have gotten an ipfs hash
        if(ipfsHashImage != "undefined"){
          setIsUploaded(true)
          setIpfsImageHash(`ipfs://${ipfsHashImage}`)
          console.log(data);
        }
             
    //Gotten the ipfs hash
        console.log("File was uploaded successfully:", data.data.response.IpfsHash);
      } catch (e) {
        //Error in uploading file
        console.error(e);
        const error =
          e.response && e.response.data
            ? e.response.data.error
            : "Sorry! something went wrong.";
        alert(error);
      }

    } else{
      alert("Please connect an account")
    }
  }; // DOne with upload Image file


  /*
    Function to upload Metadata
  */
  const onUploadMetaData = async (e) => {
    console.log("Uploading metadata");

    if(isWeb3Enabled){
      try { 
        const {data} = await axios.post('/api/uploadMetadata', metadataTemplate);
       const metadataHash = data.data.IpfsHash
    
       ipfsMetadataHashRef.current = `ipfs://${metadataHash}`
         setIpfsMetadataHash(ipfsMetadataHashRef.current)
          
         alert("Details uploaded")
        console.log(`ipfsMetadataHash is ${ipfsMetadataHash}`);
        setIsMetadataUploaded(true)
    
      //Gotten the ipfs hash
          // console.log("Details was uploaded successfully:", ipfsHashImage);
        } catch (e) {
          //Error in uploading details
          console.error(e);
         const error = "Sorry! something went wrong.";
          alert(error);
        }
    } else{
      alert("Please connect a wallet")
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
      const mintTxReceipt = await blockhainStoreResult.wait(1);
      const tokenIdGottenBigNumber = mintTxReceipt.events[0].args.tokenId;
      const tokenIdGotten = tokenIdGottenBigNumber.toNumber()
        setTokenId(tokenIdGotten)
        setIsBlockUploaded(true)

      if(tokenIdGotten){
       alert("Stored succesfully in blockchain")
        console.log(tokenIdGotten);
     } 
     if(error){
      alert("Blockchain Storage failed")
     }
      } else{
        alert("Please first connect a wallet")
      }
    }

    const approveProperty =async() =>{
      if(isWeb3Enabled){
      const approvedProperty = await approve()
      if(approvedProperty){
        alert("Property approved")
        console.log(approvedProperty);
      } 
      if(approvalError){
        console.log(approvalError);
        alert("Property not approved")
      }

      } else{
        alert("Please connect wallet")
      }
    }


return (
    <div>
       <section className="flex flex-col mt-12 mx-20">
        <h1 className="text-4xl font-bold md:text-5xl"> Create property</h1>
        <p className="text-2xl mt-6 text-darkGrayishBlue">
         Type in the details ????
            </p>     
            <form action="" className={"mt-6, max-w-lg"} onSubmit={onSubmit}>
              <div className=" flex flex-col space-y-6">             
             {/* Name */}

              <label htmlFor="" className="text-left">Name</label>
              <input
                type='text'
                required maxLength={"50"}
                class="px-6 py-3 align-middle rounded-lg border-solid outline-double	w-80"
                placeholder="E.g IPhone 14 pro" value={name} 
                onChange={(e)=> setName(e.target.value)} onSubmit={preventDefault}
              />


            {/* Serial no */}

          <label htmlFor="" className="text-left">Serial number</label>
              <input
                type='text'
                required maxLength={"50"}
                class="px-6 py-3 rounded-lg border-solid outline-double	w-80"
                placeholder="Enter the serial No" value={serialNumber} 
                onChange={(e)=> setSerialNumber(e.target.value)}
              />

              {/* Description */}

          <label htmlFor="" className="text-left">Description</label>
              <input
                type='text'
                required maxLength={"500"}
                class="px-6 py-3 rounded-lg border-solid outline-double	w-80"
                placeholder="Give us more details"
                value={description} 
                onChange={(e)=> setDescription(e.target.value)}
              />
              </div>

              {/* Upload image. If a file has been selected, convert and view it in a preview URL*/}
              <div className="flex flex-col md:flex-row gap-1.5 md:py-4">
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
              <div className="flex mt-4 md:mt-0 md:flex-col justify-center gap-1.5">
                <button
                  disabled={!previewUrl}
                  onClick={onCancelFile}
                  className="w-1/2 px-4 py-3 text-sm font-medium text-white transition-colors duration-300 bg-gray-700 rounded-sm md:w-auto md:text-base disabled:bg-gray-400 hover:bg-gray-600"
                >
                  Cancel file
                </button>
                <button
                  disabled={!previewUrl}
                  onClick={onUploadImage}
                  className="w-1/2 px-4 py-3 text-sm font-medium text-white transition-colors duration-300 bg-gray-700 rounded-sm md:w-auto md:text-base disabled:bg-gray-400 hover:bg-gray-600"
                >
                  Upload file
                </button>
              </div>
            </div>
            <SimpleProgressBar progress={progress} remaining={remaining}/>


        {/* <FileUpload className={'justify-center  mt-6'} name="demo" url="./api/upload" maxFileSize="3000000" onError={uploadSuccess} accept="image/*" onUpload={uploadFailed}></FileUpload> */}
              <input type="submit" disabled={!isUploaded} value={isUploaded ? "Upload details" : "Upload image first"} className="px-16 mb-12 py-2 mt-4 ml-12 text-white rounded-full bg-brightRed hover:bg-brightRedLight focus:outline-none" />

            </form>
            <button onClick={uploadToBlockchain} disabled={!isMetadataUploaded}  className="px-16 mb-12 py-2 mt-4 ml-12 text-white rounded-full bg-brightRed hover:bg-brightRedLight focus:outline-none">
            {isMetadataUploaded ? "Upload to blockchain" : "Upload Details first"}
               </button>

               <button onClick={approveProperty} disabled={!isBlockUploaded}  className="px-16 mb-12 py-2 mt-4 ml-12 text-white rounded-full bg-brightRed hover:bg-brightRedLight focus:outline-none">
            {isBlockUploaded ? "Approve stored property" : "Upload to blockchain first"}
               </button>

        </section>


        <Footer/>
    </div>
    
  )
}

export default products

// export const getServerSideProps = async () => {
//   // ??? Can use fs here (runs only on the server)
//   console.log(fs)

//   return {
//     props: {}, // will be passed to the page component as props
//   }
// };