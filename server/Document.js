import mongoose, { Schema } from "mongoose";

const documentSchema = new Schema({
    _id : String ,
    data :Object , 
})

const Documents = mongoose.model('Documents',documentSchema)

export default Documents