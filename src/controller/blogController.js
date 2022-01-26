const mongoose = require("mongoose")
const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel");

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)   //for checking authorId which is comming from request body is correct or not or user and put some random value to it.
}

const isValidArray = function (arrayToCheck) {
  return Array.isArray(arrayToCheck)
}

const createBlog = async function (req, res) {
  try {
    let requestBody = req.body
    const { title, body, authorId, tags, category, subcategory, isPublished } = requestBody;

    if (!isValidObjectId(authorId)) {
      res.status(400).send({ status: false, message: `${authorId} is not a valid author id` })
    }
    const author = await authorModel.findById(authorId);
    if (!author) {
      res.status(400).send({ status: false, message: `Author does not exit` })
    }
    const blogData = {
      title,
      body,
      tags,
      authorId,
      category,
      subcategory,
      isPublished: isPublished ? isPublished : false,
      publishedAt: isPublished ? new Date() : null
    }
    const newBlog = await blogModel.create(blogData)
    res.status(201).send({ status: true, message: 'New blog created successfully', data: newBlog })
  } catch (error) {
    console.log(error)
    res.status(500).send({ status: false, msg: "Something went wrong", message: error.message });
  }
}

const getAllBlogs = async function (req, res) {
  try {
    const filterQuery = { isDeleted: false, deletedAt: null, isPublished: true }
    const queryParams = req.query

    const { authorId, category, tags, subcategory } = queryParams

    if ((authorId) && isValidObjectId(authorId)) {
      filterQuery['authorId'] = authorId;
    }
    if (category) {
      filterQuery['category'] = category.trim();

    }
    if (tags) {
      filterQuery['tags'] = tags.trim();

    }
    if (subcategory) {
      filterQuery['subcategory'] = subcategory.trim();
    }

    let blogs = await blogModel.find(filterQuery)
    if (Array.isArray(blogs) && blogs.length === 0) {   //this sitution is for when the user gives details but details does not matches with any of the blogs.
      return res.status(404).send({ status: false, message: 'No blogs found' })
    }
    res.status(200).send({ status: true, message: 'Blogs list', data: blogs })
  } catch (error) {
    res.status(500).send({ status: false, msg: "Something went wrong", message: error.message });
  }
};

const updateBlogWithNewFeatures = async function (req, res) {
  try {
    const requestBody = req.body
    const blogId = req.params.blogId
    const authorIdFromToken = req.authorId

    if (!isValidObjectId(blogId)) {
      return res.status(400).send({ status: false, message: `${blogId} is not a valid blog id` })
    }
    if (!isValidObjectId(authorIdFromToken)) {
      return res.status(400).send({ status: false, message: `${authorIdFromToken} is not a valid token id` })
    }
    const blog = await blogModel.findOne({ _id: blogId, isDeleted: false })

    if (!blog) {
      res.status(404).send({ status: false, message: `Blog not found` })
      return
    }

    if (blog.authorId.toString() !== authorIdFromToken) { //here when blog.authorId will come we will convert it to the string for our safity and for easily check with others.
      res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
      return
    }
    const { title, body, tags, subcategory, isPublished } = requestBody;

    if (title) {
      await blogModel.findByIdAndUpdate({ _id: req.params.blogId }, { $set: { title: title } }, { new: true })
    }
    if (body) {
      await blogModel.findByIdAndUpdate({ _id: req.params.blogId }, { $set: { body: body } }, { new: true })
    }
    if (isValidArray(tags)) {
      await blogModel.findByIdAndUpdate({ _id: req.params.blogId }, { $addToSet: { tags: { $each: tags } } }, { new: true })
    }
    if (isValidArray(subcategory)) {
      await blogModel.findByIdAndUpdate({ _id: req.params.blogId }, { $addToSet: { subcategory: { $each: subcategory } } }, { new: true })
    }
    if (isPublished == true) {
      await blogModel.findByIdAndUpdate({ _id: req.params.blogId }, { $set: { isPublished: isPublished, publishedAt: new Date() } }, { new: true })
    }
    if (isPublished == false) {
      await blogModel.findByIdAndUpdate({ _id: req.params.blogId }, { $set: { isPublished: isPublished, publishedAt: null } }, { new: true })
    }

    const updatedBlog = await blogModel.findById({ _id: req.params.blogId });
    return res.status(200).send({ status: true, msg: "Blog updated successfully", data: updatedBlog });

  } catch (error) {
    res.status(500).send({ status: false, msg: "Something went wrong", message: error.message });
  }
};

const deleteBlogByID = async function (req, res) {
  try {
    const blogId = req.params.blogId
    const authorIdFromToken = req.authorId

    if (!isValidObjectId(blogId)) {
      res.status(400).send({ status: false, message: `${blogId} is not a valid blog id` })
    }

    if (!isValidObjectId(authorIdFromToken)) {
      res.status(400).send({ status: false, message: `${authorIdFromToken} is not a valid token id` })
    }

    const blog = await blogModel.findOne({ _id: blogId, isDeleted: false })

    if (!blog) {
      res.status(404).send({ status: false, message: `Blog not found` })
    }

    if (blog.authorId.toString() !== authorIdFromToken) {
      res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
    }

    await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: new Date() } })
    res.status(200).send({ status: true, message: `Blog deleted successfully` })
  } catch (error) {
    res.status(500).send({ status: false, msg: "Something went wrong", message: error.message });
  }
};

const deleteBlogByAttribute = async function (req, res) {
  try {
    const filterQuery = { isDeleted: false, deletedAt: null }
    const queryParams = req.query
    const authorIdFromToken = req.authorId

    if (!isValidObjectId(authorIdFromToken)) {
      res.status(400).send({ status: false, message: `${authorIdFromToken} is not a valid token id` })
    }
    const { authorId, category, tags, subcategory, isPublished } = queryParams

    if ((authorId) && isValidObjectId(authorId)) {
      filterQuery['authorId'] = authorId;
    }
    if (category) {
      filterQuery['category'] = category.trim();
    }
    if (tags) {
      filterQuery['tags'] = tags.trim();
    }
    if (subcategory) {
      filterQuery['subcategory'] = subcategory.trim();
    }
    if (isPublished) {
      filterQuery['isPublished'] = isPublished;
    }

    let blogs = await blogModel.find(filterQuery)

    if (Array.isArray(blogs) && blogs.length === 0) {
      res.status(404).send({ status: false, message: 'No matching blogs found' })
    }
    const idsOfBlogsToDelete = blogs.map(blog => {
      if (blog.authorId.toString() === authorIdFromToken) return blog._id
    })

    if (idsOfBlogsToDelete.length === 0) {
      res.status(404).send({ status: false, message: 'No blogs found' })
      return
    }

    await blogModel.updateMany({ _id: { $in: idsOfBlogsToDelete } }, { $set: { isDeleted: true, deletedAt: new Date(), isPublished: false, publishedAt: null } })

    res.status(200).send({ status: true, message: 'Blog(s) deleted successfully' });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
}

module.exports.createBlog = createBlog
module.exports.getAllBlogs = getAllBlogs
module.exports.updateBlogWithNewFeatures = updateBlogWithNewFeatures;
module.exports.deleteBlogByID = deleteBlogByID
module.exports.deleteBlogByAttribute = deleteBlogByAttribute