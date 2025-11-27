import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const transactionController = new TransactionController();

router.use(authMiddleware);

router.get('/', transactionController.getAll);
router.post('/', transactionController.create);
router.put('/:id', transactionController.update);
router.delete('/:id', transactionController.delete);

export default router;