import formidable from "formidable"
const pinataSDK = require("@pinata/sdk")
const fs = require("fs")


// This is the resolver of the upload request

export default async function handler(req, res){

    let finalResult
        // How to access the req.body properly becaus of how i brought it in
        // req.body = req.body.media
        // console.log(req?.body);

        if (req.method !== "POST") {
            console.log("hello");
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

         const result=  await storeTokenUriMetadata(req.body)
         res.status(200).json({data: result, message: "Data uploaded successfully"})
         finalResult = result;
        }        

     catch(err){
    res.status(500).json({data: null, error: "Server error"})
    console.log(err);
    finalResult = "Server error"
    } 
console.log(finalResult);
return finalResult
}



const pinataApiKey = process.env.PINATA_API_KEY || ""
const pinataApiSecret = process.env.PINATA_API_SECRET || ""
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)


async function storeTokenUriMetadata(metadata) {
    const options = {
        pinataMetadata: {
            name: `${metadata.name}${Date.now()}`,
        },
    }
    try {
        const response = await pinata.pinJSONToIPFS(metadata, options)
        return response
    } catch (error) {
        console.log(error)
    }
    return { response }
  }


// module.exports = { storeImages, storeTokenUriMetadata }
