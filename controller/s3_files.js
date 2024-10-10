const express = require('express');
const multer = require('multer');
const s3Services = require('../services/S3_uploads/s3_file_storage');

const uploadFileToS3Controller = async (req, res) => {
        const data = await s3Services.uploadFileToS3(req.file);
        res.send(data);
};

const upload = multer({ dest: 'uploads/' });

const router = express.Router();
router.post('/uploads', upload.single('file'), uploadFileToS3Controller);

module.exports = router;