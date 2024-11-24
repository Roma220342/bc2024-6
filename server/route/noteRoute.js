const express = require('express');
const multer = require('multer');
const router = express.Router();
const noteControll = require('../controller/noteControll');
const upload = multer();

/**
 * @swagger
 * /notes/read/all:
 *   get:
 *     summary: Get all notes
 *     responses:
 *       200:
 *         description: Returns a list of all notes
 */
router.get('/read/all', noteControll.readAllNotes);

/**
 * @swagger
 * /notes/write:
 *   post:
 *     summary: Create a new note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note_name:
 *                 type: string
 *                 description: Name of the note
 *               note:
 *                 type: string
 *                 description: Content of the note
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/write', upload.none(), noteControll.createNote);

/**
 * @swagger
 * /notes/read/{note_name}:
 *   get:
 *     summary: Get a note by name
 *     parameters:
 *       - in: path
 *         name: note_name
 *         required: true
 *         description: Name of the note
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the note content
 *       404:
 *         description: Note not found
 */
router.get('/read/:note_name', noteControll.readNote);

/**
 * @swagger
 * /notes/update/{note_name}:
 *   put:
 *     summary: Update an existing note
 *     parameters:
 *       - in: path
 *         name: note_name
 *         required: true
 *         description: Name of the note to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 description: Updated content of the note
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       404:
 *         description: Note not found
 */
router.put('/update/:note_name', noteControll.updateNote);

/**
 * @swagger
 * /notes/delete/{note_name}:
 *   delete:
 *     summary: Delete a note by name
 *     parameters:
 *       - in: path
 *         name: note_name
 *         required: true
 *         description: Name of the note to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       404:
 *         description: Note not found
 */
router.delete('/delete/:note_name', noteControll.deleteNote);

/**
 * @swagger
 * /notes/UploadForm.html:
 *   get:
 *     summary: Serve the upload form
 *     responses:
 *       200:
 *         description: Returns the upload form HTML
 */
router.get('/UploadForm.html', noteControll.UploadForm);

module.exports = router;
