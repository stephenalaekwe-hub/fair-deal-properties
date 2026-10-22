import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const unique = crypto.randomBytes(6).toString('hex');
    cb(null, `${safeBase}-${Date.now()}-${unique}${ext}`);
  },
});

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

export const uploadImage = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max per picture
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // Explicitly reject any video MIME type or video extension
    if (file.mimetype.startsWith('video/') || ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v', '.3gp'].includes(ext)) {
      return cb(new Error('VIDEO_NOT_ALLOWED: Only picture uploads are permitted. Videos are strictly prohibited.'));
    }

    if (ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('INVALID_FILE_TYPE: Only image files (PNG, JPG, WebP) are permitted. Videos and non-image documents are not accepted.'));
    }
  },
});
