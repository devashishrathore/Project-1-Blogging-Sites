const express=require('express')
const mongoose=require('mongoose')

const blogSchema=new mongoose.Schema({

    title: {
        type:String,
        required:true
    }, 
    body: {
        type:String,
        required:true}, 
    authorId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'author' 
        },
    tags:{type:[String]}, //{array of string}, 
    category: {
        type:[String],
        required:true     
    },
    subcategory:[String], 
     
    deletedAt:String,  
     isDeleted: {type:Boolean, default: false}, 
     publishedAt:String,  
     isPublished: {type:Boolean, default: false}

},{timestamps:true});
module.exports=mongoose.model('blog',blogSchema)