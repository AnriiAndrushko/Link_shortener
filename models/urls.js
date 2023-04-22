import {nanoid} from "nanoid";
const {Schema, models, model} = require("mongoose");

const UrlSchema = new Schema({
    code:{
        type:String,
        unique:true,
        default:nanoid()
    },
    url:{type:String, require:true},
    clicked:{type:Number, default: 0},
    owner:{type:String, default:"All"}
});

const Urls = models.Urls||model("Urls", UrlSchema);

export default Urls;