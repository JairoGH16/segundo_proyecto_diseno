import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const accountController = new AccountController();

router.use(authMiddleware);

router.get('/', accountController.getAll);
router.get('/:id', accountController.getById);
router.post('/', accountController.create);
router.put('/:id', accountController.update);
router.delete('/:id', accountController.delete);

export default router;