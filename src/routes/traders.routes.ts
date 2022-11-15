import { Router } from "express";
import { createTrader, deleteTrader, editTrader, getTrader, getTraders } from "../controllers/traders";

const router = Router();

router.get('/', getTraders);
router.get('/:id', getTrader);
router.post('/', createTrader);
router.put('/:id', editTrader);
router.delete('/:id', deleteTrader);

export default router;