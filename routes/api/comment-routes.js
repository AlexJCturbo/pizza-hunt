const router = require('express').Router();
const {
  postComment,
  deleteComment,
  addReply,
  deleteReply
} = require('../../controllers/comment-controller');

//POST route /api/comments/<pizzaId>
router.route('/:pizzaId').post(postComment);

//DELETE and PUT routes in /api/comments/:pizzaId/:commentId
router
  .route('/:pizzaId/:commentId')
  .delete(deleteComment)
  .put(addReply);

//DELETE route /api/comments/<pizzaId>/<commentId>/<replyId>
router.route('/:pizzaId/:commentId/:replyId').delete(deleteReply);

module.exports = router;