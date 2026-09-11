import insumoRepository from "../repositories/insumoRepository.js";

class InsumoService {

    async createInsumo(data) {

        const { nome, unidade_medida, estoque_minimo } = data;

        if (!nome) {
            throw new Error("Nome é obrigatório");
        }

        if (!unidade_medida) {
            throw new Error("Unidade de medida é obrigatória");
        }

        if (estoque_minimo == null) {
            throw new Error("Estoque mínimo é obrigatório");
        }

        return await insumoRepository.create({
            nome,
            unidade_medida,
            estoque_minimo
        });
    }

    async listInsumos() {

        return await insumoRepository.findAll();

    }

    async getCriticalStock() {

        return await insumoRepository.findCriticalStock();

    }

    async updateInsumo(id, data) {

    const { nome, unidade_medida, estoque_minimo } = data;

    if (!id) {
        throw new Error("ID do insumo é obrigatório");
    }

    if (!nome) {
        throw new Error("Nome é obrigatório");
    }

    if (!unidade_medida) {
        throw new Error("Unidade de medida é obrigatória");
    }

    if (estoque_minimo == null) {
        throw new Error("Estoque mínimo é obrigatório");
    }

    const insumo =
        await insumoRepository.findById(id);

    if (!insumo) {
        throw new Error("Insumo não encontrado");
    }

    return await insumoRepository.update(id, {
        nome,
        unidade_medida,
        estoque_minimo
    });
}


async deleteInsumo(id) {

    if (!id) {
        throw new Error("ID do insumo é obrigatório");
    }

    const insumo =
        await insumoRepository.findById(id);

    if (!insumo) {
        throw new Error("Insumo não encontrado");
    }

    const hasMovements =
        await insumoRepository.hasMovements(id);

    if (hasMovements) {

        throw new Error(
            "Não é possível excluir este insumo porque ele possui movimentações registradas"
        );

    }

    return await insumoRepository.delete(id);
}
}

export default new InsumoService();