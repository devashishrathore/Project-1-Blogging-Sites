const express = require('express');
const router = express.Router();
const authorController= require("../controller/authorController")
const blogController= require("../controller/blogController")
const middlewares= require("../middlewares/globalMiddleware")

router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});


router.post('/createAuthor', middlewares.emailValidator ,authorController.createAuthor);
router.post('/createBlog',middlewares.activityToken, blogController.createBlog);
router.get('/getAllBlogs', blogController.getAllBlogs);
router.post('/deleteBlogById/:blogId' ,middlewares.activityToken,blogController.deleteBlogById);
router.post('/deleteBlogByAttribute', blogController.deleteBlogByAttribute);
router.post('/loginforblog', blogController.loginforblog);

router.put('/updateBlogWithNewFeatures/:blogId',middlewares.activityToken, blogController.updateBlogWithNewFeatures);
module.exports = router;