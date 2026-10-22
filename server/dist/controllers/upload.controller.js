"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMultipleUpload = exports.handleSingleUpload = void 0;
const handleSingleUpload = (req, res) => {
    if (!req.file) {
        res.status(400).json({ ok: false, error: 'No image file uploaded.' });
        return;
    }
    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    res.json({
        ok: true,
        data: {
            url: fileUrl,
            filename: req.file.filename,
            size: req.file.size,
            mimetype: req.file.mimetype,
        },
    });
};
exports.handleSingleUpload = handleSingleUpload;
const handleMultipleUpload = (req, res) => {
    const files = req.files;
    if (!files || files.length === 0) {
        res.status(400).json({ ok: false, error: 'No image files uploaded.' });
        return;
    }
    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';
    const uploaded = files.map((f) => ({
        url: `${protocol}://${host}/uploads/${f.filename}`,
        filename: f.filename,
        size: f.size,
        mimetype: f.mimetype,
    }));
    res.json({
        ok: true,
        data: uploaded,
    });
};
exports.handleMultipleUpload = handleMultipleUpload;
