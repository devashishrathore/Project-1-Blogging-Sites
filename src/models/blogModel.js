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
        required:true     //string, mandatory, examples: [technology, entertainment, life style, food, fashion]},
    },
    subcategory:[String], //{array of string, examples[technology-[web development, mobile development, AI, ML etc]] }, 
     
    // createdAt, updatedAt, //00/00/0000
     
     deletedAt:String, //{when the document is deleted}, 
     isDeleted: {type:Boolean, default: false}, 
     publishedAt:String, //{when the blog is published}, 
     isPublished: {type:Boolean, default: false}

},{timestamps:true});
module.exports=mongoose.model('blog',blogSchema)