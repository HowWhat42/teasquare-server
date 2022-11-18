import { Router } from "express";
import { getTrades, getTrade, getTradesById } from "../controllers/trades";

const router = Router();

router.get('/', getTrades);
router.get('/account/:accountId', getTradesById);
router.get('/:id', getTrade);

export default router;