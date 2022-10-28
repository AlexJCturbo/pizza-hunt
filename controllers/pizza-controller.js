const { Pizza } = require('../models');

const pizzaController = {
  /*Because these methods will be used as the callback functions for the Express.js
  routes, each will take two parameters: req and res.*/

  //Get all pizzas. We use the Mongoose .find() method, much like the Sequelize .findAll() method.
  getAllPizza(req, res) {
    Pizza.find({})
      /*In MongoDB we can populate a field like comments. To populate a field, just chain the
      .populate() method onto your query, passing in an object with the key path plus the
      value of the field you want populated.*/
      .populate({
        path: 'comments',
        select: '-__v'
        /*We also used the select option inside populate() to tell Moongose that we don't care
        about the __v field on comments either. The minus sign - in front of the field indicates
        that we don't want it to be returned. If we didn't have it, it would mean that it would
        return only the __v field.*/
      })
      //update the query to not include the pizza's __v field either.
      .select('-__v')

      /*Using .sort() method to sort in DESC order by the _id value.*/
      .sort({ _id: -1 })

      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //Get one pizza by id. We use the Mongoose .findOne() method to find a single pizza by its _id
  getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
      .populate({
        path: 'comments',
        select: '-__v'
      })
      .select('-__v')
      .then(dbPizzaData => {
        //If statement to make sure Mongo received the data. If no pizza is found send 404
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        //If data is found, we send back res.json with the dbPizzaData.
        res.json(dbPizzaData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //create a pizza.
  /*With .createPizza() method, we destructure the body out of the Express.js req object
  because we don't need to interface with any of the other data it provides.
  Then, we use Mongoose .create() method to create the pizza*/
  createPizza({ body }, res) {
    Pizza.create(body)
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.status(400).json(err));
  },

  //Update a pizza. Using the Mongoose findOneAndUpdate() method.
  /* If we don't set that third parameter, { new: true }, it will return the original
  document. By setting the parameter to true, we're instructing Mongoose to return the
  new version of the document.*/
  updatePizza({ params, body }, res) {
    //Also can use in place of body the operator {$set: {<field to update>: body.<new value>}}
    Pizza.findOneAndUpdate(
      { _id: params.id },
      body,
      { new: true, runValidators: true }
    )
      //parameter new when true will make Mongoose return the updated document with changes
      //Include runValidators: true setting when updating data so that it knows to validate any new information.
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        //If data is found, we send back res.json with the dbPizzaData. Because we used parameter new: true, this res will have the updated data.
        res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  },
  /*There are also Mongoose and MongoDB methods called .updateOne(), .updateMany(),
  .deleteOne() or .deleteMany() which update documents without returning them.*/

  //Delete a pizza using the findOneAndDelete() method.
  deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        //as the pizza was deleted we can send back true as follows:
        //res.json(true);
        res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  }
};

module.exports = pizzaController;


/*This style of writing object methods is another new feature of JavaScript.
We can now write them in one of two ways, as shown in the following example:

const dogObject = {
  // this...
  bark: function() {
    console.log('Woof!');
  },

  // ... is the same as this
  bark() {
    console.log('Woof!');
  }
}

*/