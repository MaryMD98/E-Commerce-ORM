const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

//*******/ The `/api/tags` endpoint

  // find all tags
  // be sure to include its associated Product data
router.get('/', async (req, res) => {
  try{
    const allTags = await Tag.findAll({
      include: [{model: Product, through:ProductTag, as:'many_products' }]
    });
    res.status(200).json(allTags);
  }
  catch (err){ res.status(500).json(err); }
});

  // find a single tag by its `id`
  // be sure to include its associated Product data
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{model: Product, through:ProductTag, as:'many_products' }] 
    });
    if(!tagData){ res.status(404).json({ message: 'No tag found with that ID' }); return; }
    res.status(200).json(tagData);
  }
  catch (err) {  res.status(500).json(err); }
});

// create a new tag
router.post('/', async (req, res) => {
  try {
    const createTag = await Tag.create(req.body);
    // if there are product tags we need to create taggin
    if(req.body.productIds.length){
      const TagArr = req.body.productIds.map((product_id) => {return {tag_id:createTag.id, product_id,}; });
      const arrayTag = await ProductTag.bulkCreate(TagArr);
      res.status(200).json(arrayTag); return;
    }
    res.status(200).json(createTag);
  }
  catch (err){res.status(500).json(err)}
});

 // update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {}
  catch (err) {res.status(500).json(err);}
});

// delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const tagDelete = await Tag.destroy({ where: {id: req.params.id} });
    if(!tagDelete){res.status(404).json({ message: 'No tag found with that id'}); return; }
    res.status(200).json(tagDelete);
  }
  catch (err) { res.status(500).json(err);}
});

module.exports = router;
