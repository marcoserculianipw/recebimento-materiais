import { Router } from 'express';
import { ReceivingController } from '../controllers/receivingController.js';

const router = Router();

router.get('/recebimentos', ReceivingController.getAll);
router.get('/recebimentos/:id', ReceivingController.getById);
router.post('/recebimentos', ReceivingController.create);
router.post('/sharepoint/upload', ReceivingController.uploadPhoto);

export default router;
