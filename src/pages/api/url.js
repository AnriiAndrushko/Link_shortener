import connectMongo from "../../../utils/connectMongo";
import Urls from "../../../models/urls";

export default async function handler(req,res){
    if(req.method === "GET"){
        await connectMongo();
        const urlList = await  Urls.find();
        return res.status(200).json(urlList );
    }else if(req.method === "POST"){
        if(!req.body.url){
            return res.status(400).json("Url is not provided");
        }
        await connectMongo();
        return await Urls.create({
            url:req.body.url,
            //specify owner by ip
        });
    }
    return res.status(404);
}