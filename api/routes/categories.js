const express = require('express')

const Category = require('../../models/Category')

const router = express.Router()

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }).populate({
      path: 'notes',
      options: {
        sort: { updatedAt: -1 }
      }
    }).lean()

    res.status(200).json({
      success: true,
      data: categories
    })
  }
  catch (err) {
    console.log(err)  
  }
})


// @route   GET api/categories/:id
// @desc    Get a single category
// @access  Public
router.get('/:id', async (req, res) => {
  const categoryId = req.params.id

  try {
    const category = await Category.findById(categoryId).populate({
      path: 'notes',
      options: {
        sort: { updatedAt: -1 }
      }
    })

    res.status(200).json({
      success: true,
      data: category
    })
  }
  catch (err) {
    console.log(err)  
  }
})


// @route   POST api/categories
// @desc    Create category
// @access  Public
router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body)

    res.status(200).json({
      success: true,
      data: category
    })
  }
  catch (err) {
    console.log(err)  
  }
})


// @route   PUT api/categories/:id
// @desc    Update category
// @access  Public
router.put('/:id', async (req, res) => {
  const categoryId = req.params.id

  try {
    const category = await Category.findByIdAndUpdate(categoryId, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      success: true,
      data: category
    })
  }
  catch (err) {
    console.log(err)  
  }
})


// @route   DELETE api/categories/:id
// @desc    Delete category
// @access  Public
router.delete('/:id', async (req, res) => {
  const categoryId = req.params.id

  try {
    const category = await Category.findById(categoryId)

    await category.remove()

    res.status(200).json({
      success: true,
      data: 'Category deleted'
    })
  }
  catch (err) {
    console.log(err)
  }
})

module.exports = router