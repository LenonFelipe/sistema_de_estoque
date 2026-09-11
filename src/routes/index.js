import { Router } from 'express';
import insumoRoutes from './insumo.routes.js';
import movimentacaoRoutes from './movimentacao.routes.js';

const routes = Router();

routes.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

routes.use('/insumos', insumoRoutes);
routes.use('/movimentacoes_estoque', movimentacaoRoutes);

export default routes;