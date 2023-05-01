async function handler(req,res){
    if(req.method === "GET"){
        return res.status(200).json(req.socket.remoteAddress);
    }
    return res.status(404);
}

export default handler;



