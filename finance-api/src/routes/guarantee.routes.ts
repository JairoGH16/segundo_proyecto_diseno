import { Router } from 'express';
import { GuaranteeController } from '../controllers/guarantee.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const guaranteeController = new GuaranteeController();

router.use(authMiddleware);

router.get('/', guaranteeController.getAll);
router.post('/', guaranteeController.create);

export default router;