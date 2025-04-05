const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    originalName:{
        type:String,
        required:true
    },
    s3Key:{
        type:String,
        required:true,
        unique:true
    },
    size:{
        type:Number,
        required:true
    },
    mimeType:{
        type:String,
        required:true
    },
    uploadDate:{
        type:Date,
        default:Date.now
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('File', FileSchema);