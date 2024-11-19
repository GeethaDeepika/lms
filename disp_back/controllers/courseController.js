const Course = require('../models/Course');

exports.addCourse = async (req, res) => {
    try {
        const { title, description, category, instructorId } = req.body;

        const chapters = req.body['chapters[]'] || [];
        const descriptions = req.body['chapterDescriptions[]'] || [];
        const chapterFiles = req.files['chapterFiles[]'] || [];
        const chapterVideos = req.files['chapterVideos[]'] || [];

        const chapterData = chapters.map((chapterTitle, index) => ({
            title: chapterTitle,
            description: descriptions[index] || null,
            fileUrl: chapterFiles[index] ? `/uploads/${chapterFiles[index].filename}` : null,
            videoUrl: chapterVideos[index] ? `/uploads/${chapterVideos[index].filename}` : null,
        }));

        const course = new Course({
            title,
            description,
            category,
            instructorId,
            photoUrl: req.files['photo'] ? `/uploads/${req.files['photo'][0].filename}` : null,
            chapters: chapterData,
            additionalDocs: req.files['docFiles[]']?.map((file, i) => ({
                title: req.body['documents[]'][i],
                fileUrl: `/uploads/${file.filename}`,
            })) || [],
        });

        const savedCourse = await course.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
