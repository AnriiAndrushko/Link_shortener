import Urls from "../../../models/urls";
import connectMongo from "../../../utils/connectMongo";

export default async function handler(req,res){
    if(req.method!=="GET"){
        return res.status(400);
    }
    await connectMongo();
    const data = await Urls.findOne(req.query);
    if(data){
        data.clicked++;
        data.save();
        return res.redirect(data.url);
    }else {
        return res.status(404);
    }
}