const express = require('express');
const  postController = require('../controllers/posts.controller');
const router = express.Router();

router.get("/:id", postController.getPostById);
router.get("/", postController.getAllPosts);
router.post("/", postController.addPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

module.exports = router;