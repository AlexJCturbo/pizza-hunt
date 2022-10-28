const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

//creating the Schema
const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      required: true,
      trim: true
    },
    createdBy: {
      type: String,
      required: true,
      //trim removes white space before and after the input string.
      trim: true
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
      required: true,
      //enum option stands for enumerable, a term that refers to a set of data that can be iterated over —much like using the for...in loop to iterate through an object.
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
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
PizzaSchema.virtual('commentCount').get(function () {
  //return this.comments.length;
  //New code that will also consider replies in the comments count
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});
/*.reduce() method to tally up the total of every comment with its replies. In its basic form, .reduce() takes
two parameters, an accumulator and a currentValue. Here, the accumulator is total, and the currentValue is
comment. As .reduce() walks through the array, it passes the accumulating total and the current value of
comment into the function*/

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);



// export the Pizza model
module.exports = Pizza;



/*The .reduce() method can do more than just tally up sums, though. What if you needed to get the
average years of experience of a team of software developers? Sure, you could write a for loop
with some logic. Or, instead, you could write a clean map and reduce function.

Review the following code:

const developers = [
  {
    name: "Eliza",
    experience: 7,
    role: "manager"
  },
  {
    name: "Manuel",
    experience: 2,
    role: "developer"
  },
  {
    name: "Kim",
    experience: 5,
    role: "developer"
  }
];

function calculateAverage(total, years, index, array) {
  total += years;
  return index === array.length-1 ? total/array.length: total
}

const average = developers.map(dev => dev.experience).reduce(calculateAverage);

In this case, map grabs just the years of experience from each developer. Then .reduce() is
used to continually add on to a value within the scope of the method known as the accumulator,
then divide by the length of the entire array. The built-in .reduce() method is great for
calculating a value based off of the accumulation of values in an array.*/