import { Router } from 'express';
import MovimentacaoController from '../controllers/MovimentacaoController.js';

const router = Router();

router.post('/', MovimentacaoController.store);
router.get('/saldo/:insumo_id', MovimentacaoController.saldo);

export default router;