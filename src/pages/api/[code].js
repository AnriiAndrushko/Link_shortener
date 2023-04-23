import Urls from "../../../models/urls";
import connectMongo from "../../../utils/connectMongo";

export default async function handler(req,res){
    if(req.method==="GET") {
        await connectMongo();
        const data = await Urls.findOne(req.query);
        if (data) {
            data.clicked++;
            data.save();
            return res.redirect(data.url);
        } else {
            return res.status(404);
        }
    }else if(req.method==="DELETE"){
        await connectMongo();
        const result = await Urls.deleteOne(req.query);

        if (result.acknowledged) {
            return res.status(200).json("Deleted successfully");
        } else {
            return res.status(404);
        }
    }
    return res.status(400);
}