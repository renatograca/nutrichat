import express from 'express';
import multer from 'multer';
import * as DocumentController from '../controllers/DocumentController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/documents - Ingest a PDF document
router.post('/', upload.single('file'), DocumentController.ingestDocument);

export default router;
