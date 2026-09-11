import db from '../config/database.js';

class MovimentacaoRepository {
  async create({ insumo_id, tipo, quantidade, motivo }) {
    const [result] = await db.execute(
      `INSERT INTO movimentacoes_estoque
       (insumo_id, tipo, quantidade, motivo)
       VALUES (?, ?, ?, ?)`,
      [insumo_id, tipo, quantidade, motivo]
    );

    return result.insertId;
  }

  async getSaldo(insumo_id) {
    const [rows] = await db.execute(
      `SELECT 
        SUM(CASE WHEN tipo = 'ENTRADA' THEN quantidade ELSE 0 END)
        -
        SUM(CASE WHEN tipo IN ('SAIDA','PERDA') THEN quantidade ELSE 0 END)
        AS saldo
       FROM movimentacoes_estoque
       WHERE insumo_id = ?`,
      [insumo_id]
    );

    return rows[0].saldo || 0;
  }
}

export default new MovimentacaoRepository();