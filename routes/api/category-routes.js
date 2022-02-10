const router = require('express').Router();
const { Category, Product } = require('../../models');

//******/ The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryAll = await Category.findAll({ include:[{model: Product}], });
    res.status(200).json(categoryAll);
  }
  catch (err){ res.status(500).json(err); }
  
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryOne = await Category.findByPk(req.params.id, {include:[{model: Product}],});
    if(!categoryOne){res.status(404).json({message: 'No Category found with that ID'}); return;}
    res.status(200).json(categoryOne);
  }
  catch (err){ res.status(500).json(err);}
});

router.post('/', (req, res) => {
  // create a new category
  try{
    const categoryNew = await Category.create(req.body);
    res.status(200).json(categoryNew);
  }
  catch (err){ res.status(400).json(err);}
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const cateDelete = await Category.destroy({ where: {id: req.params.id,},});
    if(!cateDelete){res.status(404).json({message: 'No Category found with that ID'}); return;}
    res.status(200).json(cateDelete);
  }
  catch (err){ res.status(500).json(err);}
});

module.exports = router;
