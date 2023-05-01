import connectMongo from "../../../../utils/connectMongo";
import Urls from "../../../../models/urls";
import {nanoid} from "nanoid";


async function handler(req,res){
    const { tableName } = req.query;
    if(req.method === "GET"){
        let userIP = req.query.userIP;
        await connectMongo();
        const urlList = await  Urls(tableName).find({owner : { $in: [userIP, 'All']}});
        return res.status(200).json(urlList);
    }else if(req.method === "POST"){
        if(!req.body.url){
            return res.status(400).json("Url is not provided");
        }
        await connectMongo();
        const newUrl = await Urls(tableName).create({
            code: nanoid(8),
            url:req.body.url,
            owner: req.body.userIP,
        });
        return res.status(201).json(newUrl);
    }
    return res.status(404);
}

//insecure because no login system so can pass any ip

export default handler;