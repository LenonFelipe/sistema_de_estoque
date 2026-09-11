import { Router } from "express";

import insumoController from "../controllers/insumoController.js";

const router = Router();

router.post("/", insumoController.store);

router.get("/", insumoController.index);

router.get("/critical", insumoController.criticalStock);

router.put("/:id", insumoController.update);

router.delete("/:id", insumoController.delete);

export default router;