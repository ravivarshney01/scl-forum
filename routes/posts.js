const express = require('express');
const router = express.Router();
const postController = require('../app/api/controllers/posts');

router.get('/', postController.getMyFeed);
router.get('/user/:username', postController.getMyPosts);
router.post('/', postController.create);
router.get('/all', postController.getAll);
router.get('/:post_id', postController.getById);
router.post('/:post_id/comment', postController.addNewComment);
router.post('/:post_id/comment/delete', postController.deleteComment);
router.post('/:post_id/like', postController.like);
router.post('/:post_id/unlike', postController.unlike);
router.delete('/:post_id/delete', postController.deletePost);
router.put('/:post_id/update', postController.updatePost);
module.exports = router;