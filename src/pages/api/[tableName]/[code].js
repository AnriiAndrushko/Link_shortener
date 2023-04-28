import Urls from "../../../../models/urls";
import connectMongo from "../../../../utils/connectMongo";


export default async function handler(req,res){
    const { code, tableName } = req.query;

    if(req.method==="GET") {
        await connectMongo();
        const data = await Urls(tableName).findOne({code:code});
        if (data) {
            data.clicked++;
            data.save();
            return res.redirect(data.url);
        } else {
            return res.status(404).json("Incorrect url");
        }
    }else if(req.method==="DELETE"){
        await connectMongo();
        const result = await Urls(tableName).deleteOne({code:code});
        if (result.deletedCount===1) {
            return res.status(200).json("Deleted successfully");
        } else {
            return res.status(404);
        }
    }
    return res.status(400);
}