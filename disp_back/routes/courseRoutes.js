const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Enrollment = require('../models/enrollment');
const multer = require('multer');
const AWS = require('aws-sdk');

// Configure multer to store files in memory
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const aws_part_two = 'LsqsxXo3QYFVRBWmrUhL'

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: 'AKIASFUIROVIUQ3KAWHW',
    secretAccessKey: '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',
    region: 'eu-north-1'
});

// Function to upload files to S3
function uploadToS3(file) {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: 'mytest75',
            Key: Date.now() + '-' + file.originalname, // Use a unique file name
            Body: file.buffer, // The file buffer from multer
            ContentType: file.mimetype,
            ACL: 'public-read', // Make the file publicly accessible
        };

        s3.upload(params, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data.Location); // Return the publicly accessible S3 URL
        });
    });
}

router.post('/add-course', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'chapterFiles[]' },
    { name: 'docFiles[]' }
]), async (req, res) => {
    try {
        const { title, description, category, chapters = [], documents = [], instructorId } = req.body;

        // Debugging to check what files and body data are received
        console.log(req.files); // This will show what files are in the request
        console.log(req.body); // This will show the form fields, including chapters[]

        // Handle photo upload
        const photoUrl = req.files['photo'] ? await uploadToS3(req.files['photo'][0]) : null;

        // Handle chapter file uploads
        const chapterUrls = req.files['chapterFiles[]']
            ? await Promise.all(req.files['chapterFiles[]'].map(file => uploadToS3(file)))
            : [];

        // Handle document file uploads
        const documentUrls = req.files['docFiles[]']
            ? await Promise.all(req.files['docFiles[]'].map(file => uploadToS3(file)))
            : [];

        // Handle the chapters titles and file URLs mapping
        const chapterData = chapters && Array.isArray(chapters)
            ? chapters.map((title, i) => ({
                title,
                fileUrl: chapterUrls[i] || null
            }))
            : [];

        // Handle the documents titles and file URLs mapping
        const documentData = Array.isArray(req.body['documents[]'])
            ? req.body['documents[]'].map((title, i) => ({
                title,
                fileUrl: documentUrls[i] || null
            }))
            : [];

        // Build the course object
        const course = new Course({
            title,
            description,
            category,
            instructorId: instructorId,
            photoUrl: photoUrl,
            chapters: chapterData,
            additionalDocs: documentData,
        });

        const savedCourse = await course.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add course' });
    }
});

router.get('/courses', async (req, res) => {
    try {
        const instructorId = req.query.instructorId; // Get instructorId from the query parameter

        if (!instructorId) {
            return res.status(400).json({ error: 'Instructor ID is required' });
        }

        // Fetch courses for the given instructorId
        const courses = await Course.find({ instructorId }, 'title'); // Only select the title field

        res.status(200).json(courses); // Send the list of course titles
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// Fetch all available courses for students
router.get('/allcourses', async (req, res) => {
    try {
        const courses = await Course.find({}, 'title photoUrl');
        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});


// POST: Enroll a student in a course
router.post('/enroll', async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        // Check if enrollment already exists
        const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
        if (existingEnrollment) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        // Create new enrollment
        const enrollment = new Enrollment({ studentId, courseId });
        await enrollment.save();

        res.status(201).json({ message: 'Enrollment successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to enroll in course' });
    }
});

router.get('/my-courses/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const enrollments = await Enrollment.find({ studentId }).populate('courseId', 'title photoUrl');
        res.status(200).json(enrollments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch enrolled courses' });
    }
});




module.exports = router;


