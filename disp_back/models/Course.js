// const mongoose = require('mongoose');

// const chapterSchema = new mongoose.Schema({
//     title: String,
//     fileUrl: String,
// });

// const courseSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     category: { type: String, required: true },
//     photoUrl: String,
//     chapters: [chapterSchema],
//     additionalDocs: [{ title: String, fileUrl: String }],
//     instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
// });

// module.exports = mongoose.model('Course', courseSchema);

const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    title: String,
    description: String,
    fileUrl: String,
    videoUrl: String,
});

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    photoUrl: String,
    chapters: [chapterSchema],
    additionalDocs: [{ title: String, fileUrl: String }],
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true },
});

module.exports = mongoose.model('Course', courseSchema);
