const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

//creating the Schema
const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String
    },
    createdBy: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      /*Using getters to transform the date. Every time we retrieve a pizza, the value in
      the createdAt field will be formatted by the dateFormat() function and used instead
      of the default timestamp value. This way, we can use the timestamp value for storage,
      but use a prettier version of it for display.*/
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      default: 'Large'
    },
    toppings: [],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  //Virtuals allow you to add virtual properties to a document that aren't stored in the database.
  //To tell Mongoose the pizza schema can use virtuals we add the toJSON property.
  //Likewise, use new date format we tell Mongoose it should use the getter function in the toJSON property.
  {
    toJSON: {
      virtuals: true,     //Telling Mongoose it should use vituals
      getters: true       //Telling Mongoose it should use getters
    },
    //Set id to false because this is a virtual and we don’t need it.
    id: false
  }
);

//Get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);



// export the Pizza model
module.exports = Pizza;