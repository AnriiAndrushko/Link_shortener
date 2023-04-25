import {nanoid} from "nanoid";
const {Schema, models, model} = require("mongoose");

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

const schemes = {};

const Urls = (tableName)=> {
    if(schemes[tableName]!==undefined){
        schemes[tableName] = model(tableName, UrlSchema);
    }
    return models[tableName];
}

export default Urls;