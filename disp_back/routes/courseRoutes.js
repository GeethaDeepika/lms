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
    { name: 'chapterVideos[]' },
    { name: 'docFiles[]' },
]), async (req, res) => {
    try {
        const { title, description, category, chapters = [], chapterDescriptions = [], documents = [], instructorId } = req.body;

        console.log(req.files); // Debugging uploaded files
        console.log(req.body);  // Debugging form fields

        const photoUrl = req.files['photo'] ? await uploadToS3(req.files['photo'][0]) : null;
        const chapterFileUrls = req.files['chapterFiles[]']
            ? await Promise.all(req.files['chapterFiles[]'].map(file => uploadToS3(file)))
            : [];
        const chapterVideoUrls = req.files['chapterVideos[]']
            ? await Promise.all(req.files['chapterVideos[]'].map(file => uploadToS3(file)))
            : [];
        const documentUrls = req.files['docFiles[]']
            ? await Promise.all(req.files['docFiles[]'].map(file => uploadToS3(file)))
            : [];

        const chapterData = chapters.map((title, i) => ({
            title,
            description: chapterDescriptions[i] || null,
            fileUrl: chapterFileUrls[i] || null,
            videoUrl: chapterVideoUrls[i] || null,
        }));

        const documentData = documents.map((title, i) => ({
            title,
            fileUrl: documentUrls[i] || null,
        }));

        const course = new Course({
            title,
            description,
            category,
            instructorId,
            photoUrl,
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

// Get course details by course ID
router.get('/course/:courseId', async (req, res) => {
    try {
        const { courseId } = req.params;

        // Find the course by ID
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).json({ error: 'Failed to fetch course details' });
    }
});





module.exports = router;


