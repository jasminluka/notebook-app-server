const express = require('express')

const Note = require('../../models/Note')
const Category = require('../../models/Category')

const router = express.Router()

// @route   GET api/notes
// @desc    Get all notes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 }).populate({
      path: 'category',
      select: 'title'
    }).lean()

    res.status(200).json({
      success: true,
      data: notes
    })
  }
  catch (err) {
    console.log(err)  
  }
})


// @route   GET api/notes/search?searchWord=school
// @route   GET api/notes/search?searchWord=school&categoryId=604a756cd4d82b193cc45586
// @desc    Search for notes
// @access  Public
router.get('/search', async (req, res) => {
  const { searchWord, categoryId } = req.query

  try {
    const matchWord = new RegExp(searchWord, 'i')

    let notes

    if (categoryId) {
      notes = await Note.find({
        category: categoryId,
        '$or': [
          { title: matchWord },
          { body: matchWord },
        ]
      }).sort({ updatedAt: -1 }).populate({
        path: 'category',
        select: 'title'
      }).lean()
    }
    else {
      notes = await Note.find({
        '$or': [
          { title: matchWord },
          { body: matchWord },
        ]
      }).sort({ updatedAt: -1 }).populate({
        path: 'category',
        select: 'title'
      }).lean()
    }

    res.status(200).json({
      success: true,
      data: notes
    })
  }
  catch (err) {
    console.log(err)  
  }
})


// @route   GET api/notes/category/:id
// @desc    Get all notes for category
// @access  Public
router.get('/category/:id', async (req, res) => {
  const categoryId = req.params.id
  try {
    const notes = await Note.find({
      category: categoryId
    }).sort({ updatedAt: -1 }).populate({
      path: 'category',
      select: 'title'
    }).lean()

    res.status(200).json({
      success: true,
      data: notes
    })
  }
  catch (err) {
    console.log(err)  
  }
})


// @route   GET api/notes/:id
// @desc    Get a single note
// @access  Public
router.get('/:id', async (req, res) => {
  const noteId = req.params.id

  try {
    const note = await Note.findById(noteId).populate({
      path: 'category',
      select: 'title'
    })

    res.status(200).json({
      success: true,
      data: note
    })
  }
  catch (err) {
    console.log(err)  
  }
})


// @route   POST api/notes
// @desc    Post note
// @access  Public
router.post('/', async (req, res) => {
  try {
    const note = await Note.create(req.body)

    res.status(200).json({
      success: true,
      data: note
    })
  }
  catch (err) {
    console.log(err)
  }
})


// @route   POST api/notes/category/:categoryId/notes
// @desc    Post note for category
// @access  Public
router.post('/category/:categoryId/notes', async (req, res) => {
  const categoryId = req.params.categoryId
  req.body.category = categoryId

  try {
    const category = await Category.findById(categoryId)

    if (!category) { throw new Error('Category not found') }
    
    const note = await Note.create(req.body)

    res.status(200).json({
      success: true,
      data: note
    })
  }
  catch (err) {
    console.log(err)  
  }
})


// @route   PUT api/notes/map/note/:id
// @desc    Add marker on map
// @access  Public
router.put('/map/note/:id', async (req, res) => {
  const noteId = req.params.id
  const address = req.body.address

  try {
    let note = await Note.findByIdAndUpdate(noteId)

    note.address = address

    note = await note.save()

    res.status(200).json({
      success: true,
      data: note
    })
  }
  catch (err) {
    console.log(err)  
  }
})


// @route   PUT api/notes/:noteId/category/:categoryId
// @desc    Add note category
// @access  Public
router.put('/:noteId/category/:categoryId', async (req, res) => {
  const { noteId, categoryId } = req.params

  try {
    const category = await Category.findById(categoryId)

    if (!category) { throw new Error('Category not found') }

    let note = await Note.findById(noteId)

    note.category = categoryId
    note = await note.save()

    res.status(200).json({
      success: true,
      data: note
    })
  }
  catch (err) {
    console.log(err)  
  }
})


// @route   PUT api/notes/:id
// @desc    Update note
// @access  Public
router.put('/:id', async (req, res) => {
  const noteId = req.params.id
  const { title, body } = req.body

  const fieldsToUpdate = {
    title,
    body
  }

  try {
    const note = await Note.findByIdAndUpdate(noteId, fieldsToUpdate, {
      new: true,
      runValidators: true,
      omitUndefined: true
    })

    res.status(200).json({
      success: true,
      data: note
    })
  }
  catch (err) {
    console.log(err)  
  }
})


// @route   DELETE api/notes/:id
// @desc    Delete note
// @access  Public
router.delete('/:id', async (req, res) => {
  const noteId = req.params.id

  try {
    const note = await Note.findById(noteId)

    await note.remove()

    res.status(200).json({
      success: true,
      data: 'Note deleted'
    })
  }
  catch (err) {
    console.log(err)
  }
})

module.exports = router