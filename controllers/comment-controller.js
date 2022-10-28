const { Pizza, Comment } = require('../models');

const commentController = {
  //Add a comment to pizza
  postComment({ params, body }, res) {
    //console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        /*We're also returning the pizza Promise here so that we can do something with the results of the Mongoose operation. Again, because we passed the option of new: true, we're receiving back the updated pizza (the pizza with the new comment included).*/
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          //All of the MongoDB-based functions like $push start with a dollar sign ($)
          { $push: { comments: _id } },
          { new: true }
        );
      })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this ID!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },

  //Add a reply
  /*we're passing params here as a parameter, so we'll need to make sure we pass it to addReply() when we implement it later in the route.*/
  addReply({ params, body }, res) {
    //console.log(body);
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body } },
      { new: true, runValidators: true }
    )
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this ID!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },

  //Delete a comment
  deleteComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then(deletedComment => {
        if (!deletedComment) {
          return res.status(404).json({ message: 'No comment with this ID!' });
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },

  //Delete a reply
  deleteReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      /*Here, we're using the MongoDB $pull operator to remove the specific reply from the replies array where the replyId matches the value of params.replyId passed in from the route.*/
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.json(err));
  }

}

module.exports = commentController;