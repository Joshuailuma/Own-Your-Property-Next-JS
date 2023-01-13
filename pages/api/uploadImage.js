import formidable from "formidable"
const pinataSDK = require("@pinata/sdk")
const fs = require("fs")


export const config = {
    api:{
        bodyParser: false
    }
}

// let josh
// export const globalVariable ={
//     josh: ""
// }

// This is the resolver of the upload request

export default async function Handler(req, res){
    const form = formidable()
    let finalResult
    form.parse(req, async(err, fields, file)=>{
        // How to access the file properly becaus of how i brought it in
        file = file.media
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

          //Check if file has a name
        if(file.originalFilename == "undefined"){
            finalResult = "NO file uploaded"
            res.status(400).json({data: null, error: "No file found/uploaded"})
            return;
        }

        try{
        const filepath = file.filepath

        const filename = `${file.originalFilename}${Date.now()} `
         const result=  await storeImages(file, filepath, filename)
         res.status(200).json({data: result, message: "File uploaded successfully"})
         finalResult = result;
        }        

     catch(err){
    res.status(500).json({data: null, error: "Server error"})
    // console.log(err);
    finalResult = "Server error"
    } 
})
console.log(finalResult);
return finalResult
}



const pinataApiKey = process.env.PINATA_API_KEY || ""
const pinataApiSecret = process.env.PINATA_API_SECRET || ""
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)

async function storeImages(file, filepath, filename) {

    // Filter the file in case the are a file that in not a .png

    let response
    console.log("Uploading to IPFS")

        console.log("1st index")

        const readableStreamForFile = fs.createReadStream(filepath)
        const options = {
            pinataMetadata: {
                name: filename,
            },
        }
        try {
            await pinata
                .pinFileToIPFS(readableStreamForFile, options)
                .then((result) => {
                    response = result
                })
                .catch((err) => {
                    // console.log(err)
                })
        } catch (error) {
            // console.log(error)
        }
    
    // Response is a hash that we will add to our metadata
    return { response, file }
}


// module.exports = { storeImages, storeTokenUriMetadata }
