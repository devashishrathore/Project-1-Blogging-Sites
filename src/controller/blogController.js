const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const jwt = require("jsonwebtoken")

const createBlog = async function (req, res) {
  let data = req.body;
  let author = req.body.authorId;
  let authorFromRequest = await authorModel.findById(author);
  if (authorFromRequest) {
    let blogCreated = await blogModel.create(data);
    res.status(201).send({ data: blogCreated });
  } else {
    res.status(400).send("The author id provided is not valid");
  }
};
const getAllBlogs = async function (req, res) {
  try {
    let author = req.query.authorId;
    let category = req.query.category;
    let tags = req.query.tags;
    let subcategory = req.query.subcategory;
    // let allblogs = await blogModel.find({$and:[{$or:[{ authorId: author}, {category: category}, {tags: tags}, {subcategory: subcategory}]},{isDeleted:false},{isPublished:true}]})  //,{category: category},{tags: tags},{subcategory: subcategory}]})
    //   .select({ isDeleted: 1,isPublished:1});
    let allblogs = await blogModel.find({$or:[{ authorId: author}, {category: category}, {tags: tags}, {subcategory: subcategory}],isDeleted:false,isPublished:true})
    console.log(allblogs)
    res.status(200).send({ status: true, data: allblogs });
  } catch (err) {
    console.log(err.message);
    res.status(404).send({ msg: "Some error occured" });
  }
};
const updateBlogWithNewFeatures = async function (req, res) {
    try {
        let publishat;
        if (req.body.isPublished) {
            publishat = new Date;
        }
        let _id=req.params.blogId;
        let a= await blogModel.findById(_id)
        if (a) {
            for (const key in req.body) {
                if (key == "title") {
                    await blogModel.findOneAndUpdate({_id:a._id},{ title: req.body[key] }, { new: true })
                }
                if (key == "body") {
                    await blogModel.findOneAndUpdate({_id:a._id, isDeleted : false }, { body: req.body[key] }, { new: true })
                }
                if (key == "tags") {
                    await blogModel.findOneAndUpdate({ _id:a._id, isDeleted: false }, { $push: { tags: { $each: req.body[key] } } }, { new: true })
                }
                if (key == "subcategory") {
                    await blogModel.findOneAndUpdate({ _id:a._id, isDeleted: false }, { $push: { subcategory: { $each: req.body[key] } } }, { new: true })
                }
                if (key == "isPublished") {
                    await blogModel.findOneAndUpdate({ _id:a._id, isDeleted: false }, { isPublished: req.body[key] }, { new: true })
                }
            }
            let blog = await blogModel.findOne({ _id: a._id })
            res.status(200).send({ status: true, data: blog })
        }
        else {
            res.status(404).send({ status: false, msg: "Unable to find Blog" })
        }
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send({ msg: "Some error occured" });
    }
}
const deleteBlogById = async function (req, res) {
    deletedat = new Date();
  try {
    let id = req.params.blogId;
    let blog = await blogModel.findById(id);
    // console.log(blog)
    if (!blog) {
      let message = {
        status: false,
        msg: "invalid blog id",}
        res.status(404).send({ message: message });
      
    
    } else {
      if (blog.isDeleted == false) {
          console.log("hii")
       let a= await blogModel.findOneAndUpdate({_id:id},{isDeleted:true},{new:true})
       console.log(a) 
       res.status(200).send({ msg: "done" });
      } else {
        let message = {
          status: false,
          msg: "blog doesnot exist",
        };
        res.status(404).send({ message: message });
      }
    }
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
const deleteBlogByAttribute = async function (req, res) {
    deletedat = new Date();
  try {
    let authorId = req.query.authorId;
    tag = req.query.tag;
    subcategory = req.query.subcategory;
    category = req.query.category;
    // if(req.query.isPublished=="false" ||"true"){
    //     req.query.isPublished=false;

    // }
    // isPublished = req.query.isPublished;
    let blog = await blogModel.findOneAndUpdate({$or:[{ authorId: authorId}, {category: category}, {tags: tag}, {subcategory: subcategory},{isPublished:false}]},{isDeleted:true},{new:true});
   console.log(blog)
    if (!blog) {
      let message = {
        status: false,
        msg: "invalid blog id",

      };
      res.status(404).send({ message: message });
    }else{
        res.status(200).send({msg:'done'})
    }
    // } else {
    //   if (blog.isDeleted == false) {
    //     await blogModel
    //       .findById(blog._id)
    //       .update({ $set: { isDeleted: true } ,deletedAt:deletedat});
    //   } else {
    //     let message = {
    //       status: false,
    //       msg: "blog doesnot exist",
    //     };
    //     res.status(404).send({ message: message });
    //   }
    // }
  } catch (err) {
    res.status(500).send({ msg: err });
  }
};
const loginforblog = async function (req, res) {
  let value = req.body;

  value.isDeleted = false;

  if (value && value.email && value.password) {
    let Users = await authorModel.findOne(value);

    if (Users) {
      let payload = { authorId: Users._id };

      let token = jwt.sign(payload, "radium");

      res.header("x-api-key", token);

      res.status(200).send({ status: true, msg: "successfully login" });
    } else {
      res.status(401).send({ status: false, msg: "invalid name or password" });
    }
  } else {
    res.status(400).send({ status: false, msg: "Please enter name and password" });
  }
};




module.exports.loginforblog = loginforblog;
module.exports.deleteBlogById = deleteBlogById;
module.exports.deleteBlogByAttribute = deleteBlogByAttribute;

module.exports.updateBlogWithNewFeatures = updateBlogWithNewFeatures;
module.exports.createBlog = createBlog;
module.exports.getAllBlogs = getAllBlogs;
