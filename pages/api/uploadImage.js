import formidable from "formidable"
const pinataSDK = require("@pinata/sdk")
const fs = require("fs")


export const config = {
    api:{
        bodyParser: false
    }
}

// This is the resolver of the upload request
export default async function Handler(req, res){
    const form = formidable()
    let finalResult
    form.parse(req, async(err, fields, file)=>{
        // How to access the file properly because of how I brought it in
        file = file.media
        //If method is not a post request
        if (req.method !== "POST") {
            
            res.setHeader("Allow", "POST");
            finalResult = "Method Not Allowed, Not a post request"
            res.status(405).json({
              data: null,
              error: "Method Not Allowed",
            });
            return;
          }

        // Check if file has a name
        if(file.originalFilename == "undefined"){
            finalResult = "No file uploaded"
            // Sent the error code to the frontend
            res.status(400).json({data: null, error: "No file found/uploaded"})
            return;
        }

        try{
        const filepath = file.filepath
        const filename = `${file.originalFilename}${Date.now()}`
         const result=  await storeImages(file, filepath, filename)
         // Store the image
         res.status(200).json({data: result, message: "File uploaded successfully"})
         finalResult = result;
        }
        catch(err){
    res.status(500).json({data: null, error: "Server error"})
    finalResult = "Server error"
    } 
})
return finalResult
}



const pinataApiKey = process.env.PINATA_API_KEY || ""
const pinataApiSecret = process.env.PINATA_API_SECRET || ""
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)

//To store images in Pinaata
async function storeImages(file, filepath, filename) {

    // Filter the file in case the are a file that in not a .png
    let response
        // Read the file as stream
        const readableStreamForFile = fs.createReadStream(filepath)
        const options = {
            pinataMetadata: {
                name: filename,
            },
        }
        try {
            // Call pinata
            await pinata
                .pinFileToIPFS(readableStreamForFile, options)
                .then((result) => {
                    response = result
                })
                .catch((err) => {
                    console.log(err)
                })
        } catch (error) {
            console.log(error)
        }
    
    // Response is a hash that we will add to our metadata
    return { response, file }
}