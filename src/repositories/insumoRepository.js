import db from '../config/database.js';

class InsumoRepository {

    async create(data) {
        const { nome, unidade_medida, estoque_minimo } = data;

        const [result] = await db.execute(
            `
            INSERT INTO insumos
                (nome, unidade_medida, estoque_minimo)
            VALUES
                (?, ?, ?)
            `,
            [
                nome,
                unidade_medida,
                estoque_minimo
            ]
        );

        return result.insertId;
    }

    async findAll() {
    const [rows] = await db.query(`
        SELECT
            i.id,
            i.nome,
            i.unidade_medida,
            i.estoque_minimo,

            COALESCE(
                SUM(
                    CASE
                        WHEN m.tipo = 'ENTRADA'
                            THEN m.quantidade

                        WHEN m.tipo IN ('SAIDA', 'PERDA')
                            THEN -m.quantidade

                        ELSE 0
                    END
                ),
                0
            ) AS estoque_atual

        FROM insumos i

        LEFT JOIN movimentacoes_estoque m
            ON m.insumo_id = i.id

        GROUP BY
            i.id,
            i.nome,
            i.unidade_medida,
            i.estoque_minimo

        ORDER BY i.id;
    `);

    return rows;
}
   async findCriticalStock() {

    const [rows] = await db.query(`
        SELECT
            i.id,
            i.nome,
            i.unidade_medida,
            i.estoque_minimo,

            COALESCE(
                SUM(
                    CASE
                        WHEN m.tipo = 'ENTRADA'
                            THEN m.quantidade

                        WHEN m.tipo IN ('SAIDA', 'PERDA')
                            THEN -m.quantidade

                        ELSE 0
                    END
                ),
                0
            ) AS estoque_atual

        FROM insumos i

        LEFT JOIN movimentacoes_estoque m
            ON m.insumo_id = i.id

        GROUP BY
            i.id,
            i.nome,
            i.unidade_medida,
            i.estoque_minimo

        HAVING
            COALESCE(
                SUM(
                    CASE
                        WHEN m.tipo = 'ENTRADA'
                            THEN m.quantidade

                        WHEN m.tipo IN ('SAIDA', 'PERDA')
                            THEN -m.quantidade

                        ELSE 0
                    END
                ),
                0
            ) <= i.estoque_minimo

        ORDER BY estoque_atual ASC;
    `);

    return rows;
}
    async findById(id) {

    const [rows] = await db.query(
        `
        SELECT
            id,
            nome,
            unidade_medida,
            estoque_minimo,
            created_at
        FROM insumos
        WHERE id = ?
        `,
        [id]
    );

    return rows[0];
}


async update(id, data) {

    const {
        nome,
        unidade_medida,
        estoque_minimo
    } = data;

    const [result] = await db.query(
        `
        UPDATE insumos
        SET
            nome = ?,
            unidade_medida = ?,
            estoque_minimo = ?
        WHERE id = ?
        `,
        [
            nome,
            unidade_medida,
            estoque_minimo,
            id
        ]
    );

    return result;
}


async hasMovements(id) {

    const [rows] = await db.query(
        `
        SELECT id
        FROM movimentacoes_estoque
        WHERE insumo_id = ?
        LIMIT 1
        `,
        [id]
    );

    return rows.length > 0;
}


async delete(id) {

    const [result] = await db.query(
        `
        DELETE FROM insumos
        WHERE id = ?
        `,
        [id]
    );

    return result;
}
}

export default new InsumoRepository();