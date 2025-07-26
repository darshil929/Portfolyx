const express = require('express');
const multer = require('multer');
const { exportPortfolio, importPortfolio } = require('../controllers/portfolioController');
const { TokenVerify } = require('../middlewares/tokenVerify');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'), false);
        }
    }
});

router.get('/:id/export', exportPortfolio);
router.post('/import', TokenVerify, upload.single('file'), importPortfolio);

module.exports = { PortfolioExportRoutes: router };