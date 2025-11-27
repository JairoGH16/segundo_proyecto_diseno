import { Router } from 'express';
import { DebtController } from '../controllers/debt.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const debtController = new DebtController();

router.use(authMiddleware);

router.get('/', debtController.getAll);
router.post('/', debtController.create);

export default router;