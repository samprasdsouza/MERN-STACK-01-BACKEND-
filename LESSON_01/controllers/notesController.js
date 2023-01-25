const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')

// @desc Get all Notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
    // Get all notes from MongoDB
    const notes = await Note.find().lean()

    // if no notes
    if (!notes) {
        return res.status(400).json({ message: 'No Notes found'})
    }

    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await user.findById(note.user).lean().exec()
        return {...note, username: user.username}
    }))

    return res.json(notesWithUser)
})

// @desc Create New Notes
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
    const { title, text, user } = req.body
    
    //confirm data
    if (!user || !text || !title) {
        return res.status(400).json({message : 'All fields are required'})
    }

    // check for note exists
    const duplicate = await Note.findOne({ title }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    const note = await Note.create({ user, title, text})

    if (note) {
        return res.status(201).json({ message: 'New note created' })
    } else {
        return res.status(400).json({ message: 'Invalid note data received' })
    }

})

// @desc Update a Notes
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed} = req.body

    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm note exits to update
    const note = await Note.findOne(id).exec()
    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec()

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()

    return res.json(`'${updatedNote.title}' updated`)

})

// @desc Delete a Note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body
    // Confirm data

    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const result = await note.deleteOne()

    const reply = `Note '${result.title}' with ID ${result._id} deleted`

    return res.json(reply)
})

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}