import connectMongo from "../../../utils/connectMongo";
import Urls from "../../../models/urls";
import {nanoid} from "nanoid";




export default async function handler(req,res){
    if(req.method === "GET"){
        let userIP = req.headers["x-forwarded-for"].split(',')[0].replaceAll('"','');
        await connectMongo();
        const urlList = await  Urls.find({owner : { $in: [userIP, 'All']}});
        return res.status(200).json(urlList);
    }else if(req.method === "POST"){
        if(!req.body.url){
            return res.status(400).json("Url is not provided");
        }
        await connectMongo();
        const newUrl = await Urls.create({
            code: nanoid(8),
            url:req.body.url,
            owner: req.body.userIP,
        });
        return res.status(201).json(newUrl);
    }
    return res.status(404);
}

