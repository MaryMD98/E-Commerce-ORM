const router = require('express').Router();
const { Category, Product } = require('../../models');

//******/ The `/api/categories` endpoint

// find all categories
// be sure to include its associated Products
router.get('/', async (req, res) => {
  try {
    const categoryAll = await Category.findAll({ include:[{model: Product}], });
    res.status(200).json(categoryAll);
  }
  catch (err){ res.status(500).json(err); }
  
});

 // find one category by its `id` value
  // be sure to include its associated Products
router.get('/:id', async (req, res) => {
  try {
    const categoryOne = await Category.findByPk(req.params.id, {include:[{model: Product}],});
    if(!categoryOne){res.status(404).json({message: 'No Category found with that ID'}); return;}
    res.status(200).json(categoryOne);
  }
  catch (err){ res.status(500).json(err);}
});

 // create a new category
router.post('/', async (req, res) => {
  try{
    const categoryNew = await Category.create(req.body);
    res.status(200).json(categoryNew);
  }
  catch (err){ res.status(400).json(err);}
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const categoryPut = await Category.update(
      { category_name: req.body.category_name,},
      { where: {id: req.params.id,}, }
    );
    if(!categoryPut[0]){res.status(404).json({message: 'No Category found with that ID'});return;}
    res.status(200).json(categoryPut);
  }
  catch (err){ res.status(500).json(err);}
});

// delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const cateDelete = await Category.destroy({ where: {id: req.params.id,},});
    if(!cateDelete){res.status(404).json({message: 'No Category found with that ID'}); return;}
    res.status(200).json(cateDelete);
  }
  catch (err){ res.status(500).json(err);}
});

module.exports = router;
