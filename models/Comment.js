const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

//Creating replies as a subdocument array for comments.
const ReplySchema = new Schema(
  {
    //Set custom id to avoid confusion with parent comment _id
    replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    replyBody: {
      type: String,
      required: true,
      trim: true
    },
    writtenBy: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    }
  },
  {
    toJSON: {
      getters: true
    },
  }
);

const CommentsSchema = new Schema(
  {
    writtenBy: {
      type: String,
      required: true
    },
    commentBody: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    },
    //Replies will be nested directly in a comment's document and not referred to.
    replies: [ReplySchema]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);


CommentsSchema.virtual('replyCount').get(function () {
  return this.replies.length;
});

const Comment = model('Comment', CommentsSchema);

module.exports = Comment;