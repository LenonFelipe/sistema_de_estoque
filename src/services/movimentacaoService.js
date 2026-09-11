import MovimentacaoRepository from '../repositories/MovimentacaoRepository.js';

class MovimentacaoService {
  async criarMovimentacao(data) {
    const { insumo_id, tipo, quantidade } = data;

    if (!insumo_id) throw new Error('Insumo obrigatório');
    if (!tipo) throw new Error('Tipo obrigatório');
    if (!quantidade || quantidade <= 0)
      throw new Error('Quantidade inválida');

    const saldo = await MovimentacaoRepository.getSaldo(insumo_id);

    if ((tipo === 'SAIDA' || tipo === 'PERDA') && quantidade > saldo) {
      throw new Error('Estoque insuficiente');
    }

    return await MovimentacaoRepository.create(data);
  }

  async consultarSaldo(insumo_id) {
    return await MovimentacaoRepository.getSaldo(insumo_id);
  }
}

export default new MovimentacaoService();