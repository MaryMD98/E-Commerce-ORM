const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// ******* The `/api/products` endpoint **********

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const allProducts = await Product.findAll({
     // include: [{ model: Tag, through: ProductTag, as: 'many_products' }]
      include: [{ model: Category }, { model: Tag, through: ProductTag, as: 'many_tags'}]
    });
    res.status(200).json(allProducts);
  } 
  catch (err){ res.status(500).json(err); }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{model: Category}, {model:Tag, through: ProductTag, as: 'many_tags'}]
    });
    // if there was no infomation found by the chosen id return error
    if (!productData){ res.status(404).json({ message: 'No product found with that id!' }); return; }
    res.status(200).json(productData);
  }
  catch (err) { res.status(500).json(err); }
});

// create new product
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
router.post('/', async (req, res) => {
  try {
    const productCreate = await Product.create(req.body);
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if(req.body.tagIds.length){
        const productTagArr = req.body.tagIds.map((tag_id) => { return {product_id: productCreate.id, tag_id,}; });
        const productinTAg = await ProductTag.bulkCreate(productTagArr);
        res.status(200).json(productinTAg); return;
    }
    // if no product tags, just respond
    res.status(200).json(productCreate);
  }
  catch (err){ res.status(400).json(err);}
});

///Update Product data by its Id
router.put('/:id', async (req,res) => {
  try {
    const productUpdate = await Product.update(req.body, {where: {id: req.params.id,},});
    if (!productUpdate){ res.status(404).json({ message: 'No product found with that id!' }); return; }
    // find all associated tags from ProductTag
    const allProducts = await ProductTag.findAll({ where: {product_id: req.params.id} });
    // get list of current tag_ids
    const producTAGS = allProducts.map(({ tag_id }) => tag_id);
    // create filtered list of new tag_ids
    const newProductTags = req.body.tagIds.filter((tag_id) => !producTAGS.includes(tag_id))
        .map((tag_id) => { return {product_id: req.params.id, tag_id,}; });

    // figure out which ones to remove
    const productTagsToRemove = allProducts.filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

    const OldTAgs = await ProductTag.destroy({ where: { id: productTagsToRemove } });
    const NewProdutTags = await ProductTag.bulkCreate(newProductTags);

    res.status(200).json(NewProdutTags);
  }
  catch (err) {res.status(400).json(err);}
});

 // delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try{
    const productDelete = await Product.destroy({ where: { id: req.params.id } });
    if(!productDelete){res.status(404).json({ message: 'No product found with that id'});}
    res.status(200).json(productDelete);
  }
  catch (err) { res.status(500).json(err); }
});

module.exports = router;
