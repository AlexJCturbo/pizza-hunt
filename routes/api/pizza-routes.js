const router = require('express').Router();
const {
  getAllPizza,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza
} = require('../../controllers/pizza-controller')
/*Instead of importing the entire object and having to do
pizzaController.getAllPizza(), we can simply destructure the method
names out of the imported object and use those names directly.*/

//Set up GET all and POST endpoints at /api/pizzas
router
  .route('/')
  .get(getAllPizza)
  .post(createPizza);

//Set up GET one, PUT, and DELETE endpoints at /api/pizzas/:id
router
  .route('/:id')
  .get(getPizzaById)
  .put(updatePizza)
  .delete(deletePizza);

module.exports = router;


/*The following variations achieve the same goal:

//this code
router.route('/').get(getCallbackFunction).post(postCallbackFunction);

//is this same as this
router.get('/', getCallbackFunction);
router.post('/', postCallbackFunction);

*/