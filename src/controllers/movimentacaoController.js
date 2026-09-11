import MovimentacaoService from '../services/MovimentacaoService.js';

class MovimentacaoController {
  async store(req, res, next) {
    try {
      const id = await MovimentacaoService.criarMovimentacao(req.body);
      res.status(201).json({ id });
    } catch (error) {
      next(error);
    }
  }

  async saldo(req, res, next) {
    try {
      const { insumo_id } = req.params;
      const saldo = await MovimentacaoService.consultarSaldo(insumo_id);
      res.json({ saldo });
    } catch (error) {
      next(error);
    }
  }
}

export default new MovimentacaoController();