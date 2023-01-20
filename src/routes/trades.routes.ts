import { Router } from "express";
import { getTrades, getTrade, getTradesById, newTrade, closeTrade, getOpenTrades, closeTradeById } from "../controllers/trades";

const router = Router();

router.get('/', getTrades);
router.get('/account/:accountId', getTradesById);
router.get('/open', getOpenTrades);
router.post('/', newTrade);
router.post('/close/:id', closeTradeById);
router.post('/traders', closeTrade);

export default router;