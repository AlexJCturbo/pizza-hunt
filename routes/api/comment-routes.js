const router = require('express').Router();
const {
  postComment,
  deleteComment,
  addReply,
  deleteReply
} = require('../../controllers/comment-controller');

//POST callback /api/comments/<pizzaId>
router.route('/:pizzaId').post(postComment);

//PUT and DELETE replies in comment /api/comments/:pizzaId/:commentId
router
  .route('/:pizzaId/:commentId')
  //DELETE callback /api/comments/<pizzaId>/<commentId>
  .delete(deleteComment)
  /*PUT route to handle addReply by editing our existing comment route. This is a PUT route, instead of a POST, because technically we're not creating a new reply resource. Instead, we're updating the existing comment resource.*/
  .put(addReply);

//DELETE callback /api/comments/<pizzaId>/<commentId>/<replyId>
router.route('/:pizzaId/:commentId/:replyId').delete(deleteReply);

module.exports = router;