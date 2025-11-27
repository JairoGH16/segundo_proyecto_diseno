import { Router } from 'express';
import { BudgetController } from '../controllers/budget.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const budgetController = new BudgetController();

router.use(authMiddleware);

router.get('/', budgetController.getAll);
router.post('/', budgetController.create);

export default router;