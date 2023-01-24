import { mailOptions, transporter } from "../../utils/nodemailer";

//
//For sends to send message to the contact specified
//
export default async function Handler(req, res){
    if(req.method === "POST"){
        const {message} = req.body;
        console.log(message);
        try{
            await transporter.sendMail({
                ...mailOptions,
                subject: "From Own Your Property",
                html: `<p>${message}</p>`
                
            })
            res.status(200).json({success: true})
        } catch(e){
            console.log(e);
            res.status(400).json({success: false, message: e})

        }
    }
}