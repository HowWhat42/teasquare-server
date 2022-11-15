import { Router } from "express";
import { createAccount, deleteAccount, getAccount, getAccounts, setActiveAccount, editAccount } from "../controllers/accounts";

const router = Router();

router.get('/', getAccounts);
router.get('/:id', getAccount);
router.post('/', createAccount);
router.put('/:id', editAccount);
router.put('/:id/active', setActiveAccount);
router.delete('/:id', deleteAccount);

export default router;