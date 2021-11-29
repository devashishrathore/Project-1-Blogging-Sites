const authorModel = require("../models/authorModel")
const blogModel=require("../models/blogModel")

const createBlog=async function(req,res){
    let data=req.body
    let author=req.body.authorId
    let authorFromRequest=await authorModel.findById(author)
    if(authorFromRequest){
        let blogCreated= await blogModel.create(data)
        res.status(201).send({data:blogCreated})
        
    }else{
        res.status(400).send('The author id provided is not valid')
    };

}
const getAllBlogs = async function (req, res) {
    try {
        let author = req.query.authorId
        let category = req.query.category
        let tags = req.query.tags
        let subcategory = req.query.subcategory
        let allblogs = await blogModel.find({ author: author, category: category, tags: tags, subcategory: subcategory }).select({ isDeleted: false, isPublished: true })
        res.status(200).send({ status: true, data: allblogs })
    }
    catch (err) {
        console.log(err.message);
        res.status(404).send({ msg: "Some error occured" });
    }
}
const updateBlogWithNewFeatures = async function (req, res) {

    publishat= new Date;

    let blog = await blogModel.findOneAndUpdate({_id:req.body._id, isDeleted:false}, {title:req.body.title, body:req.body.body, $push: { tags: { $each: req.body.tags } }, $push: { subcategory: { $each: req.body.subcategory } }, publishedAt:publishat, isPublished:true}, { new: true })

    if (savedData) {

        res.status(200).send({ status: true, data: blog })

    }

    else {

        res.status(404).send({ status: false, msg: "Unable to find Blog" })

    }

}
const deleteBlogById = async function (req, res) {
    try {
        let id = req.params.blogId
        let blog = await blogModel.findById(id)
        if (!blog) {
            let message = {
                status: false,
                msg: "invalid blog id"
            }
            res.status(404).send({ 'message': message })
        }
        else {
            if (blog.isDeleted == "false") {
                await blogModel.findById(id).update({ $set: { isDeleted: false } })
                res.status(200).send({'msg':'done'})
            }
            else {
                let message = {
                    status: false,
                    msg: "blog doesnot exist"
                              }
                res.status(404).send({ 'message': message })
                 }
             
        }
    }
        catch(err){
        res.status(500).send({"message":err})
    }
}
const deleteBlogByAttribute = async function (req, res) {
    try {
        let authorId = req.query.authorId
        tag=req.query.tag
        subcategory=req.query.subcategory
        unpublished=req.query.unpiblished
        let blog = await blogModel.find({'authorId':authorId,'tags':tag,'subcategory':subcategory,'unPublished':unpublished})
        if (!blog) {
            let message = {
                status: false,
                msg: "invalid blog id"
            }
            res.status(404).send({ 'message': message })
        }
        else {
            if (blog.isDeleted == "false") {
                await blogModel.findById(blog.id).update({ $set: { isDeleted: false } })
            }
            else {
                let message = {
                    status: false,
                    msg: "blog doesnot exist"
                }
                res.status(404).send({ 'message': message })
            }
        }
    }
    catch(err){
        res.status(500).send({'msg':err})
    }
}
module.exports.deleteBlogById=deleteBlogById
module.exports.deleteBlogByAttribute=deleteBlogByAttribute
   

module.exports.updateBlogWithNewFeatures = updateBlogWithNewFeatures;
module.exports.createBlog=createBlog
module.exports.getAllBlogs=getAllBlogs