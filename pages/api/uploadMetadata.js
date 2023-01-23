import formidable from "formidable"
const pinataSDK = require("@pinata/sdk")
const fs = require("fs")

/// To upload the metadata

// This is the resolver of the upload request
export default async function Handler(req, res){

    let finalResult
        // How to access the req.body properly becaus of how i brought it in

        if (req.method !== "POST") {
            //If it is not a post request
            res.setHeader("Allow", "POST");
            finalResult = "Method Not Allowed, Not a post request"
            res.status(405).json({
              data: null,
              error: "Method Not Allowed",
            });
            return;
          }

          //Check if req.body has a name
        if(req.body == "undefined"){
            finalResult = "No data uploaded"
            res.status(400).json({data: null, error: "No data found/uploaded"})
            return;
        }

        try{
        // Store the metadata
         const result=  await storeTokenUriMetadata(req.body)
         res.status(200).json({data: result, message: "Data uploaded successfully"})
         finalResult = result;
        }        

     catch(err){
        // If there is an error, send it to the frontend console
    res.status(500).json({data: null, error: "Server error"})
    console.log(err);
    finalResult = "Server error"
    } 
return finalResult
}



const pinataApiKey = process.env.PINATA_API_KEY || ""
const pinataApiSecret = process.env.PINATA_API_SECRET || ""
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)

//
//The full function store the metadata
//
async function storeTokenUriMetadata(metadata) {
    const options = {
        pinataMetadata: {
            name: `${metadata.name}${Date.now()}`,
        },
    }
    try {
        // Pinning it to ipfs using pinata service
        const response = await pinata.pinJSONToIPFS(metadata, options)
        return response
    } catch (error) {
        //If there is an error
        console.log(error)
    }
    // Send this to frontend
    return { response }
  }