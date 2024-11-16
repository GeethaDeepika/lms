const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

router.post('/add-course', async (req, res) => {
    try {
        const { title, description, category, instructorId } = req.body;

        alert('TEST', req)

        const course = new Course({
            title,
            description,
            category,
            instructorId,
            photoUrl: req.files['photo'] ? `/uploads/${req.files['photo'][0].filename}` : null,
            chapters: req.files['chapterFiles[]']?.map((file, i) => ({
                title: req.body['chapters[]'][i],
                fileUrl: `/uploads/${file.filename}`,
            })) || [],
            additionalDocs: req.files['docFiles[]']?.map((file, i) => ({
                title: req.body['documents[]'][i],
                fileUrl: `/uploads/${file.filename}`,
            })) || [],
        });

        const savedCourse = await course.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add course' });
    }
});

module.exports = router;
