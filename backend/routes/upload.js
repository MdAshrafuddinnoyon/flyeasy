const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authRequired, adminRequired } = require('../middleware/auth');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type! Please upload an image or video.'), false);
    }
  }
});

// @route   POST /api/upload
// @desc    Upload an image to local storage
// @access  Private (All users)
router.post('/', authRequired, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Return the public URL
  // We will serve /public/uploads as /uploads in server.js
  const fileUrl = `/uploads/${req.file.filename}`;
  
  res.json({ 
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename
  });
});

const fs = require('fs');

// @route   GET /api/upload
// @desc    Get list of all uploaded images and static images
// @access  Admin
router.get('/', authRequired, adminRequired, (req, res) => {
  const getImagesFromDir = (dirPath, urlPrefix) => {
    if (!fs.existsSync(dirPath)) return [];
    try {
      const files = fs.readdirSync(dirPath);
      return files
        .filter(f => !f.startsWith('.') && (f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png') || f.endsWith('.gif') || f.endsWith('.webp') || f.endsWith('.mp4') || f.endsWith('.webm')))
        .map(f => {
          const stats = fs.statSync(path.join(dirPath, f));
          return {
            id: f,
            url: `${urlPrefix}${f}`,
            filename: f,
            size: stats.size,
            created_at: stats.mtime
          };
        });
    } catch (e) {
      console.error('Error reading directory:', e);
      return [];
    }
  };

  const uploadsDir = path.join(__dirname, '../public/uploads/');
  const imagesDirProd = path.join(__dirname, '../public/images/');
  const imagesDirDev = path.join(__dirname, '../../frontend/public/images/');

  const uploadedImages = getImagesFromDir(uploadsDir, '/uploads/');
  const staticImagesProd = getImagesFromDir(imagesDirProd, '/images/');
  const staticImagesDev = getImagesFromDir(imagesDirDev, '/images/');

  // Use a Map or Set to avoid duplicates if both exist
  const allMap = new Map();
  [...staticImagesDev, ...staticImagesProd, ...uploadedImages].forEach(img => {
    allMap.set(img.filename, img);
  });

  const allImages = Array.from(allMap.values()).sort((a, b) => b.created_at - a.created_at);
  
  // Pagination logic
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  
  if (!isNaN(page) && !isNaN(limit)) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedImages = allImages.slice(startIndex, endIndex);
    return res.json({
      data: paginatedImages,
      total: allImages.length,
      page,
      limit,
      totalPages: Math.ceil(allImages.length / limit)
    });
  }
  
  res.json(allImages);
});

// @route   DELETE /api/upload/:filename
// @desc    Delete an uploaded image
// @access  Admin
router.delete('/:filename', authRequired, adminRequired, (req, res) => {
  const filename = req.params.filename;
  // Prevent directory traversal
  if (filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }
  
  const dirsToCheck = [
    path.join(__dirname, '../public/uploads/'),
    path.join(__dirname, '../public/images/'),
    path.join(__dirname, '../../frontend/public/images/')
  ];

  let deleted = false;
  for (const dir of dirsToCheck) {
    const filePath = path.join(dir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      deleted = true;
    }
  }

  if (deleted) {
    res.json({ message: 'File deleted successfully' });
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// @route   POST /api/upload/bulk-delete
// @desc    Delete multiple uploaded media files
// @access  Admin
router.post('/bulk-delete', authRequired, adminRequired, (req, res) => {
  const { filenames } = req.body;
  if (!Array.isArray(filenames)) {
    return res.status(400).json({ error: 'filenames array is required' });
  }

  const dirsToCheck = [
    path.join(__dirname, '../public/uploads/'),
    path.join(__dirname, '../public/images/'),
    path.join(__dirname, '../../frontend/public/images/')
  ];

  let deletedCount = 0;
  for (const filename of filenames) {
    if (!filename || filename.includes('..') || filename.includes('/')) {
      continue; // Skip invalid filenames
    }
    
    let fileDeleted = false;
    for (const dir of dirsToCheck) {
      const filePath = path.join(dir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        fileDeleted = true;
      }
    }
    if (fileDeleted) deletedCount++;
  }

  res.json({ message: `Successfully deleted ${deletedCount} files.` });
});

module.exports = router;
