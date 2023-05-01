import {nanoid} from "nanoid";

import {Schema, models, model} from "mongoose";

const UrlSchema = new Schema({
    code:{
        type:String,
        unique:true,
        default:nanoid(8)
    },
    url:{type:String, require:true},
    clicked:{type:Number, default: 0},
    owner:{type:String, default:"All"}
});

const Urls = (tableName)=> {
    if(models[tableName]===undefined){
        return  model(tableName, UrlSchema);
    }
    return models[tableName];
}

export default Urls;