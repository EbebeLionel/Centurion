const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const modelsDir = path.join(uploadsDir, 'models');
const imagesDir = path.join(uploadsDir, 'images');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir);
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

// Multer configuration for 3D model files
const modelStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, modelsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.original_name));
  }
});

// Multer configuration for images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.original_name));
  }
});

// File filter for 3D models
const modelFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.obj', '.fbx', '.gltf', '.glb', '.dae', '.3ds', '.blend', '.stl', '.ply'];
  const fileExtension = path.extname(file.original_name).toLowerCase();
  
  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only 3D model files are allowed.'), false);
  }
};

// File filter for images
const imageFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  const fileExtension = path.extname(file.original_name).toLowerCase();
  
  if (allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only image files are allowed.'), false);
  }
};

// Multer instances
const uploadModel = multer({
  storage: modelStorage,
  fileFilter: modelFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// API Routes

// Upload 3D model file
app.post('/api/upload-model', uploadModel.single('modelFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.original_name,
      path: `/uploads/models/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype
    };

    res.json({
      message: 'Model file uploaded successfully',
      file: fileInfo
    });
  } catch (error) {
    console.error('Error uploading model file:', error);
    res.status(500).json({ error: 'Failed to upload model file' });
  }
});

// Upload image file
app.post('/api/upload-image', uploadImage.single('imageFile'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.original_name,
      path: `/uploads/images/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype
    };

    res.json({
      message: 'Image file uploaded successfully',
      file: fileInfo
    });
  } catch (error) {
    console.error('Error uploading image file:', error);
    res.status(500).json({ error: 'Failed to upload image file' });
  }
});

// Upload complete model (both image and 3D file)
app.post('/api/upload-complete-model', (req, res) => {
  const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        if (file.fieldname === 'modelFile') {
          cb(null, modelsDir);
        } else if (file.fieldname === 'imageFile') {
          cb(null, imagesDir);
        } else {
          cb(new Error('Invalid field name'), false);
        }
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.original_name));
      }
    }),
    fileFilter: function (req, file, cb) {
      if (file.fieldname === 'modelFile') {
        modelFileFilter(req, file, cb);
      } else if (file.fieldname === 'imageFile') {
        imageFileFilter(req, file, cb);
      } else {
        cb(new Error('Invalid field name'), false);
      }
    },
    limits: {
      fileSize: 50 * 1024 * 1024 // 50MB limit
    }
  }).fields([
    { name: 'modelFile', maxCount: 1 },
    { name: 'imageFile', maxCount: 1 }
  ]);

  upload(req, res, function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message });
    }

    try {
      const result = {
        modelFile: null,
        imageFile: null
      };

      if (req.files.modelFile && req.files.modelFile[0]) {
        const modelFile = req.files.modelFile[0];
        result.modelFile = {
          filename: modelFile.filename,
          originalName: modelFile.original_name,
          path: `/uploads/models/${modelFile.filename}`,
          size: modelFile.size,
          mimetype: modelFile.mimetype
        };
      }

      if (req.files.imageFile && req.files.imageFile[0]) {
        const imageFile = req.files.imageFile[0];
        result.imageFile = {
          filename: imageFile.filename,
          originalName: imageFile.original_name,
          path: `/uploads/images/${imageFile.filename}`,
          size: imageFile.size,
          mimetype: imageFile.mimetype
        };
      }

      res.json({
        message: 'Files uploaded successfully',
        files: result
      });
    } catch (error) {
      console.error('Error processing uploaded files:', error);
      res.status(500).json({ error: 'Failed to process uploaded files' });
    }
  });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});