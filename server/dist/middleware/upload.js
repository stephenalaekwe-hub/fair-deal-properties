"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const uploadDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase() || '.jpg';
        const safeBase = path_1.default.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        const unique = crypto_1.default.randomBytes(6).toString('hex');
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
exports.uploadImage = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15MB max per picture
    },
    fileFilter: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        // Explicitly reject any video MIME type or video extension
        if (file.mimetype.startsWith('video/') || ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v', '.3gp'].includes(ext)) {
            return cb(new Error('VIDEO_NOT_ALLOWED: Only picture uploads are permitted. Videos are strictly prohibited.'));
        }
        if (ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(ext)) {
            cb(null, true);
        }
        else {
            cb(new Error('INVALID_FILE_TYPE: Only image files (PNG, JPG, WebP) are permitted. Videos and non-image documents are not accepted.'));
        }
    },
});
