import insumoService from "../services/insumoService.js";

class InsumoController {

    async store(req, res, next) {

        try {

            const id = await insumoService.createInsumo(req.body);

            return res.status(201).json({
                id
            });

        } catch (error) {

            next(error);

        }
    }

    async index(req, res, next) {

        try {

            const insumos = await insumoService.listInsumos();

            return res.json(insumos);

        } catch (error) {

            next(error);

        }
    }

    async criticalStock(req, res, next) {

        try {

            const insumos = await insumoService.getCriticalStock();

            return res.json(insumos);

        } catch (error) {

            next(error);

        }
    }

    async update(req, res) {

    try {

        const { id } = req.params;

        const result =
            await insumoService.updateInsumo(
                id,
                req.body
            );

        return res.status(200).json({
            message: "Insumo atualizado com sucesso",
            result
        });

    } catch (error) {

        return res.status(400).json({
            error: error.message
        });

    }

}


async delete(req, res) {

    try {

        const { id } = req.params;

        await insumoService.deleteInsumo(id);

        return res.status(200).json({
            message: "Insumo excluído com sucesso"
        });

    } catch (error) {

        return res.status(400).json({
            error: error.message
        });

    }

}
}

export default new InsumoController();