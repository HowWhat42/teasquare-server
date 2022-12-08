import { Router } from "express";
import { createAccount, deleteAccount, getAccount, getAccounts, setActiveAccount, editAccount, editAllAccounts, getAccountBalance, getAccountPositions } from "../controllers/accounts";

const router = Router();

router.get('/', getAccounts);
router.get('/:id', getAccount);
router.get('/:id/balance', getAccountBalance);
router.get('/:id/positions', getAccountPositions);
router.post('/', createAccount);
router.put('/', editAllAccounts);
router.put('/:id', editAccount);
router.put('/:id/active', setActiveAccount);
router.delete('/:id', deleteAccount);

export default router;