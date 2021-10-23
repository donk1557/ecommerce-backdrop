const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const catData = await Category.findAll({
      include: [{ model: Product }],
      attributes: {
        include: [ 
          [
            sequelize.literal(
              '(SELECT * FROM product WHERE product.category_id = category.id)'
            ),
            'categorizedProducts',
          ],
        ],
      },
    });
    res.status(200).json(catData);
  } catch (err) {
    res.status(500).json(err);
  }

});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const catData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
      attributes: {
        include: [ 
          [
            sequelize.literal(
              '(SELECT * FROM product WHERE product.category_id = category.id)'
            ),
            'categorizedProducts',
          ],
        ],
      },
    });
    if (!catData) {
      res.status(404).json({ message: 'Category does not exist!' });
      return;
    }
    res.status(200).json(catData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new category
  try {
    const catData = await Category.create(req.body);
    res.status(200).json(catData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(
    {
      // update fields
      id: req.body.id,
      category_name: req.body.category_name,
    },
    {
      // based on given parameters
      where: {
        id: req.params.id,
      },
    }
  )
    .then((updates) => {
      res.json(updates);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  try {
    const catData = await Category.destroy({
      where: { id: req.params.id }
    });
    if (!catData) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    }
    res.status(200).json(tripData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
