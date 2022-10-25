const { Pizza } = require('../models');

const pizzaController = {
  /*Because these methods will be used as the callback functions for the Express.js
  routes, each will take two parameters: req and res.*/

  //Get all pizzas. We use the Mongoose .find() method, much like the Sequelize .findAll() method.
  getAllPizza(req, res) {
    Pizza.find({})
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //Get one pizza by id. We use the Mongoose .findOne() method to find a single pizza by its _id
  getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
      .then(dbPizzaData => {
        //If no pizza is found send 404
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
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
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
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
        res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  }

}

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
