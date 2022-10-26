const router = require ('express').Router();
const {postComment, deleteComment} = require ('../../controllers/comment-controller');

//POST callback /api/comments/<pizzaId>
router.route('/:pizzaId').post(postComment);

//DELETE callback /api/comments/<pizzaId>/<commentId>
router.route('/:pizzaId/:commentId').delete(deleteComment);

module.exports = router;