const express = require('express');
const router = express.Router();

//required Controllers -->
const authorController = require("../controller/authorController")
const blogController = require("../controller/blogController")
const middlewares = require("../middlewares/globalMiddleware")

//Author API's -->
router.post('/createAuthor', middlewares.emailValidator, authorController.createAuthor);
router.post('/loginforblog', authorController.loginforblog);

//Blog API's -->
router.post('/createBlog', middlewares.activityToken, blogController.createBlog);
router.get('/getAllBlogs', middlewares.activityToken, blogController.getAllBlogs);
router.put('/updateBlogWithNewFeatures/:blogId', middlewares.activityToken, blogController.updateBlogWithNewFeatures);
router.delete('/deleteBlogById/:blogId', middlewares.activityToken, blogController.deleteBlogByID);
router.delete('/deleteBlogByAttribute', middlewares.activityToken, blogController.deleteBlogByAttribute);

module.exports = router;