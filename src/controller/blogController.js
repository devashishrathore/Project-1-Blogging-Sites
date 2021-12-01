const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const jwt = require("jsonwebtoken");

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
    try{
        let author = req.query.authorId;
        let category = req.query.category;
        let tags = req.query.tags;
        let subcategory = req.query.subcategory;
        
        let query = {};
        if (author) {
        query.authorId = author;
        
        }
        if (category) {
        query.category = category;
        
        }
        if (tags) {
        query.tags = tags;
        
        }
        if (subcategory) {
        query.subcategory = subcategory;
        }
        query.isDeleted=false
        query.isPublished=true

        let allblogs = await blogModel.find(query)

        console.log(allblogs)
        res.status(200).send({ status: true, data: allblogs });
        }catch (err) {
            console.log(err.message);
            res.status(404).send({ msg: "Some error occured" });
        }
};  
        
const updateBlogWithNewFeatures = async function (req, res) {
    try {
        const blogFromRequest = req.body;
        
        const blogFromDB = await blogModel.findById({ _id:req.params.blogId, isDeleted: false });
        
        const { body, title, tags, subcategory, isPublished} = blogFromRequest;
        
        if (!blogFromDB) {
        return res.status(404).send({ status: false, msg: "Unable to find Blog" })
        
        }
        
        if (title) {
          await blogModel.findByIdAndUpdate({_id:req.params.blogId},{ $set: {title: title} }, { new: true })
          }
        if (body) {
           await blogModel.findByIdAndUpdate({_id:req.params.blogId}, { $set: {body: body} }, { new: true })
        }
        if (tags) {
           await blogModel.findByIdAndUpdate({_id:req.params.blogId}, { $addToSet: { tags: {$each: tags} } }, { new: true })
        }
        if (subcategory) {
           await blogModel.findByIdAndUpdate({_id:req.params.blogId}, { $addToSet: { subcategory: {$each: subcategory} } }, { new: true })
        }
        if (isPublished) {
           await blogModel.findByIdAndUpdate({_id:req.params.blogId}, { $set: {isPublished: isPublished, publishedAt: new Date()} }, { new: true })
          }
        const updatedBlog=await blogModel.findById({_id:req.params.blogId});
        
           return res.status(200).send({ status: true, msg: "Blog updated successfully", data: updatedBlog });
        
        } catch (error) {
            return res.status(500).send({ status: false, msg: "Internal Server Error" });
        
        }
};
     
  const deleteBlogById = async function (req, res) {
    deletedat = new Date();
    try {
      let id = req.params.blogId;
      let blog = await blogModel.findById(id);
      // console.log(blog)
      if (!blog) {
        let message = {
          status: false,
          msg: "invalid blog id",
        };
        res.status(404).send({ message: message });
      } else {
        if (blog.isDeleted == false) {
          console.log("hii");
          let a = await blogModel.findOneAndUpdate(
            { _id: id },
            { isDeleted: true },
            { new: true }
          );
          console.log(a);
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
      let author = req.query.authorId;
      let tags = req.query.tag;
      let subcategory = req.query.subcategory;
      let category = req.query.category;
      
      let query = {};
if (author) {
query.authorId = author;

}
if (category) {
query.category = category;

}
if (tags) {
query.tags = tags;

}
if (subcategory) {
query.subcategory = subcategory;
}
      /////
let blog = await blogModel.findOneAndUpdate(query,{ isDeleted: true ,isPublished:false},{ new: true });
      console.log(blog);
      if (!blog) {
        let message = {
          status: false,
          msg: "invalid blog id",
        };
        res.status(404).send({ message: message });
      } else {
        res.status(200).send({ msg: "done" });
      }
     
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
        res
          .status(401)
          .send({ status: false, msg: "invalid name or password" });
      }
    } else {
      res
        .status(400)
        .send({ status: false, msg: "Please enter name and password" });
    }
  };



module.exports.loginforblog =loginforblog;
module.exports.deleteBlogById = deleteBlogById;
module.exports.deleteBlogByAttribute = deleteBlogByAttribute;

module.exports.updateBlogWithNewFeatures = updateBlogWithNewFeatures;
module.exports.createBlog = createBlog;
module.exports.getAllBlogs = getAllBlogs;
