import express from 'express';
import {
  getAllServices,
  createService,
  initializeServices,
} from '../controllers/serviceController.js';

const router = express.Router();

router.get('/', getAllServices);
router.post('/', createService);
router.post('/initialize', initializeServices);

export default router;

