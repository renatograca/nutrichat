import express from 'express';
import multer from 'multer';
import * as DocumentController from '../controllers/DocumentController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/documents - Ingest a PDF document
router.post('/', upload.single('file'), DocumentController.ingestDocument);

// GET /api/documents - Information about the endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Este endpoint aceita apenas POST para upload de documentos PDF.',
    usage: 'POST /api/documents com um arquivo PDF no campo "file", e "user_id" no corpo da requisição.'
  });
});

export default router;

